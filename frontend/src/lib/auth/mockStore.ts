import { ACTOR_CODES, ACTOR_METADATA } from './permissions';
import { VaiTro } from '@/models/VaiTro';
import { NhanVien } from '@/models/NhanVien';
import { TaiKhoan } from '@/models/TaiKhoan';

/**
 * Mật khẩu mặc định cho 3 tài khoản mẫu khi chạy Mock Fallback: "123456"
 */
const DEFAULT_SEED_HASH =
  'seed_salt_2026:c1f7ae0fcc0acc157bdd3c1a6a82acd46a15e4882b67d49311921217de791b675cd4ec3bb6bb8c3ba0eb9ca6410da1b7c2cb1ebf9744641ae09855996de2802e';

class MockAuthStore {
  public roles: Map<string, VaiTro> = new Map();
  public staff: Map<string, NhanVien> = new Map();
  public accounts: Map<string, TaiKhoan> = new Map();

  constructor() {
    // Khởi tạo các Actor khớp sơ đồ Use Case Tổng quát
    (Object.keys(ACTOR_CODES) as Array<keyof typeof ACTOR_CODES>).forEach((code) => {
      const meta = ACTOR_METADATA[code];
      this.roles.set(
        code,
        new VaiTro({
          maVaiTro: code,
          tenVaiTro: meta.tenVaiTro,
          danhSachQuyen: meta.defaultPermissions,
        })
      );
    });

    const nvQuanLy = new NhanVien({
      maNV: 'NV002',
      hoTen: 'Lê Thị Quản Lý',
      soDienThoai: '0901000002',
      email: 'quanly@bookstore.vn',
      diaChi: 'Q.3, TP.HCM',
      ngayVaoLam: '2024-02-15',
    });
    const nvBanHang = new NhanVien({
      maNV: 'NV003',
      hoTen: 'Nguyễn Văn Bán Hàng',
      soDienThoai: '0901000003',
      email: 'banhang@bookstore.vn',
      diaChi: 'Q.5, TP.HCM',
      ngayVaoLam: '2024-05-20',
    });
    const nvKho = new NhanVien({
      maNV: 'NV004',
      hoTen: 'Phạm Minh Thủ Kho',
      soDienThoai: '0901000004',
      email: 'thukho@bookstore.vn',
      diaChi: 'Q.10, TP.HCM',
      ngayVaoLam: '2024-06-01',
    });

    [nvQuanLy, nvBanHang, nvKho].forEach((nv) => this.staff.set(nv.maNV, nv));

    const accQuanLy = new TaiKhoan({
      tenDangNhap: 'quanly',
      matKhauHash: DEFAULT_SEED_HASH,
      emailKhoiPhuc: 'quanly@bookstore.vn',
      trangThai: true,
      vaiTro: this.roles.get(ACTOR_CODES.QUAN_LY) ?? null,
      maNV: nvQuanLy.maNV,
    });
    const accBanHang = new TaiKhoan({
      tenDangNhap: 'banhang',
      matKhauHash: DEFAULT_SEED_HASH,
      emailKhoiPhuc: 'banhang@bookstore.vn',
      trangThai: true,
      vaiTro: this.roles.get(ACTOR_CODES.NHAN_VIEN_BAN_HANG) ?? null,
      maNV: nvBanHang.maNV,
    });
    const accThuKho = new TaiKhoan({
      tenDangNhap: 'thukho',
      matKhauHash: DEFAULT_SEED_HASH,
      emailKhoiPhuc: 'thukho@bookstore.vn',
      trangThai: true,
      vaiTro: this.roles.get(ACTOR_CODES.NHAN_VIEN_KHO) ?? null,
      maNV: nvKho.maNV,
    });

    [accQuanLy, accBanHang, accThuKho].forEach((acc) =>
      this.accounts.set(acc.tenDangNhap, acc)
    );
  }
}

// Giữ singleton trên globalThis qua các lần HMR trong Next.js dev mode
const globalForMock = globalThis as unknown as { __mockAuthStore?: MockAuthStore };
export const mockAuthStore: MockAuthStore =
  globalForMock.__mockAuthStore ?? (globalForMock.__mockAuthStore = new MockAuthStore());
