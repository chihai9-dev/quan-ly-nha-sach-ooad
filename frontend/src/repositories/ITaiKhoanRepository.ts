import { TaiKhoan } from '@/models/TaiKhoan';
import { NhanVien } from '@/models/NhanVien';
import type { CreateAccountDTO } from '@/types/dtos';

export interface AccountWithStaffRecord {
  taiKhoan: TaiKhoan;
  nhanVien: NhanVien;
}

/**
 * Giao diện ITaiKhoanRepository (Dependency Inversion Principle)
 */
export interface ITaiKhoanRepository {
  findAll(): Promise<AccountWithStaffRecord[]>;
  findByUsername(tenDangNhap: string): Promise<AccountWithStaffRecord | null>;
  createAccount(dto: CreateAccountDTO, passwordHash: string): Promise<AccountWithStaffRecord>;
  updatePasswordHash(tenDangNhap: string, newPasswordHash: string): Promise<void>;
  updateStatus(tenDangNhap: string, trangThai: boolean): Promise<void>;
}
