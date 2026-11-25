import { supabase } from '@/lib/supabase/client';
import { VaiTro } from '@/models/VaiTro';
import { mockAuthStore } from '@/lib/auth/mockStore';
import type { IVaiTroRepository } from './IVaiTroRepository';

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes('placeholder.supabase.co'));
}

export class VaiTroRepository implements IVaiTroRepository {
  async findAll(): Promise<VaiTro[]> {
    if (!isSupabaseConfigured()) {
      return Array.from(mockAuthStore.roles.values());
    }

    try {
      const { data, error } = await supabase
        .from('vai_tro')
        .select('*')
        .order('ma_vai_tro', { ascending: true });

      if (error || !data || data.length === 0) {
        return Array.from(mockAuthStore.roles.values());
      }

      return data.map(
        (row) =>
          new VaiTro({
            maVaiTro: row.ma_vai_tro,
            tenVaiTro: row.ten_vai_tro,
            danhSachQuyen: row.danh_sach_quyen,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          })
      );
    } catch {
      return Array.from(mockAuthStore.roles.values());
    }
  }

  async findByCode(maVaiTro: string): Promise<VaiTro | null> {
    if (!isSupabaseConfigured()) {
      return mockAuthStore.roles.get(maVaiTro) ?? null;
    }

    try {
      const { data, error } = await supabase
        .from('vai_tro')
        .select('*')
        .eq('ma_vai_tro', maVaiTro)
        .single();

      if (error || !data) {
        return mockAuthStore.roles.get(maVaiTro) ?? null;
      }

      return new VaiTro({
        maVaiTro: data.ma_vai_tro,
        tenVaiTro: data.ten_vai_tro,
        danhSachQuyen: data.danh_sach_quyen,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      });
    } catch {
      return mockAuthStore.roles.get(maVaiTro) ?? null;
    }
  }

  async updatePermissions(maVaiTro: string, danhSachQuyen: string[]): Promise<VaiTro> {
    const cleanPermissions = Array.from(
      new Set(danhSachQuyen.map((q) => q.trim()).filter(Boolean))
    );

    if (!isSupabaseConfigured()) {
      const role = mockAuthStore.roles.get(maVaiTro);
      if (!role) {
        throw new Error(`Không tìm thấy vai trò "${maVaiTro}".`);
      }
      role.phanQuyen(cleanPermissions);
      return role;
    }

    const { data, error } = await supabase
      .from('vai_tro')
      .update({ danh_sach_quyen: cleanPermissions })
      .eq('ma_vai_tro', maVaiTro)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Không thể cập nhật quyền cho vai trò "${maVaiTro}": ${error?.message}`);
    }

    return new VaiTro({
      maVaiTro: data.ma_vai_tro,
      tenVaiTro: data.ten_vai_tro,
      danhSachQuyen: data.danh_sach_quyen,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }
}
