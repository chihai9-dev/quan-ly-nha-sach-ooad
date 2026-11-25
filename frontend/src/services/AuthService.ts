import { ITaiKhoanRepository } from '@/repositories/ITaiKhoanRepository';
import { TaiKhoanRepository } from '@/repositories/TaiKhoanRepository';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import type {
  ChangePasswordDTO,
  ForgotPasswordDTO,
  LoginDTO,
  SessionUserDTO,
} from '@/types/dtos';

/**
 * AuthService — Tầng dịch vụ Xác thực Người dùng hệ thống
 * Áp dụng Dependency Inversion với ITaiKhoanRepository.
 */
export class AuthService {
  private readonly taiKhoanRepo: ITaiKhoanRepository;

  constructor(taiKhoanRepo: ITaiKhoanRepository = new TaiKhoanRepository()) {
    this.taiKhoanRepo = taiKhoanRepo;
  }

  /**
   * Use Case: Đăng nhập (Người dùng hệ thống)
   */
  async dangNhap(dto: LoginDTO): Promise<SessionUserDTO> {
    if (!dto.tenDangNhap.trim() || !dto.matKhau) {
      throw new Error('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
    }

    const record = await this.taiKhoanRepo.findByUsername(dto.tenDangNhap);
    if (!record) {
      throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác.');
    }

    const { taiKhoan, nhanVien } = record;
    if (!taiKhoan.trangThai) {
      throw new Error('Tài khoản này đã bị vô hiệu hóa. Vui lòng liên hệ Quản lý.');
    }

    const passwordValid = verifyPassword(dto.matKhau, taiKhoan.matKhauHash);
    if (!passwordValid) {
      throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác.');
    }

    const vaiTro = taiKhoan.vaiTro;
    return {
      tenDangNhap: taiKhoan.tenDangNhap,
      maNV: nhanVien.maNV,
      hoTen: nhanVien.hoTen,
      email: nhanVien.email || taiKhoan.emailKhoiPhuc,
      maVaiTro: vaiTro?.maVaiTro ?? 'NGUOI_DUNG_HE_THONG',
      tenVaiTro: vaiTro?.tenVaiTro ?? 'Người dùng hệ thống',
      danhSachQuyen: vaiTro ? [...vaiTro.danhSachQuyen] : ['DANG_NHAP', 'DANG_XUAT'],
    };
  }

  /**
   * Use Case: Quên mật khẩu (Người dùng hệ thống)
   */
  async quenMatKhau(dto: ForgotPasswordDTO): Promise<{ message: string; recoveryOtpHint: string }> {
    const record = await this.taiKhoanRepo.findByUsername(dto.tenDangNhap);
    if (!record) {
      throw new Error('Không tìm thấy tài khoản trong hệ thống.');
    }

    const { taiKhoan } = record;
    if (!taiKhoan.quenMatKhau(dto.emailKhoiPhuc)) {
      throw new Error('Email khôi phục không khớp hoặc tài khoản đã bị khóa.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return {
      message: `Mã xác thực OTP đã được gửi đến email ${taiKhoan.emailKhoiPhuc}.`,
      recoveryOtpHint: otp,
    };
  }

  /**
   * Use Case: Đổi mật khẩu (Người dùng hệ thống)
   */
  async doiMatKhau(tenDangNhap: string, dto: ChangePasswordDTO): Promise<void> {
    if (!dto.matKhauMoi || dto.matKhauMoi.length < 6) {
      throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự.');
    }

    const record = await this.taiKhoanRepo.findByUsername(tenDangNhap);
    if (!record) {
      throw new Error('Không tìm thấy tài khoản.');
    }

    const validOld = verifyPassword(dto.matKhauCu, record.taiKhoan.matKhauHash);
    if (!validOld) {
      throw new Error('Mật khẩu cũ không chính xác.');
    }

    const newHash = hashPassword(dto.matKhauMoi);
    await this.taiKhoanRepo.updatePasswordHash(tenDangNhap, newHash);
  }
}
