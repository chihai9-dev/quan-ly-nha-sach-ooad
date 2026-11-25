import { StaffRepository, type IStaffRepository } from '@/repositories/StaffRepository';
import type { CreateStaffDTO, StaffDTO, UpdateStaffDTO } from '@/types/dtos';

export class StaffService {
  private readonly repo: IStaffRepository;

  constructor(repo: IStaffRepository = new StaffRepository()) {
    this.repo = repo;
  }

  async getStaffList(search?: string): Promise<StaffDTO[]> {
    return this.repo.findAll(search);
  }

  async addStaff(dto: CreateStaffDTO): Promise<StaffDTO> {
    if (!dto.fullName.trim()) throw new Error('Họ tên nhân viên không được để trống.');
    if (!dto.phoneNumber.trim()) throw new Error('Số điện thoại không được để trống.');
    if (!dto.email.trim() || !dto.email.includes('@')) throw new Error('Email nhân viên không hợp lệ.');
    if (!dto.position.trim()) throw new Error('Vị trí công việc không được để trống.');
    return this.repo.create(dto);
  }

  async updateStaff(dto: UpdateStaffDTO): Promise<StaffDTO> {
    return this.repo.update(dto);
  }
}
