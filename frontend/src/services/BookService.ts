import { Book } from '@/models/Book';
import { IBookRepository } from '@/repositories/IBookRepository';
import { BookRepository } from '@/repositories/BookRepository';
import type { BookFilterParams, CreateBookDTO, UpdateBookDTO } from '@/types/dtos';

/**
 * Lớp BookService (Tầng Dịch vụ Nghiệp vụ Sách)
 * Điều phối logic giữa Presentation Layer (UI) và Data Access Layer (Repository).
 * Áp dụng nguyên lý Dependency Injection: Nhận IBookRepository qua constructor.
 */
export class BookService {
  private readonly bookRepository: IBookRepository;

  constructor(repository: IBookRepository = new BookRepository()) {
    this.bookRepository = repository;
  }

  /**
   * Lấy danh sách toàn bộ sách có áp dụng bộ lọc và từ khóa
   */
  async getAllBooks(filter?: BookFilterParams): Promise<Book[]> {
    return this.bookRepository.findAll(filter);
  }

  /**
   * Tra cứu chi tiết một cuốn sách theo ID
   */
  async getBookDetails(id: string): Promise<Book> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new Error(`Không tìm thấy cuốn sách có ID "${id}".`);
    }
    return book;
  }

  /**
   * Tìm kiếm sách theo mã ISBN (thường dùng khi nhân viên quét barcode tại quầy)
   */
  async findByIsbn(isbn: string): Promise<Book | null> {
    return this.bookRepository.findByIsbn(isbn);
  }

  /**
   * Thêm sách mới vào kho
   */
  async addNewBook(dto: CreateBookDTO): Promise<Book> {
    // 1. Kiểm tra ISBN trùng lặp
    const existing = await this.bookRepository.findByIsbn(dto.isbn);
    if (existing) {
      throw new Error(`Mã ISBN "${dto.isbn}" đã tồn tại trong hệ thống.`);
    }

    // 2. Kiểm tra nghiệp vụ giá & số lượng
    if (dto.price < 0) {
      throw new Error('Đơn giá sách không được là số âm.');
    }
    if (dto.stockQuantity < 0) {
      throw new Error('Số lượng tồn kho ban đầu không thể âm.');
    }

    return this.bookRepository.create(dto);
  }

  /**
   * Cập nhật thông tin sách
   */
  async updateBookInfo(dto: UpdateBookDTO): Promise<Book> {
    const existing = await this.bookRepository.findById(dto.id);
    if (!existing) {
      throw new Error('Cuốn sách cần cập nhật không tồn tại.');
    }

    return this.bookRepository.update(dto);
  }

  /**
   * Lấy danh sách các đầu sách có nguy cơ hết hàng cần nhập bổ sung
   */
  async getLowStockAlerts(threshold: number = 5): Promise<Book[]> {
    const allBooks = await this.bookRepository.findAll();
    return allBooks.filter(book => book.isLowStock(threshold));
  }

  /**
   * Điều chỉnh tồn kho thủ công (nhập hàng kho)
   */
  async restockBook(bookId: string, additionalQuantity: number): Promise<void> {
    const book = await this.getBookDetails(bookId);
    book.restock(additionalQuantity);
    await this.bookRepository.updateStock(bookId, book.stockQuantity);
  }
}
