import { ITaiKhoanRepository } from '@/repositories/ITaiKhoanRepository';
import { TaiKhoanRepository } from '@/repositories/TaiKhoanRepository';
import { IVaiTroRepository } from '@/repositories/IVaiTroRepository';
import { VaiTroRepository } from '@/repositories/VaiTroRepository';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import type {
  ChangePasswordDTO,
  CreateAccountDTO,
  ForgotPasswordDTO,
  LoginDTO,
  SessionUserDTO,
} from '@/types/dtos';
import type { VaiTro } from '@/models/VaiTro';

export interface AccountSummaryDTO {
  tenDangNhap: string;
  maNV: string;
  hoTen: string;
  emailKhoiPhuc: string;
  trangThai: boolean;
  maVaiTro: string;
  tenVaiTro: string;
}

/**
 * AuthService — Tầng dịch vụ Xác thực & Phân quyền Hệ thống
 * Áp dụng Dependency Inversion với ITaiKhoanRepository & IVaiTroRepository.
 */
export class AuthService {
  private readonly taiKhoanRepo: ITaiKhoanRepository;
  private readonly vaiTroRepo: IVaiTroRepository;

  constructor(
    taiKhoanRepo: ITaiKhoanRepository = new TaiKhoanRepository(),
    vaiTroRepo: IVaiTroRepository = new VaiTroRepository()
  ) {
    this.taiKhoanRepo = taiKhoanRepo;
    this.vaiTroRepo = vaiTroRepo;
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
      throw new Error('Tài khoản này đã bị vô hiệu hóa. Vui lòng liên hệ Quản trị viên.');
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

  /**
   * Use Case: Lấy danh sách Vai trò (Actor) để phân quyền
   */
  async layDanhSachVaiTro(): Promise<VaiTro[]> {
    return this.vaiTroRepo.findAll();
  }

  /**
   * Use Case: Phân quyền hệ thống (Quản trị viên)
   */
  async phanQuyen(maVaiTro: string, danhSachQuyen: string[]): Promise<VaiTro> {
    const role = await this.vaiTroRepo.findByCode(maVaiTro);
    if (!role) {
      throw new Error(`Không tìm thấy vai trò "${maVaiTro}".`);
    }
    return this.vaiTroRepo.updatePermissions(maVaiTro, danhSachQuyen);
  }

  /**
   * Use Case: Quản lý tài khoản (Quản trị viên)
   */
  async layDanhSachTaiKhoan(): Promise<AccountSummaryDTO[]> {
    const records = await this.taiKhoanRepo.findAll();
    return records.map(({ taiKhoan, nhanVien }) => ({
      tenDangNhap: taiKhoan.tenDangNhap,
      maNV: nhanVien.maNV,
      hoTen: nhanVien.hoTen,
      emailKhoiPhuc: taiKhoan.emailKhoiPhuc,
      trangThai: taiKhoan.trangThai,
      maVaiTro: taiKhoan.vaiTro?.maVaiTro ?? 'NGUOI_DUNG_HE_THONG',
      tenVaiTro: taiKhoan.vaiTro?.tenVaiTro ?? 'Người dùng hệ thống',
    }));
  }

  async taoTaiKhoan(dto: CreateAccountDTO): Promise<AccountSummaryDTO> {
    if (!dto.tenDangNhap.trim() || dto.tenDangNhap.trim().length < 3) {
      throw new Error('Tên đăng nhập phải có ít nhất 3 ký tự.');
    }
    if (!dto.matKhau || dto.matKhau.length < 6) {
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự.');
    }

    const hash = hashPassword(dto.matKhau);
    const { taiKhoan, nhanVien } = await this.taiKhoanRepo.createAccount(dto, hash);

    return {
      tenDangNhap: taiKhoan.tenDangNhap,
      maNV: nhanVien.maNV,
      hoTen: nhanVien.hoTen,
      emailKhoiPhuc: taiKhoan.emailKhoiPhuc,
      trangThai: taiKhoan.trangThai,
      maVaiTro: taiKhoan.vaiTro?.maVaiTro ?? dto.maVaiTro,
      tenVaiTro: taiKhoan.vaiTro?.tenVaiTro ?? dto.maVaiTro,
    };
  }

  async capNhatTrangThaiTaiKhoan(tenDangNhap: string, trangThai: boolean): Promise<void> {
    await this.taiKhoanRepo.updateStatus(tenDangNhap, trangThai);
  }
}
