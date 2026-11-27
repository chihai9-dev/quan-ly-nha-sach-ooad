import { Sach } from '@/models/Sach';
import type { BookFilterParams, CreateBookDTO, UpdateBookDTO } from '@/types/dtos';

/**
 * Interface IBookRepository (Nguyên lý Dependency Inversion trong SOLID).
 * Sử dụng thực thể Domain `Sach` theo Class Diagram (docs/diagrams/Class diagram.drawio).
 */
export interface IBookRepository {
  findAll(filter?: BookFilterParams): Promise<Sach[]>;
  findById(maSach: string): Promise<Sach | null>;
  create(dto: CreateBookDTO): Promise<Sach>;
  update(dto: UpdateBookDTO): Promise<Sach>;
  delete(maSach: string): Promise<{ deleted: boolean; discontinued: boolean }>;
  updateStock(maSach: string, remainingStock: number): Promise<void>;
}
