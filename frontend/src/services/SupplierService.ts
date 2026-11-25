import { SupplierRepository, type ISupplierRepository } from '@/repositories/SupplierRepository';
import type { CreateSupplierDTO, SupplierDTO, UpdateSupplierDTO } from '@/types/dtos';

export class SupplierService {
  private readonly repo: ISupplierRepository;

  constructor(repo: ISupplierRepository = new SupplierRepository()) {
    this.repo = repo;
  }

  async getSuppliers(search?: string): Promise<SupplierDTO[]> {
    return this.repo.findAll(search);
  }

  async addSupplier(dto: CreateSupplierDTO): Promise<SupplierDTO> {
    if (!dto.name.trim()) throw new Error('Tên nhà cung cấp không được để trống.');
    if (!dto.phoneNumber.trim()) throw new Error('Số điện thoại nhà cung cấp không được để trống.');
    if (!dto.address.trim()) throw new Error('Địa chỉ nhà cung cấp không được để trống.');
    return this.repo.create(dto);
  }

  async updateSupplier(dto: UpdateSupplierDTO): Promise<SupplierDTO> {
    return this.repo.update(dto);
  }
}
