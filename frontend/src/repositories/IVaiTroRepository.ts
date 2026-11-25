import { VaiTro } from '@/models/VaiTro';

/**
 * Giao diện IVaiTroRepository (Dependency Inversion Principle)
 */
export interface IVaiTroRepository {
  findAll(): Promise<VaiTro[]>;
  findByCode(maVaiTro: string): Promise<VaiTro | null>;
  updatePermissions(maVaiTro: string, danhSachQuyen: string[]): Promise<VaiTro>;
}
