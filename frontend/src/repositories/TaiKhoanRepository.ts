import { supabase } from '@/lib/supabase/client';
import { TaiKhoan } from '@/models/TaiKhoan';
import { NhanVien } from '@/models/NhanVien';
import { VaiTro } from '@/models/VaiTro';
import { mockAuthStore } from '@/lib/auth/mockStore';
import type { CreateAccountDTO } from '@/types/dtos';
import type { AccountWithStaffRecord, ITaiKhoanRepository } from './ITaiKhoanRepository';

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes('placeholder.supabase.co'));
}

export class TaiKhoanRepository implements ITaiKhoanRepository {
  async findAll(): Promise<AccountWithStaffRecord[]> {
    if (!isSupabaseConfigured()) {
      return this.getMockRecords();
    }

    try {
      const [accountsRes, staffRes, rolesRes] = await Promise.all([
        supabase.from('tai_khoan').select('*').order('ten_dang_nhap'),
        supabase.from('nhan_vien').select('*'),
        supabase.from('vai_tro').select('*'),
      ]);

      if (accountsRes.error || !accountsRes.data || accountsRes.data.length === 0) {
        return this.getMockRecords();
      }

      const staffMap = new Map(
        (staffRes.data ?? []).map((nv) => [
          nv.ma_nv,
          new NhanVien({
            maNV: nv.ma_nv,
            hoTen: nv.ho_ten,
            soDienThoai: nv.so_dien_thoai ?? '',
            email: nv.email ?? '',
            diaChi: nv.dia_chi ?? '',
            ngayVaoLam: nv.ngay_vao_lam,
            createdAt: nv.created_at,
            updatedAt: nv.updated_at,
          }),
        ])
      );

      const roleMap = new Map(
        (rolesRes.data ?? []).map((vt) => [
          vt.ma_vai_tro,
          new VaiTro({
            maVaiTro: vt.ma_vai_tro,
            tenVaiTro: vt.ten_vai_tro,
            danhSachQuyen: vt.danh_sach_quyen,
            createdAt: vt.created_at,
            updatedAt: vt.updated_at,
          }),
        ])
      );

      const records: AccountWithStaffRecord[] = [];
      for (const acc of accountsRes.data) {
        const nhanVien =
          staffMap.get(acc.ma_nv) ??
          new NhanVien({
            maNV: acc.ma_nv,
            hoTen: acc.ten_dang_nhap,
            soDienThoai: '',
            email: acc.email_khoi_phuc ?? '',
            diaChi: '',
          });
        const vaiTro = roleMap.get(acc.ma_vai_tro) ?? null;

        const taiKhoan = new TaiKhoan({
          tenDangNhap: acc.ten_dang_nhap,
          matKhauHash: acc.mat_khau_hash,
          emailKhoiPhuc: acc.email_khoi_phuc ?? '',
          trangThai: acc.trang_thai,
          vaiTro,
          maNV: acc.ma_nv,
          createdAt: acc.created_at,
          updatedAt: acc.updated_at,
        });
        nhanVien.taiKhoan = taiKhoan;
        records.push({ taiKhoan, nhanVien });
      }
      return records;
    } catch {
      return this.getMockRecords();
    }
  }

  async findByUsername(tenDangNhap: string): Promise<AccountWithStaffRecord | null> {
    const cleanUsername = tenDangNhap.trim();
    if (!isSupabaseConfigured()) {
      const tk = mockAuthStore.accounts.get(cleanUsername);
      if (!tk || !tk.maNV) return null;
      const nv = mockAuthStore.staff.get(tk.maNV);
      if (!nv) return null;
      return { taiKhoan: tk, nhanVien: nv };
    }

    try {
      const { data: acc, error } = await supabase
        .from('tai_khoan')
        .select('*')
        .eq('ten_dang_nhap', cleanUsername)
        .single();

      if (error || !acc) {
        const tk = mockAuthStore.accounts.get(cleanUsername);
        const nv = tk?.maNV ? mockAuthStore.staff.get(tk.maNV) : null;
        return tk && nv ? { taiKhoan: tk, nhanVien: nv } : null;
      }

      const [staffRes, roleRes] = await Promise.all([
        supabase.from('nhan_vien').select('*').eq('ma_nv', acc.ma_nv).single(),
        supabase.from('vai_tro').select('*').eq('ma_vai_tro', acc.ma_vai_tro).single(),
      ]);

      const vaiTro = roleRes.data
        ? new VaiTro({
            maVaiTro: roleRes.data.ma_vai_tro,
            tenVaiTro: roleRes.data.ten_vai_tro,
            danhSachQuyen: roleRes.data.danh_sach_quyen,
            createdAt: roleRes.data.created_at,
            updatedAt: roleRes.data.updated_at,
          })
        : null;

      const taiKhoan = new TaiKhoan({
        tenDangNhap: acc.ten_dang_nhap,
        matKhauHash: acc.mat_khau_hash,
        emailKhoiPhuc: acc.email_khoi_phuc ?? '',
        trangThai: acc.trang_thai,
        vaiTro,
        maNV: acc.ma_nv,
        createdAt: acc.created_at,
        updatedAt: acc.updated_at,
      });

      const nvRow = staffRes.data;
      const nhanVien = new NhanVien({
        maNV: nvRow?.ma_nv ?? acc.ma_nv,
        hoTen: nvRow?.ho_ten ?? acc.ten_dang_nhap,
        soDienThoai: nvRow?.so_dien_thoai ?? '',
        email: nvRow?.email ?? acc.email_khoi_phuc ?? '',
        diaChi: nvRow?.dia_chi ?? '',
        ngayVaoLam: nvRow?.ngay_vao_lam,
        taiKhoan,
      });

      return { taiKhoan, nhanVien };
    } catch {
      const tk = mockAuthStore.accounts.get(cleanUsername);
      const nv = tk?.maNV ? mockAuthStore.staff.get(tk.maNV) : null;
      return tk && nv ? { taiKhoan: tk, nhanVien: nv } : null;
    }
  }

