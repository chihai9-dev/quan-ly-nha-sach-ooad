import { bookstoreStore, computeAlertStatus } from '@/lib/mock/bookstoreStore';
import type {
  CreateStockAuditDTO,
  InventoryItemDTO,
  StockAuditDTO,
  StockAuditItemDTO,
} from '@/types/dtos';

export interface IInventoryRepository {
  getInventoryItems(): Promise<InventoryItemDTO[]>;
  updateThresholds(bookId: string, minStock: number, maxStock: number): Promise<InventoryItemDTO>;
  getAudits(): Promise<StockAuditDTO[]>;
  createAudit(dto: CreateStockAuditDTO): Promise<StockAuditDTO>;
}

export class InventoryRepository implements IInventoryRepository {
  async getInventoryItems(): Promise<InventoryItemDTO[]> {
    return bookstoreStore.books.map((b) => ({
      bookId: b.id,
      isbn: b.isbn,
      title: b.title,
      categoryName: b.categoryName,
      price: b.price,
      costPrice: b.costPrice,
      stockQuantity: b.stockQuantity,
      minStockThreshold: b.minStockThreshold,
      maxStockThreshold: b.maxStockThreshold,
      alertStatus: computeAlertStatus(b.stockQuantity, b.minStockThreshold, b.maxStockThreshold),
    }));
  }

  async updateThresholds(bookId: string, minStock: number, maxStock: number): Promise<InventoryItemDTO> {
    const book = bookstoreStore.books.find((b) => b.id === bookId);
    if (!book) throw new Error('Không tìm thấy sách trong kho.');
    if (minStock < 0 || maxStock < minStock) {
      throw new Error('Ngưỡng tồn kho không hợp lệ (tối thiểu >= 0 và tối đa >= tối thiểu).');
    }
    book.minStockThreshold = minStock;
    book.maxStockThreshold = maxStock;
    return {
      bookId: book.id,
      isbn: book.isbn,
      title: book.title,
      categoryName: book.categoryName,
      price: book.price,
      costPrice: book.costPrice,
      stockQuantity: book.stockQuantity,
      minStockThreshold: book.minStockThreshold,
      maxStockThreshold: book.maxStockThreshold,
      alertStatus: computeAlertStatus(book.stockQuantity, book.minStockThreshold, book.maxStockThreshold),
    };
  }

  async getAudits(): Promise<StockAuditDTO[]> {
    return [...bookstoreStore.stockAudits];
  }

  async createAudit(dto: CreateStockAuditDTO): Promise<StockAuditDTO> {
    if (!dto.items.length) throw new Error('Phiếu kiểm kê phải có ít nhất 1 đầu sách.');

    const auditItems: StockAuditItemDTO[] = dto.items.map((item) => {
      const book = bookstoreStore.books.find((b) => b.id === item.bookId);
      if (!book) throw new Error(`Không tìm thấy sách ${item.bookId}.`);
      if (item.actualQuantity < 0) throw new Error('Số lượng kiểm kê thực tế không thể âm.');
      const systemQuantity = book.stockQuantity;
      const discrepancyQuantity = item.actualQuantity - systemQuantity;
      book.stockQuantity = item.actualQuantity;
      return {
        bookId: book.id,
        bookTitle: book.title,
        systemQuantity,
        actualQuantity: item.actualQuantity,
        discrepancyQuantity,
        reason: item.reason?.trim() || (discrepancyQuantity === 0 ? 'Khớp tồn kho' : 'Điều chỉnh sau kiểm kê'),
      };
    });

    const totalDiscrepancy = auditItems.reduce((sum, i) => sum + i.discrepancyQuantity, 0);
    const hasDiff = auditItems.some((i) => i.discrepancyQuantity !== 0);

    const audit: StockAuditDTO = {
      id: `kk-${Date.now()}`,
      auditCode: `KK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(bookstoreStore.stockAudits.length + 1).padStart(2, '0')}`,
      staffName: dto.staffName,
      auditDate: new Date().toISOString(),
      status: hasDiff ? 'ADJUSTED' : 'BALANCED',
      totalDiscrepancy,
      note: dto.note,
      items: auditItems,
    };

    bookstoreStore.stockAudits.unshift(audit);
    return audit;
  }
}
