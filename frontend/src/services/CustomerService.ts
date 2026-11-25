import { CustomerRepository, type ICustomerRepository } from '@/repositories/CustomerRepository';
import type { CreateCustomerDTO, CustomerDTO, UpdateCustomerDTO } from '@/types/dtos';

export class CustomerService {
  private readonly repo: ICustomerRepository;

  constructor(repo: ICustomerRepository = new CustomerRepository()) {
    this.repo = repo;
  }

  async getCustomers(search?: string): Promise<CustomerDTO[]> {
    return this.repo.findAll(search);
  }

  async addCustomer(dto: CreateCustomerDTO): Promise<CustomerDTO> {
    if (!dto.fullName.trim()) throw new Error('Họ tên khách hàng không được để trống.');
    if (!dto.phoneNumber.trim() || dto.phoneNumber.trim().length < 9) {
      throw new Error('Số điện thoại không hợp lệ (tối thiểu 9 chữ số).');
    }
    const duplicate = await this.repo.findByPhone(dto.phoneNumber);
    if (duplicate) {
      throw new Error(`Số điện thoại ${dto.phoneNumber} đã được đăng ký cho khách hàng "${duplicate.fullName}".`);
    }
    return this.repo.create(dto);
  }

  async updateCustomer(dto: UpdateCustomerDTO): Promise<CustomerDTO> {
    if (dto.loyaltyPoints !== undefined && dto.loyaltyPoints < 0) {
      throw new Error('Điểm tích lũy không thể là số âm.');
    }
    return this.repo.update(dto);
  }
}
