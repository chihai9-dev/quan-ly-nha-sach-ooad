import { HoaDon } from '@/models/HoaDon';
import { ThanhToan } from '@/models/ThanhToan';

/**
 * Interface IOrderRepository (Nguyên lý Dependency Inversion trong SOLID).
 * Sử dụng thực thể `HoaDon` và `ThanhToan` theo Class Diagram.
 */
export interface IOrderRepository {
  saveHoaDon(hoaDon: HoaDon, thanhToan: ThanhToan): Promise<HoaDon>;
  findById(maHoaDon: string): Promise<HoaDon | null>;
  listRecent(limit?: number, searchTerm?: string): Promise<HoaDon[]>;
}