  async createAccount(
    dto: CreateAccountDTO,
    passwordHash: string
  ): Promise<AccountWithStaffRecord> {
    if (!isSupabaseConfigured()) {
      if (mockAuthStore.accounts.has(dto.tenDangNhap.trim())) {
        throw new Error(`Tên đăng nhập "${dto.tenDangNhap}" đã tồn tại.`);
      }
      const role = mockAuthStore.roles.get(dto.maVaiTro) ?? null;
      if (!role) {
        throw new Error(`Vai trò "${dto.maVaiTro}" không tồn tại.`);
      }

      const nhanVien = new NhanVien({
        maNV: dto.maNV,
        hoTen: dto.hoTen,
        soDienThoai: dto.soDienThoai ?? '',
        email: dto.emailKhoiPhuc,
        diaChi: dto.diaChi ?? '',
      });
      const taiKhoan = new TaiKhoan({
        tenDangNhap: dto.tenDangNhap,
        matKhauHash: passwordHash,
        emailKhoiPhuc: dto.emailKhoiPhuc,
        trangThai: true,
        vaiTro: role,
        maNV: nhanVien.maNV,
      });
      nhanVien.taiKhoan = taiKhoan;

      mockAuthStore.staff.set(nhanVien.maNV, nhanVien);
      mockAuthStore.accounts.set(taiKhoan.tenDangNhap, taiKhoan);
      return { taiKhoan, nhanVien };
    }

    // 1. Insert NhanVien trước (nếu chưa có)
    const { error: nvErr } = await supabase.from('nhan_vien').upsert({
      ma_nv: dto.maNV.trim(),
      ho_ten: dto.hoTen.trim(),
      so_dien_thoai: dto.soDienThoai?.trim() || null,
      email: dto.emailKhoiPhuc.trim(),
      dia_chi: dto.diaChi?.trim() || null,
    });

    if (nvErr) {
      throw new Error(`Lỗi tạo nhân viên: ${nvErr.message}`);
    }

    // 2. Insert TaiKhoan
    const { error: tkErr } = await supabase.from('tai_khoan').insert({
      ten_dang_nhap: dto.tenDangNhap.trim(),
      mat_khau_hash: passwordHash,
      email_khoi_phuc: dto.emailKhoiPhuc.trim(),
      trang_thai: true,
      ma_vai_tro: dto.maVaiTro,
      ma_nv: dto.maNV.trim(),
    });

    if (tkErr) {
      throw new Error(`Lỗi tạo tài khoản: ${tkErr.message}`);
    }

    const created = await this.findByUsername(dto.tenDangNhap);
    if (!created) {
      throw new Error('Không thể tải lại tài khoản vừa tạo.');
    }
    return created;
  }

  async updatePasswordHash(tenDangNhap: string, newPasswordHash: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      const tk = mockAuthStore.accounts.get(tenDangNhap.trim());
      if (!tk) throw new Error('Tài khoản không tồn tại.');
      tk.doiMatKhau(newPasswordHash);
      return;
    }

    const { error } = await supabase
      .from('tai_khoan')
      .update({ mat_khau_hash: newPasswordHash })
      .eq('ten_dang_nhap', tenDangNhap.trim());

    if (error) {
      throw new Error(`Không thể cập nhật mật khẩu: ${error.message}`);
    }
  }

  async updateStatus(tenDangNhap: string, trangThai: boolean): Promise<void> {
    if (!isSupabaseConfigured()) {
      const tk = mockAuthStore.accounts.get(tenDangNhap.trim());
      if (!tk) throw new Error('Tài khoản không tồn tại.');
      tk.trangThai = trangThai;
      return;
    }

    const { error } = await supabase
      .from('tai_khoan')
      .update({ trang_thai: trangThai })
      .eq('ten_dang_nhap', tenDangNhap.trim());

    if (error) {
      throw new Error(`Không thể cập nhật trạng thái tài khoản: ${error.message}`);
    }
  }

  private getMockRecords(): AccountWithStaffRecord[] {
    const records: AccountWithStaffRecord[] = [];
    mockAuthStore.accounts.forEach((tk) => {
      if (tk.maNV) {
        const nv = mockAuthStore.staff.get(tk.maNV);
        if (nv) {
          records.push({ taiKhoan: tk, nhanVien: nv });
        }
      }
    });
    return records;
  }
}
