import { Sach } from '@/models/Sach';
import type { IBookRepository } from '@/repositories/IBookRepository';
import { BookRepository } from '@/repositories/BookRepository';
import type { BookFilterParams, CreateBookDTO, UpdateBookDTO } from '@/types/dtos';

/**
 * Lớp BookService (Tầng Dịch vụ Nghiệp vụ Sách - Phân hệ QLS)
 * Sử dụng thực thể `Sach` theo Class Diagram và nhận `IBookRepository` qua DI.
 */
export class BookService {
  private readonly bookRepository: IBookRepository;

  constructor(repository: IBookRepository = new BookRepository()) {
    this.bookRepository = repository;
  }

  async getAllBooks(filter?: BookFilterParams): Promise<Sach[]> {
    return this.bookRepository.findAll(filter);
  }

  async getBookDetails(maSach: string): Promise<Sach> {
    const sach = await this.bookRepository.findById(maSach);
    if (!sach) {
      throw new Error(`Không tìm thấy đầu sách có mã "${maSach}".`);
    }
    return sach;
  }

  async findByCode(maSach: string): Promise<Sach | null> {
    return this.bookRepository.findById(maSach);
  }

  async addNewBook(dto: CreateBookDTO): Promise<Sach> {
    if (!dto.title.trim()) {
      throw new Error('Tên sách không được để trống.');
    }
    if (dto.price < 0) {
      throw new Error('Giá bán sách không được là số âm.');
    }
    if ((dto.costPrice ?? 0) < 0) {
      throw new Error('Giá nhập sách không được là số âm.');
    }
    if (dto.stockQuantity < 0) {
      throw new Error('Số lượng tồn kho ban đầu không thể âm.');
    }

    if (dto.isbn.trim()) {
      const existing = await this.bookRepository.findById(dto.isbn.trim());
      if (existing) {
        throw new Error(`Mã sách "${dto.isbn.trim()}" đã tồn tại trong hệ thống.`);
      }
    }

    return this.bookRepository.create(dto);
  }

  async updateBookInfo(dto: UpdateBookDTO): Promise<Sach> {
    const existing = await this.bookRepository.findById(dto.id);
    if (!existing) {
      throw new Error('Đầu sách cần cập nhật không tồn tại.');
    }
    if (dto.price !== undefined && dto.price < 0) {
      throw new Error('Giá bán không thể âm.');
    }
    if (dto.costPrice !== undefined && dto.costPrice < 0) {
      throw new Error('Giá nhập không thể âm.');
    }
    return this.bookRepository.update(dto);
  }

  async deleteBook(maSach: string): Promise<{ deleted: boolean; discontinued: boolean }> {
    const existing = await this.bookRepository.findById(maSach);
    if (!existing) {
      throw new Error(`Không tìm thấy đầu sách "${maSach}".`);
    }
    return this.bookRepository.delete(maSach);
  }

  async getLowStockAlerts(): Promise<Sach[]> {
    const allBooks = await this.bookRepository.findAll();
    return allBooks.filter((sach) => sach.kiemTraCanhBaoTonKho() && sach.trangThai !== 'NGUNG_BAN');
  }

  async restockBook(maSach: string, additionalQuantity: number): Promise<void> {
    const sach = await this.getBookDetails(maSach);
    sach.capNhatSoLuongTon(additionalQuantity);
    await this.bookRepository.updateStock(maSach, sach.soLuongTon);
  }
}
