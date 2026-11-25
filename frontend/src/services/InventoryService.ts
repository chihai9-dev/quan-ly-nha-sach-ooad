import { InventoryRepository, type IInventoryRepository } from '@/repositories/InventoryRepository';
import type {
  CreateDamagedWriteOffDTO,
  CreateStockAuditDTO,
  InventoryItemDTO,
  StockAuditDTO,
} from '@/types/dtos';

export class InventoryService {
  private readonly repo: IInventoryRepository;

  constructor(repo: IInventoryRepository = new InventoryRepository()) {
    this.repo = repo;
  }

  async getInventory(): Promise<InventoryItemDTO[]> {
    return this.repo.getInventoryItems();
  }

  async updateThresholds(bookId: string, minStock: number, maxStock: number): Promise<InventoryItemDTO> {
    return this.repo.updateThresholds(bookId, minStock, maxStock);
  }

  async toggleBusinessStatus(bookId: string): Promise<InventoryItemDTO> {
    return this.repo.toggleBusinessStatus(bookId);
  }

  async updateBookPrice(bookId: string, newPrice: number): Promise<InventoryItemDTO> {
    return this.repo.updateBookPrice(bookId, newPrice);
  }

  async getAudits(): Promise<StockAuditDTO[]> {
    return this.repo.getAudits();
  }

  async createAudit(dto: CreateStockAuditDTO): Promise<StockAuditDTO> {
    return this.repo.createAudit(dto);
  }

  async writeOffDamaged(dto: CreateDamagedWriteOffDTO): Promise<StockAuditDTO> {
    return this.repo.writeOffDamaged(dto);
  }
}
