import { bookstoreStore } from '@/lib/mock/bookstoreStore';
import type { CreateSupplierDTO, SupplierDTO, UpdateSupplierDTO } from '@/types/dtos';

export interface ISupplierRepository {
  findAll(search?: string): Promise<SupplierDTO[]>;
  findById(id: string): Promise<SupplierDTO | null>;
  create(dto: CreateSupplierDTO): Promise<SupplierDTO>;
  update(dto: UpdateSupplierDTO): Promise<SupplierDTO>;
}

export class SupplierRepository implements ISupplierRepository {
  async findAll(search?: string): Promise<SupplierDTO[]> {
    const list = [...bookstoreStore.suppliers];
    if (!search || !search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.phoneNumber.includes(q)
    );
  }

  async findById(id: string): Promise<SupplierDTO | null> {
    return bookstoreStore.suppliers.find((s) => s.id === id) ?? null;
  }

  async create(dto: CreateSupplierDTO): Promise<SupplierDTO> {
    const item: SupplierDTO = {
      id: `ncc-${Date.now()}`,
      code: (dto.code?.trim() || `NCC-${bookstoreStore.suppliers.length + 1}`).toUpperCase(),
      name: dto.name.trim(),
      phoneNumber: dto.phoneNumber.trim(),
      email: dto.email?.trim() ?? '',
      address: dto.address.trim(),
      bankAccount: dto.bankAccount?.trim() ?? '',
      isActive: true,
      totalImported: 0,
      totalPaid: 0,
      currentDebt: 0,
    };
    bookstoreStore.suppliers.unshift(item);
    return item;
  }

  async update(dto: UpdateSupplierDTO): Promise<SupplierDTO> {
    const found = bookstoreStore.suppliers.find((s) => s.id === dto.id);
    if (!found) throw new Error('Không tìm thấy nhà cung cấp.');
    if (dto.name !== undefined) found.name = dto.name.trim();
    if (dto.phoneNumber !== undefined) found.phoneNumber = dto.phoneNumber.trim();
    if (dto.email !== undefined) found.email = dto.email.trim();
    if (dto.address !== undefined) found.address = dto.address.trim();
    if (dto.bankAccount !== undefined) found.bankAccount = dto.bankAccount.trim();
    if (dto.isActive !== undefined) found.isActive = dto.isActive;
    return found;
  }
}
