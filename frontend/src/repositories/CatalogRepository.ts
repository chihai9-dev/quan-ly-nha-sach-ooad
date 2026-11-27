import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { bookstoreStore } from '@/lib/mock/bookstoreStore';
import { TheLoai } from '@/models/TheLoai';
import { TacGia } from '@/models/TacGia';
import { NhaXuatBan } from '@/models/NhaXuatBan';
import type { AuthorDTO, CategoryDTO, PublisherDTO } from '@/types/dtos';

export interface ICatalogRepository {
  getCategories(): Promise<CategoryDTO[]>;
  createCategory(input: Omit<CategoryDTO, 'id'>): Promise<CategoryDTO>;
  updateCategory(id: string, input: Partial<Omit<CategoryDTO, 'id'>>): Promise<CategoryDTO>;
  deleteCategory(id: string): Promise<boolean>;
  toggleCategoryStatus(id: string): Promise<CategoryDTO>;

  getAuthors(): Promise<AuthorDTO[]>;
  createAuthor(input: Omit<AuthorDTO, 'id'>): Promise<AuthorDTO>;
  updateAuthor(id: string, input: Partial<Omit<AuthorDTO, 'id'>>): Promise<AuthorDTO>;
  deleteAuthor(id: string): Promise<boolean>;

  getPublishers(): Promise<PublisherDTO[]>;
  createPublisher(input: Omit<PublisherDTO, 'id'>): Promise<PublisherDTO>;
  updatePublisher(id: string, input: Partial<Omit<PublisherDTO, 'id'>>): Promise<PublisherDTO>;
  deletePublisher(id: string): Promise<boolean>;
}

export class CatalogRepository implements ICatalogRepository {
  // =========================================================================
  // THỂ LOẠI (Bảng public.the_loai - Lớp TheLoai)
  // =========================================================================
  async getCategories(): Promise<CategoryDTO[]> {
    if (!isSupabaseConfigured()) {
      return [...bookstoreStore.categories];
    }
    try {
      const { data, error } = await supabase
        .from('the_loai')
        .select('*')
        .order('ten_the_loai');
      if (error || !data) return [...bookstoreStore.categories];
      return data.map((row) => {
        const entity = new TheLoai({
          maTheLoai: row.ma_the_loai,
          tenTheLoai: row.ten_the_loai,
          moTa: row.mo_ta ?? '',
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        });
        return {
          id: entity.maTheLoai,
          code: entity.maTheLoai,
          name: entity.tenTheLoai,
          description: entity.moTa,
          isActive: true,
        };
      });
    } catch {
      return [...bookstoreStore.categories];
    }
  }

  async createCategory(input: Omit<CategoryDTO, 'id'>): Promise<CategoryDTO> {
    const entity = new TheLoai({
      maTheLoai: input.code,
      tenTheLoai: input.name,
      moTa: input.description,
    });

    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('the_loai').insert({
        ma_the_loai: entity.maTheLoai,
        ten_the_loai: entity.tenTheLoai,
        mo_ta: entity.moTa || null,
      });
      if (error) throw new Error(`Không thể thêm thể loại vào CSDL: ${error.message}`);
      return {
        id: entity.maTheLoai,
        code: entity.maTheLoai,
        name: entity.tenTheLoai,
        description: entity.moTa,
        isActive: true,
      };
    }

