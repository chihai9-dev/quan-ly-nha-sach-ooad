import { bookstoreStore } from '@/lib/mock/bookstoreStore';
import type { CreateReturnDTO, ReturnExchangeDTO, ReturnItemDTO } from '@/types/dtos';

export interface IReturnRepository {
  findAll(): Promise<ReturnExchangeDTO[]>;
  create(dto: CreateReturnDTO): Promise<ReturnExchangeDTO>;
}

export class ReturnRepository implements IReturnRepository {
  async findAll(): Promise<ReturnExchangeDTO[]> {
    return [...bookstoreStore.returns];
  }

  async create(dto: CreateReturnDTO): Promise<ReturnExchangeDTO> {
    if (!dto.orderCode.trim()) throw new Error('Vui lòng nhập mã hóa đơn cần đổi/trả.');
    if (!dto.reason.trim()) throw new Error('Vui lòng nhập lý do đổi/trả hàng.');
    if (!dto.items.length) throw new Error('Phải chọn ít nhất 1 cuốn sách để đổi/trả.');

    if (dto.orderDate) {
      const diffDays = (Date.now() - new Date(dto.orderDate).getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays > 7) {
        throw new Error('Hóa đơn đã quá thời hạn đổi/trả 7 ngày theo quy định.');
      }
    }

    const items: ReturnItemDTO[] = dto.items.map((i) => {
      if (i.quantity <= 0) throw new Error('Số lượng trả phải lớn hơn 0.');
      if (i.quantity > i.maxPurchasedQuantity) {
        throw new Error(`Số lượng trả (${i.quantity}) vượt quá số lượng đã mua (${i.maxPurchasedQuantity}).`);
      }
      const book = bookstoreStore.books.find((b) => b.id === i.bookId);
      if (book) {
        book.stockQuantity += i.quantity;
      }
      return {
        bookId: i.bookId,
        bookTitle: i.bookTitle,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        refundSubtotal: i.quantity * i.unitPrice,
      };
    });

    const returnedValue = items.reduce((sum, i) => sum + i.refundSubtotal, 0);
    let exchangeBookTitle: string | undefined;
    let exchangeBookPrice: number | undefined;
    let refundAmount = returnedValue;

    if (dto.type === 'EXCHANGE' && dto.exchangeBookId) {
      const newBook = bookstoreStore.books.find((b) => b.id === dto.exchangeBookId);
      if (!newBook) throw new Error('Không tìm thấy sách mới cần đổi.');
      if (newBook.stockQuantity <= 0) throw new Error(`Sách "${newBook.title}" hiện đã hết hàng.`);
      newBook.stockQuantity -= 1;
      exchangeBookTitle = newBook.title;
      exchangeBookPrice = newBook.price;
      refundAmount = returnedValue - newBook.price;
    }

    const record: ReturnExchangeDTO = {
      id: `dt-${Date.now()}`,
      returnCode: `DT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(bookstoreStore.returns.length + 1).padStart(2, '0')}`,
      orderCode: dto.orderCode.trim(),
      type: dto.type,
      staffName: dto.staffName,
      reason: dto.reason.trim(),
      createdAt: new Date().toISOString(),
      items,
      exchangeBookTitle,
      exchangeBookPrice,
      refundAmount,
      status: 'COMPLETED',
    };

    bookstoreStore.returns.unshift(record);
    return record;
  }
}
