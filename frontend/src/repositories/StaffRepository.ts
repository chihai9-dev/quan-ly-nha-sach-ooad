import { bookstoreStore } from '@/lib/mock/bookstoreStore';
import type { CreateStaffDTO, StaffDTO, UpdateStaffDTO } from '@/types/dtos';

const ROLE_LABELS: Record<StaffDTO['roleCode'], string> = {
  QUAN_LY: 'Quản lý',
  NHAN_VIEN_BAN_HANG: 'Nhân viên bán hàng',
  NHAN_VIEN_KHO: 'Nhân viên kho',
};

export interface IStaffRepository {
  findAll(search?: string): Promise<StaffDTO[]>;
  create(dto: CreateStaffDTO): Promise<StaffDTO>;
  update(dto: UpdateStaffDTO): Promise<StaffDTO>;
}

export class StaffRepository implements IStaffRepository {
  async findAll(search?: string): Promise<StaffDTO[]> {
    const list = [...bookstoreStore.staff];
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
    const nextNum = bookstoreStore.staff.length + 10;
    const item: StaffDTO = {
      id: `NV${String(nextNum).padStart(3, '0')}`,
      fullName: dto.fullName.trim(),
      phoneNumber: dto.phoneNumber.trim(),
      email: dto.email.trim(),
      address: dto.address?.trim() ?? '',
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
