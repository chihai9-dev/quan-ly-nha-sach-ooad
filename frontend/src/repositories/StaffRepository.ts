import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { bookstoreStore } from '@/lib/mock/bookstoreStore';
import { NhanVien } from '@/models/NhanVien';
import type { CreateStaffDTO, StaffDTO, UpdateStaffDTO } from '@/types/dtos';

const ROLE_LABELS: Record<StaffDTO['roleCode'], string> = {
  QUAN_LY: 'Quản lý',
  NHAN_VIEN_BAN_HANG: 'Nhân viên bán hàng',
  NHAN_VIEN_KHO: 'Nhân viên kho',
};

function mapRoleCode(maVaiTro?: string): StaffDTO['roleCode'] {
  if (maVaiTro === 'QUAN_LY' || maVaiTro === 'VT_QL') return 'QUAN_LY';
  if (maVaiTro === 'NHAN_VIEN_KHO' || maVaiTro === 'VT_KHO') return 'NHAN_VIEN_KHO';
  return 'NHAN_VIEN_BAN_HANG';
}

export interface IStaffRepository {
  findAll(search?: string): Promise<StaffDTO[]>;
  create(dto: CreateStaffDTO): Promise<StaffDTO>;
  update(dto: UpdateStaffDTO): Promise<StaffDTO>;
}

/**
 * Triển khai StaffRepository kết nối bảng `nhan_vien` + `tai_khoan` + `vai_tro` trên Supabase
 * (có fallback sang `bookstoreStore.staff`).
 */
export class StaffRepository implements IStaffRepository {
  async findAll(search?: string): Promise<StaffDTO[]> {
    let list: StaffDTO[];

    if (!isSupabaseConfigured()) {
      list = [...bookstoreStore.staff];
    } else {
      try {
        const [nvRes, tkRes] = await Promise.all([
          supabase.from('nhan_vien').select('*').order('ma_nv'),
          supabase.from('tai_khoan').select('ma_nv, ma_vai_tro, trang_thai'),
        ]);
        if (nvRes.error || !nvRes.data) {
          list = [...bookstoreStore.staff];
        } else {
          const tkMap = new Map((tkRes.data ?? []).map((t) => [t.ma_nv, t]));
          list = nvRes.data.map((row) => {
            const entity = new NhanVien({
              maNV: row.ma_nv,
              hoTen: row.ho_ten,
              soDienThoai: row.so_dien_thoai ?? '',
              email: row.email ?? '',
              diaChi: row.dia_chi ?? '',
              ngayVaoLam: row.ngay_vao_lam,
            });
            const tk = tkMap.get(entity.maNV);
            const roleCode = mapRoleCode(tk?.ma_vai_tro);
            return {
              id: entity.maNV,
              fullName: entity.hoTen,
              phoneNumber: entity.soDienThoai,
              email: entity.email,
              address: entity.diaChi,
              position: ROLE_LABELS[roleCode],
              roleCode,
              roleName: ROLE_LABELS[roleCode],
              status: tk && !tk.trang_thai ? 'TERMINATED' : 'ACTIVE',
              hireDate: row.ngay_vao_lam,
            };
          });
        }
      } catch {
        list = [...bookstoreStore.staff];
      }
    }

    if (!search || !search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.phoneNumber.includes(q) ||
        s.roleName.toLowerCase().includes(q)
    );
  }

  async create(dto: CreateStaffDTO): Promise<StaffDTO> {
    const maNV = `NV${Date.now().toString().slice(-4)}`;
    const entity = new NhanVien({
      maNV,
      hoTen: dto.fullName,
      soDienThoai: dto.phoneNumber,
      email: dto.email,
      diaChi: dto.address ?? '',
    });

    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('nhan_vien').insert({
        ma_nv: entity.maNV,
        ho_ten: entity.hoTen,
        so_dien_thoai: entity.soDienThoai || null,
        email: entity.email || null,
        dia_chi: entity.diaChi || null,
      });
      if (error) throw new Error(`Không thể thêm nhân viên vào CSDL: ${error.message}`);
      return {
        id: entity.maNV,
        fullName: entity.hoTen,
        phoneNumber: entity.soDienThoai,
        email: entity.email,
        address: entity.diaChi,
        position: dto.position.trim(),
        roleCode: dto.roleCode,
        roleName: ROLE_LABELS[dto.roleCode],
        status: 'ACTIVE',
        hireDate: new Date().toISOString().slice(0, 10),
      };
    }

    const item: StaffDTO = {
      id: entity.maNV,
      fullName: entity.hoTen,
      phoneNumber: entity.soDienThoai,
      email: entity.email,
      address: entity.diaChi,
      position: dto.position.trim(),
      roleCode: dto.roleCode,
      roleName: ROLE_LABELS[dto.roleCode],
      status: 'ACTIVE',
      hireDate: new Date().toISOString().slice(0, 10),
    };
    bookstoreStore.staff.unshift(item);
    return item;
  }

  async update(dto: UpdateStaffDTO): Promise<StaffDTO> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('nhan_vien')
        .update({
          ...(dto.fullName !== undefined ? { ho_ten: dto.fullName.trim() } : {}),
          ...(dto.phoneNumber !== undefined ? { so_dien_thoai: dto.phoneNumber.trim() || null } : {}),
          ...(dto.email !== undefined ? { email: dto.email.trim() || null } : {}),
          ...(dto.address !== undefined ? { dia_chi: dto.address.trim() || null } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq('ma_nv', dto.id);
      if (error) throw new Error(`Không thể cập nhật nhân viên: ${error.message}`);

      if (dto.status === 'TERMINATED') {
        await supabase
          .from('tai_khoan')
          .update({ trang_thai: false, updated_at: new Date().toISOString() })
          .eq('ma_nv', dto.id);
      }

      const all = await this.findAll();
      const updated = all.find((s) => s.id === dto.id);
      if (!updated) throw new Error('Không tìm thấy nhân viên.');
      return updated;
    }

    const found = bookstoreStore.staff.find((s) => s.id === dto.id);
    if (!found) throw new Error('Không tìm thấy nhân viên.');
    if (dto.fullName !== undefined) found.fullName = dto.fullName.trim();
    if (dto.phoneNumber !== undefined) found.phoneNumber = dto.phoneNumber.trim();
    if (dto.email !== undefined) found.email = dto.email.trim();
    if (dto.address !== undefined) found.address = dto.address.trim();
    if (dto.position !== undefined) found.position = dto.position.trim();
    if (dto.roleCode !== undefined) {
      found.roleCode = dto.roleCode;
      found.roleName = ROLE_LABELS[dto.roleCode];
    }
    if (dto.status !== undefined) found.status = dto.status;
    return found;
  }
}
