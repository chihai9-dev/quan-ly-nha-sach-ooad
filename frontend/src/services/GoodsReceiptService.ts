import { GoodsReceiptRepository, type IGoodsReceiptRepository } from '@/repositories/GoodsReceiptRepository';
import type {
  CreateGoodsReceiptDTO,
  CreateSupplierPaymentDTO,
  GoodsReceiptDTO,
  SupplierPaymentDTO,
} from '@/types/dtos';

export class GoodsReceiptService {
  private readonly repo: IGoodsReceiptRepository;

  constructor(repo: IGoodsReceiptRepository = new GoodsReceiptRepository()) {
    this.repo = repo;
  }

  async getReceipts(supplierId?: string): Promise<GoodsReceiptDTO[]> {
    return this.repo.findAllReceipts(supplierId);
  }

  async createReceipt(dto: CreateGoodsReceiptDTO): Promise<GoodsReceiptDTO> {
    return this.repo.createReceipt(dto);
  }

  async getPayments(supplierId?: string): Promise<SupplierPaymentDTO[]> {
    return this.repo.findAllPayments(supplierId);
  }

  async recordPayment(dto: CreateSupplierPaymentDTO): Promise<SupplierPaymentDTO> {
    return this.repo.createPayment(dto);
  }
}
