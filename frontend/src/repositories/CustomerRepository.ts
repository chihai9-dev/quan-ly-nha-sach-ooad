import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { bookstoreStore, calculateTier } from '@/lib/mock/bookstoreStore';
import { KhachHang } from '@/models/KhachHang';
import type { CreateCustomerDTO, CustomerDTO, UpdateCustomerDTO } from '@/types/dtos';

export interface ICustomerRepository {
  findAll(search?: string): Promise<CustomerDTO[]>;
  findByPhone(phoneNumber: string): Promise<CustomerDTO | null>;
  create(dto: CreateCustomerDTO): Promise<CustomerDTO>;
  update(dto: UpdateCustomerDTO): Promise<CustomerDTO>;
}

/**
 * Triển khai CustomerRepository kết nối bảng `khach_hang` & `hoa_don` trên Supabase
 * (có fallback sang `bookstoreStore.customers`).
 */
export class CustomerRepository implements ICustomerRepository {
  async findAll(search?: string): Promise<CustomerDTO[]> {
    let list: CustomerDTO[];

    if (!isSupabaseConfigured()) {
      list = [...bookstoreStore.customers];
    } else {
      try {
        const [khRes, hdRes] = await Promise.all([
          supabase.from('khach_hang').select('*').order('created_at', { ascending: false }),
          supabase.from('hoa_don').select('ma_kh, thanh_toan_cuoi'),
        ]);
        if (khRes.error || !khRes.data) {
          list = [...bookstoreStore.customers];
        } else {
          const spentMap = new Map<string, number>();
          const countMap = new Map<string, number>();
          for (const hd of hdRes.data ?? []) {
            if (!hd.ma_kh) continue;
            spentMap.set(hd.ma_kh, (spentMap.get(hd.ma_kh) ?? 0) + Number(hd.thanh_toan_cuoi));
            countMap.set(hd.ma_kh, (countMap.get(hd.ma_kh) ?? 0) + 1);
          }

          list = khRes.data.map((row) => {
            const entity = new KhachHang({
              maKH: row.ma_kh,
              hoTen: row.ho_ten,
              soDienThoai: row.so_dien_thoai ?? '',
              email: row.email ?? '',
              diemTichLuy: row.diem_tich_luy,
              createdAt: row.created_at,
              updatedAt: row.updated_at,
            });
            return {
              id: entity.maKH,
              fullName: entity.hoTen,
              phoneNumber: entity.soDienThoai,
              email: entity.email,
              address: '',
              loyaltyPoints: entity.diemTichLuy,
              tier: entity.xacDinhHangThanhVien(),
              totalSpent: spentMap.get(entity.maKH) ?? 0,
              orderCount: countMap.get(entity.maKH) ?? 0,
              createdAt: row.created_at.slice(0, 10),
            };
          });
        }
      } catch {
        list = [...bookstoreStore.customers];
      }
    }

    if (!search || !search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.phoneNumber.includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }

  async findByPhone(phoneNumber: string): Promise<CustomerDTO | null> {
    const all = await this.findAll();
    return all.find((c) => c.phoneNumber === phoneNumber.trim()) ?? null;
  }

  async create(dto: CreateCustomerDTO): Promise<CustomerDTO> {
    const maKH = `KH-${Date.now().toString().slice(-6)}`;
    const entity = new KhachHang({
      maKH,
      hoTen: dto.fullName,
      soDienThoai: dto.phoneNumber,
      email: dto.email ?? '',
      diemTichLuy: 0,
    });

    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('khach_hang').insert({
        ma_kh: entity.maKH,
        ho_ten: entity.hoTen,
        so_dien_thoai: entity.soDienThoai || null,
        email: entity.email || null,
        diem_tich_luy: 0,
      });
      if (error) throw new Error(`Không thể thêm khách hàng vào CSDL: ${error.message}`);
      return {
        id: entity.maKH,
        fullName: entity.hoTen,
        phoneNumber: entity.soDienThoai,
        email: entity.email,
        address: dto.address?.trim() ?? '',
        loyaltyPoints: 0,
        tier: 'STANDARD',
        totalSpent: 0,
        orderCount: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      };
    }

    const item: CustomerDTO = {
      id: entity.maKH,
      fullName: entity.hoTen,
      phoneNumber: entity.soDienThoai,
      email: entity.email,
      address: dto.address?.trim() ?? '',
      loyaltyPoints: 0,
      tier: 'STANDARD',
      totalSpent: 0,
      orderCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    bookstoreStore.customers.unshift(item);
    return item;
  }

  async update(dto: UpdateCustomerDTO): Promise<CustomerDTO> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('khach_hang')
        .update({
          ...(dto.fullName !== undefined ? { ho_ten: dto.fullName.trim() } : {}),
          ...(dto.phoneNumber !== undefined ? { so_dien_thoai: dto.phoneNumber.trim() || null } : {}),
          ...(dto.email !== undefined ? { email: dto.email.trim() || null } : {}),
          ...(dto.loyaltyPoints !== undefined && dto.loyaltyPoints >= 0
            ? { diem_tich_luy: dto.loyaltyPoints }
            : {}),
          updated_at: new Date().toISOString(),
        })
        .eq('ma_kh', dto.id);
      if (error) throw new Error(`Không thể cập nhật khách hàng: ${error.message}`);
      const all = await this.findAll();
      const updated = all.find((c) => c.id === dto.id);
      if (!updated) throw new Error('Không tìm thấy hồ sơ khách hàng.');
      return updated;
    }

    const found = bookstoreStore.customers.find((c) => c.id === dto.id);
    if (!found) throw new Error('Không tìm thấy hồ sơ khách hàng.');
    if (dto.fullName !== undefined) found.fullName = dto.fullName.trim();
    if (dto.phoneNumber !== undefined) found.phoneNumber = dto.phoneNumber.trim();
    if (dto.email !== undefined) found.email = dto.email.trim();
    if (dto.address !== undefined) found.address = dto.address.trim();
    if (dto.loyaltyPoints !== undefined && dto.loyaltyPoints >= 0) {
      found.loyaltyPoints = dto.loyaltyPoints;
      found.tier = calculateTier(dto.loyaltyPoints);
    }
    return found;
  }
}