    const item: CategoryDTO = {
      id: entity.maTheLoai,
      code: entity.maTheLoai,
      name: entity.tenTheLoai,
      description: entity.moTa,
      isActive: input.isActive,
    };
    bookstoreStore.categories.unshift(item);
    return item;
  }

  async updateCategory(id: string, input: Partial<Omit<CategoryDTO, 'id'>>): Promise<CategoryDTO> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('the_loai')
        .update({
          ...(input.name !== undefined ? { ten_the_loai: input.name.trim() } : {}),
          ...(input.description !== undefined ? { mo_ta: input.description.trim() || null } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq('ma_the_loai', id)
        .select()
        .single();
      if (error || !data) throw new Error(`Không thể cập nhật thể loại: ${error?.message ?? 'Không tìm thấy'}`);
      return {
        id: data.ma_the_loai,
        code: data.ma_the_loai,
        name: data.ten_the_loai,
        description: data.mo_ta ?? '',
        isActive: input.isActive ?? true,
      };
    }

    const found = bookstoreStore.categories.find((c) => c.id === id);
    if (!found) throw new Error('Không tìm thấy thể loại sách.');
    if (input.name !== undefined) found.name = input.name.trim();
    if (input.description !== undefined) found.description = input.description.trim();
    if (input.isActive !== undefined) found.isActive = input.isActive;
    return found;
  }

  async deleteCategory(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('the_loai').delete().eq('ma_the_loai', id);
      if (error) {
        throw new Error('Không thể xóa thể loại đang có sách thuộc thể loại này.');
      }
      return true;
    }

    const idx = bookstoreStore.categories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Không tìm thấy thể loại sách.');
    const cat = bookstoreStore.categories[idx];
    const hasBooks = bookstoreStore.books.some((b) => b.categoryName === cat.name);
    if (hasBooks) {
      throw new Error('Không thể xóa thể loại đang có sách liên kết.');
    }
    bookstoreStore.categories.splice(idx, 1);
    return true;
  }

  async toggleCategoryStatus(id: string): Promise<CategoryDTO> {
    const found = bookstoreStore.categories.find((c) => c.id === id);
    if (found) {
      found.isActive = !found.isActive;
      return found;
    }
    const all = await this.getCategories();
    const match = all.find((c) => c.id === id);
    if (!match) throw new Error('Không tìm thấy thể loại sách.');
    return { ...match, isActive: !match.isActive };
  }

  // =========================================================================
  // TÁC GIẢ (Bảng public.tac_gia - Lớp TacGia)
  // =========================================================================
  async getAuthors(): Promise<AuthorDTO[]> {
    if (!isSupabaseConfigured()) {
      return [...bookstoreStore.authors];
    }
    try {
      const { data, error } = await supabase
        .from('tac_gia')
        .select('*')
        .order('ten_tac_gia');
      if (error || !data) return [...bookstoreStore.authors];
      return data.map((row) => {
        const entity = new TacGia({
          maTacGia: row.ma_tac_gia,
          tenTacGia: row.ten_tac_gia,
          tieuSu: row.tieu_su ?? '',
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        });
        return {
          id: entity.maTacGia,
          name: entity.tenTacGia,
          penName: entity.tenTacGia,
          nationality: 'Việt Nam',
          biography: entity.tieuSu,
        };
      });
    } catch {
      return [...bookstoreStore.authors];
    }
  }

  async createAuthor(input: Omit<AuthorDTO, 'id'>): Promise<AuthorDTO> {
    const maTacGia = `TG-${Date.now().toString().slice(-6)}`;
    const entity = new TacGia({
      maTacGia,
      tenTacGia: input.name,
      tieuSu: input.biography,
    });

    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('tac_gia').insert({
        ma_tac_gia: entity.maTacGia,
        ten_tac_gia: entity.tenTacGia,
        tieu_su: entity.tieuSu || null,
      });
      if (error) throw new Error(`Không thể thêm tác giả vào CSDL: ${error.message}`);
      return {
        id: entity.maTacGia,
        name: entity.tenTacGia,
        penName: input.penName || entity.tenTacGia,
        nationality: input.nationality || 'Việt Nam',
        biography: entity.tieuSu,
      };
    }

    const item: AuthorDTO = { id: entity.maTacGia, ...input };
    bookstoreStore.authors.unshift(item);
    return item;
  }

  async updateAuthor(id: string, input: Partial<Omit<AuthorDTO, 'id'>>): Promise<AuthorDTO> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('tac_gia')
        .update({
          ...(input.name !== undefined ? { ten_tac_gia: input.name.trim() } : {}),
          ...(input.biography !== undefined ? { tieu_su: input.biography.trim() || null } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq('ma_tac_gia', id)
        .select()
        .single();
      if (error || !data) throw new Error(`Không thể cập nhật tác giả: ${error?.message ?? 'Không tìm thấy'}`);
      return {
        id: data.ma_tac_gia,
        name: data.ten_tac_gia,
        penName: input.penName || data.ten_tac_gia,
        nationality: input.nationality || 'Việt Nam',
        biography: data.tieu_su ?? '',
      };
    }

    const found = bookstoreStore.authors.find((a) => a.id === id);
    if (!found) throw new Error('Không tìm thấy tác giả.');
    if (input.name !== undefined) found.name = input.name.trim();
    if (input.penName !== undefined) found.penName = input.penName.trim();
    if (input.nationality !== undefined) found.nationality = input.nationality.trim();
    if (input.biography !== undefined) found.biography = input.biography.trim();
    return found;
  }

  async deleteAuthor(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('tac_gia').delete().eq('ma_tac_gia', id);
      if (error) throw new Error('Không thể xóa tác giả đang có sách liên kết.');
      return true;
    }

    const idx = bookstoreStore.authors.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Không tìm thấy tác giả.');
    bookstoreStore.authors.splice(idx, 1);
    return true;
  }

  // =========================================================================
  // NHÀ XUẤT BẢN (Bảng public.nha_xuat_ban - Lớp NhaXuatBan)
  // =========================================================================
  async getPublishers(): Promise<PublisherDTO[]> {
    if (!isSupabaseConfigured()) {
      return [...bookstoreStore.publishers];
    }
    try {
      const { data, error } = await supabase
        .from('nha_xuat_ban')
        .select('*')
        .order('ten_nxb');
      if (error || !data) return [...bookstoreStore.publishers];
      return data.map((row) => {
        const entity = new NhaXuatBan({
          maNXB: row.ma_nxb,
          tenNXB: row.ten_nxb,
          diaChi: row.dia_chi ?? '',
          soDienThoai: row.so_dien_thoai ?? '',
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        });
        return {
          id: entity.maNXB,
          name: entity.tenNXB,
          address: entity.diaChi,
          phoneNumber: entity.soDienThoai,
        };
      });
    } catch {
      return [...bookstoreStore.publishers];
    }
  }

  async createPublisher(input: Omit<PublisherDTO, 'id'>): Promise<PublisherDTO> {
    const maNXB = `NXB-${Date.now().toString().slice(-6)}`;
    const entity = new NhaXuatBan({
      maNXB,
      tenNXB: input.name,
      diaChi: input.address,
      soDienThoai: input.phoneNumber,
    });

    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('nha_xuat_ban').insert({
        ma_nxb: entity.maNXB,
        ten_nxb: entity.tenNXB,
        dia_chi: entity.diaChi || null,
        so_dien_thoai: entity.soDienThoai || null,
      });
      if (error) throw new Error(`Không thể thêm NXB vào CSDL: ${error.message}`);
      return {
        id: entity.maNXB,
        name: entity.tenNXB,
        address: entity.diaChi,
        phoneNumber: entity.soDienThoai,
        contactPerson: input.contactPerson,
      };
    }

    const item: PublisherDTO = { id: entity.maNXB, ...input };
    bookstoreStore.publishers.unshift(item);
    return item;
  }

  async updatePublisher(id: string, input: Partial<Omit<PublisherDTO, 'id'>>): Promise<PublisherDTO> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('nha_xuat_ban')
        .update({
          ...(input.name !== undefined ? { ten_nxb: input.name.trim() } : {}),
          ...(input.address !== undefined ? { dia_chi: input.address.trim() || null } : {}),
          ...(input.phoneNumber !== undefined ? { so_dien_thoai: input.phoneNumber.trim() || null } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq('ma_nxb', id)
        .select()
        .single();
      if (error || !data) throw new Error(`Không thể cập nhật NXB: ${error?.message ?? 'Không tìm thấy'}`);
      return {
        id: data.ma_nxb,
        name: data.ten_nxb,
        address: data.dia_chi ?? '',
        phoneNumber: data.so_dien_thoai ?? '',
        contactPerson: input.contactPerson,
      };
    }

    const found = bookstoreStore.publishers.find((p) => p.id === id);
    if (!found) throw new Error('Không tìm thấy nhà xuất bản.');
    if (input.name !== undefined) found.name = input.name.trim();
    if (input.address !== undefined) found.address = input.address.trim();
    if (input.phoneNumber !== undefined) found.phoneNumber = input.phoneNumber.trim();
    if (input.contactPerson !== undefined) found.contactPerson = input.contactPerson.trim();
    return found;
  }

  async deletePublisher(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('nha_xuat_ban').delete().eq('ma_nxb', id);
      if (error) throw new Error('Không thể xóa nhà xuất bản đang có sách liên kết.');
      return true;
    }

    const idx = bookstoreStore.publishers.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Không tìm thấy nhà xuất bản.');
    bookstoreStore.publishers.splice(idx, 1);
    return true;
  }
}
