import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { bookstoreStore } from '@/lib/mock/bookstoreStore';
import { NhaCungCap } from '@/models/NhaCungCap';
import type { CreateSupplierDTO, SupplierDTO, UpdateSupplierDTO } from '@/types/dtos';

export interface ISupplierRepository {
  findAll(search?: string): Promise<SupplierDTO[]>;
  findById(id: string): Promise<SupplierDTO | null>;
  create(dto: CreateSupplierDTO): Promise<SupplierDTO>;
  update(dto: UpdateSupplierDTO): Promise<SupplierDTO>;
}

/**
 * Triển khai SupplierRepository kết nối bảng `nha_cung_cap` + `phieu_nhap` trên Supabase
 * (có fallback sang `bookstoreStore.suppliers`).
 */
export class SupplierRepository implements ISupplierRepository {
  async findAll(search?: string): Promise<SupplierDTO[]> {
    let list: SupplierDTO[];

    if (!isSupabaseConfigured()) {
      list = [...bookstoreStore.suppliers];
    } else {
      try {
        const [nccRes, pnRes] = await Promise.all([
          supabase.from('nha_cung_cap').select('*').order('ten_ncc'),
          supabase.from('phieu_nhap').select('ma_ncc, tong_tien, da_thanh_toan'),
        ]);
        if (nccRes.error || !nccRes.data) {
          list = [...bookstoreStore.suppliers];
        } else {
          const importedMap = new Map<string, number>();
          const paidMap = new Map<string, number>();
          for (const pn of pnRes.data ?? []) {
            importedMap.set(pn.ma_ncc, (importedMap.get(pn.ma_ncc) ?? 0) + Number(pn.tong_tien));
            paidMap.set(pn.ma_ncc, (paidMap.get(pn.ma_ncc) ?? 0) + Number(pn.da_thanh_toan));
          }

          list = nccRes.data.map((row) => {
            const entity = new NhaCungCap({
              maNCC: row.ma_ncc,
              tenNCC: row.ten_ncc,
              soDienThoai: row.so_dien_thoai ?? '',
              email: row.email ?? '',
              diaChi: row.dia_chi ?? '',
              tongCongNo: Number(row.tong_cong_no),
              createdAt: row.created_at,
              updatedAt: row.updated_at,
            });
            return {
              id: entity.maNCC,
              code: entity.maNCC,
              name: entity.tenNCC,
              phoneNumber: entity.soDienThoai,
              email: entity.email,
              address: entity.diaChi,
              bankAccount: '',
              isActive: true,
              totalImported: importedMap.get(entity.maNCC) ?? 0,
              totalPaid: paidMap.get(entity.maNCC) ?? 0,
              currentDebt: entity.tongCongNo,
            };
          });
        }
      } catch {
        list = [...bookstoreStore.suppliers];
      }
    }

    if (!search || !search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.phoneNumber.includes(q)
    );
  }

  async findById(id: string): Promise<SupplierDTO | null> {
    const all = await this.findAll();
    return all.find((s) => s.id === id) ?? null;
  }

  async create(dto: CreateSupplierDTO): Promise<SupplierDTO> {
    const maNCC = (dto.code?.trim() || `NCC-${Date.now().toString().slice(-5)}`).toUpperCase();
    const entity = new NhaCungCap({
      maNCC,
      tenNCC: dto.name,
      soDienThoai: dto.phoneNumber,
      email: dto.email ?? '',
      diaChi: dto.address,
      tongCongNo: 0,
    });

    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('nha_cung_cap').insert({
        ma_ncc: entity.maNCC,
        ten_ncc: entity.tenNCC,
        so_dien_thoai: entity.soDienThoai || null,
        email: entity.email || null,
        dia_chi: entity.diaChi || null,
        tong_cong_no: 0,
      });
      if (error) throw new Error(`Không thể thêm NCC vào CSDL: ${error.message}`);
      return {
        id: entity.maNCC,
        code: entity.maNCC,
        name: entity.tenNCC,
        phoneNumber: entity.soDienThoai,
        email: entity.email,
        address: entity.diaChi,
        bankAccount: dto.bankAccount?.trim() ?? '',
        isActive: true,
        totalImported: 0,
        totalPaid: 0,
        currentDebt: 0,
      };
    }

    const item: SupplierDTO = {
      id: entity.maNCC,
      code: entity.maNCC,
      name: entity.tenNCC,
      phoneNumber: entity.soDienThoai,
      email: entity.email,
      address: entity.diaChi,
      bankAccount: dto.bankAccount?.trim() ?? '',
      isActive: true,
      totalImported: 0,
      totalPaid: 0,
      currentDebt: 0,
    };
    bookstoreStore.suppliers.unshift(item);
    return item;
  }

  async update(dto: UpdateSupplierDTO): Promise<SupplierDTO> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('nha_cung_cap')
        .update({
          ...(dto.name !== undefined ? { ten_ncc: dto.name.trim() } : {}),
          ...(dto.phoneNumber !== undefined ? { so_dien_thoai: dto.phoneNumber.trim() || null } : {}),
          ...(dto.email !== undefined ? { email: dto.email.trim() || null } : {}),
          ...(dto.address !== undefined ? { dia_chi: dto.address.trim() || null } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq('ma_ncc', dto.id);
      if (error) throw new Error(`Không thể cập nhật NCC: ${error.message}`);
      const updated = await this.findById(dto.id);
      if (!updated) throw new Error('Không tìm thấy nhà cung cấp.');
      return updated;
    }

    const found = bookstoreStore.suppliers.find((s) => s.id === dto.id);
    if (!found) throw new Error('Không tìm thấy nhà cung cấp.');
    if (dto.name !== undefined) found.name = dto.name.trim();
    if (dto.phoneNumber !== undefined) found.phoneNumber = dto.phoneNumber.trim();
    if (dto.email !== undefined) found.email = dto.email.trim();
    if (dto.address !== undefined) found.address = dto.address.trim();
    if (dto.bankAccount !== undefined) found.bankAccount = dto.bankAccount.trim();
    if (dto.isActive !== undefined) found.isActive = dto.isActive;
    return found;
  }
}
