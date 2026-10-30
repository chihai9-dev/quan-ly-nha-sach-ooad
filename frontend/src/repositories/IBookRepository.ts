import { Book } from '@/models/Book';
import type { BookFilterParams, CreateBookDTO, UpdateBookDTO } from '@/types/dtos';

/**
 * Interface IBookRepository (Nguyên lý Dependency Inversion trong SOLID).
 * Định nghĩa hợp đồng truy xuất dữ liệu Sách mà không phụ thuộc trực tiếp vào Supabase.
 */
export interface IBookRepository {
  findAll(filter?: BookFilterParams): Promise<Book[]>;
  findById(id: string): Promise<Book | null>;
  findByIsbn(isbn: string): Promise<Book | null>;
  create(dto: CreateBookDTO): Promise<Book>;
  update(dto: UpdateBookDTO): Promise<Book>;
  delete(id: string): Promise<boolean>;
  updateStock(bookId: string, remainingStock: number): Promise<void>;
}
