import { bookstoreStore, computeAlertStatus, type MockBookRecord } from '@/lib/mock/bookstoreStore';
import type {
  CreateDamagedWriteOffDTO,
  CreateStockAuditDTO,
  InventoryItemDTO,
  StockAuditDTO,
  StockAuditItemDTO,
} from '@/types/dtos';

function toInventoryDTO(b: MockBookRecord): InventoryItemDTO {
  return {
    bookId: b.id,
    isbn: b.isbn,
    title: b.title,
    categoryName: b.categoryName,
    price: b.price,
    costPrice: b.costPrice,
    stockQuantity: b.stockQuantity,
    minStockThreshold: b.minStockThreshold,
    maxStockThreshold: b.maxStockThreshold,
    soldQuantity: b.soldQuantity,
    businessStatus: b.businessStatus,
    alertStatus: computeAlertStatus(b.stockQuantity, b.minStockThreshold, b.maxStockThreshold),
  };
}

export interface IInventoryRepository {
  getInventoryItems(): Promise<InventoryItemDTO[]>;
  updateThresholds(bookId: string, minStock: number, maxStock: number): Promise<InventoryItemDTO>;
  toggleBusinessStatus(bookId: string): Promise<InventoryItemDTO>;
  updateBookPrice(bookId: string, newPrice: number): Promise<InventoryItemDTO>;
  getAudits(): Promise<StockAuditDTO[]>;
  createAudit(dto: CreateStockAuditDTO): Promise<StockAuditDTO>;
  writeOffDamaged(dto: CreateDamagedWriteOffDTO): Promise<StockAuditDTO>;
}

export class InventoryRepository implements IInventoryRepository {
  async getInventoryItems(): Promise<InventoryItemDTO[]> {
    return bookstoreStore.books.map(toInventoryDTO);
  }

  async updateThresholds(bookId: string, minStock: number, maxStock: number): Promise<InventoryItemDTO> {
    const book = bookstoreStore.books.find((b) => b.id === bookId);
    if (!book) throw new Error('Không tìm thấy sách trong kho.');
    if (minStock < 0 || maxStock < minStock) {
      throw new Error('Ngưỡng tồn kho không hợp lệ (tối thiểu >= 0 và tối đa >= tối thiểu).');
    }
    book.minStockThreshold = minStock;
    book.maxStockThreshold = maxStock;
    return toInventoryDTO(book);
  }

  async toggleBusinessStatus(bookId: string): Promise<InventoryItemDTO> {
    const book = bookstoreStore.books.find((b) => b.id === bookId);
    if (!book) throw new Error('Không tìm thấy đầu sách.');
    book.businessStatus = book.businessStatus === 'SELLING' ? 'DISCONTINUED' : 'SELLING';
    return toInventoryDTO(book);
  }

  async updateBookPrice(bookId: string, newPrice: number): Promise<InventoryItemDTO> {
    const book = bookstoreStore.books.find((b) => b.id === bookId);
    if (!book) throw new Error('Không tìm thấy đầu sách.');
    if (newPrice < 0) throw new Error('Giá bán không thể là số âm.');
    book.price = newPrice;
    return toInventoryDTO(book);
  }

  async getAudits(): Promise<StockAuditDTO[]> {
    return [...bookstoreStore.stockAudits];
  }

  async createAudit(dto: CreateStockAuditDTO): Promise<StockAuditDTO> {
    if (!dto.items.length) throw new Error('Phiếu kiểm kê phải có ít nhất 1 đầu sách.');

    let lossValue = 0;
    const auditItems: StockAuditItemDTO[] = dto.items.map((item) => {
      const book = bookstoreStore.books.find((b) => b.id === item.bookId);
      if (!book) throw new Error(`Không tìm thấy sách ${item.bookId}.`);
      if (item.actualQuantity < 0) throw new Error('Số lượng kiểm kê thực tế không thể âm.');
      const systemQuantity = book.stockQuantity;
      const discrepancyQuantity = item.actualQuantity - systemQuantity;
      if (discrepancyQuantity < 0) {
        lossValue += Math.abs(discrepancyQuantity) * book.costPrice;
      }
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
      adjustmentType: 'AUDIT',
      staffName: dto.staffName,
      auditDate: new Date().toISOString(),
      status: hasDiff ? 'ADJUSTED' : 'BALANCED',
      totalDiscrepancy,
      lossValue,
      note: dto.note,
      items: auditItems,
    };

    bookstoreStore.stockAudits.unshift(audit);
    return audit;
  }

  async writeOffDamaged(dto: CreateDamagedWriteOffDTO): Promise<StockAuditDTO> {
    const book = bookstoreStore.books.find((b) => b.id === dto.bookId);
    if (!book) throw new Error('Không tìm thấy đầu sách cần xuất hủy.');
    if (dto.damagedQuantity <= 0) throw new Error('Số lượng sách hư hỏng phải lớn hơn 0.');
    if (dto.damagedQuantity > book.stockQuantity) {
      throw new Error(`Số lượng xuất hủy (${dto.damagedQuantity}) vượt quá tồn kho hiện tại (${book.stockQuantity}).`);
    }
    if (!dto.reason.trim()) throw new Error('Vui lòng ghi rõ nguyên nhân hư hỏng / xuất hủy.');

    const systemQuantity = book.stockQuantity;
    const actualQuantity = systemQuantity - dto.damagedQuantity;
    const lossValue = dto.damagedQuantity * book.costPrice;
    book.stockQuantity = actualQuantity;

    const record: StockAuditDTO = {
      id: `xh-${Date.now()}`,
      auditCode: `XH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(bookstoreStore.stockAudits.length + 1).padStart(2, '0')}`,
      adjustmentType: 'DAMAGED_WRITE_OFF',
      staffName: dto.staffName,
      auditDate: new Date().toISOString(),
      status: 'ADJUSTED',
      totalDiscrepancy: -dto.damagedQuantity,
      lossValue,
      note: `Xuất hủy sách hư hỏng: ${dto.reason.trim()}`,
      items: [
        {
          bookId: book.id,
          bookTitle: book.title,
          systemQuantity,
          actualQuantity,
          discrepancyQuantity: -dto.damagedQuantity,
          reason: dto.reason.trim(),
        },
      ],
    };

    bookstoreStore.stockAudits.unshift(record);
    return record;
  }
}
