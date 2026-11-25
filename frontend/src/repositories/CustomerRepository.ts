import { bookstoreStore, calculateTier } from '@/lib/mock/bookstoreStore';
import type { CreateCustomerDTO, CustomerDTO, UpdateCustomerDTO } from '@/types/dtos';

export interface ICustomerRepository {
  findAll(search?: string): Promise<CustomerDTO[]>;
  findByPhone(phoneNumber: string): Promise<CustomerDTO | null>;
  create(dto: CreateCustomerDTO): Promise<CustomerDTO>;
  update(dto: UpdateCustomerDTO): Promise<CustomerDTO>;
}

export class CustomerRepository implements ICustomerRepository {
  async findAll(search?: string): Promise<CustomerDTO[]> {
    const list = [...bookstoreStore.customers];
    if (!search || !search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.phoneNumber.includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }

  async findByPhone(phoneNumber: string): Promise<CustomerDTO | null> {
    return bookstoreStore.customers.find((c) => c.phoneNumber === phoneNumber.trim()) ?? null;
  }

  async create(dto: CreateCustomerDTO): Promise<CustomerDTO> {
    const item: CustomerDTO = {
      id: `kh-${Date.now()}`,
      fullName: dto.fullName.trim(),
      phoneNumber: dto.phoneNumber.trim(),
      email: dto.email?.trim() ?? '',
      address: dto.address?.trim() ?? '',
      loyaltyPoints: 0,
      tier: 'STANDARD',
      totalSpent: 0,
      orderCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    bookstoreStore.customers.unshift(item);
    return item;
  }

  async update(dto: UpdateCustomerDTO): Promise<CustomerDTO> {
    const found = bookstoreStore.customers.find((c) => c.id === dto.id);
    if (!found) throw new Error('Không tìm thấy hồ sơ khách hàng.');
    if (dto.fullName !== undefined) found.fullName = dto.fullName.trim();
    if (dto.phoneNumber !== undefined) found.phoneNumber = dto.phoneNumber.trim();
    if (dto.email !== undefined) found.email = dto.email.trim();
    if (dto.address !== undefined) found.address = dto.address.trim();
    if (dto.loyaltyPoints !== undefined && dto.loyaltyPoints >= 0) {
      found.loyaltyPoints = dto.loyaltyPoints;
      found.tier = calculateTier(dto.loyaltyPoints);
    }
    return found;
  }
}
