import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { bookstoreStore } from '@/lib/mock/bookstoreStore';
import { Sach } from '@/models/Sach';
import { TheLoai } from '@/models/TheLoai';
import { TacGia } from '@/models/TacGia';
import { NhaXuatBan } from '@/models/NhaXuatBan';
import { ChuongTrinhKhuyenMai } from '@/models/ChuongTrinhKhuyenMai';
import type { IBookRepository } from './IBookRepository';
import type { BookFilterParams, CreateBookDTO, UpdateBookDTO } from '@/types/dtos';

/**
 * Triển khai BookRepository sử dụng Supabase (bảng `sach`, `sach_tac_gia`, `the_loai`, `nha_xuat_ban`, `tac_gia`, `chuong_trinh_khuyen_mai`)
 * có fallback sang `bookstoreStore` khi chưa cấu hình `.env.local`.
 */
export class BookRepository implements IBookRepository {
  async findAll(filter?: BookFilterParams): Promise<Sach[]> {
    if (!isSupabaseConfigured()) {
      return this.filterList(this.getMockSachList(), filter);
    }

    try {
      const [sachRes, tlRes, nxbRes, tgRes, stgRes, kmRes] = await Promise.all([
        supabase.from('sach').select('*').order('created_at', { ascending: false }),
        supabase.from('the_loai').select('*'),
        supabase.from('nha_xuat_ban').select('*'),
        supabase.from('tac_gia').select('*'),
        supabase.from('sach_tac_gia').select('*'),
        supabase.from('chuong_trinh_khuyen_mai').select('*'),
      ]);

      if (sachRes.error || !sachRes.data) {
        return this.filterList(this.getMockSachList(), filter);
      }

      const tlMap = new Map(
        (tlRes.data ?? []).map((r) => [
          r.ma_the_loai,
          new TheLoai({ maTheLoai: r.ma_the_loai, tenTheLoai: r.ten_the_loai, moTa: r.mo_ta ?? '' }),
        ])
      );
      const nxbMap = new Map(
        (nxbRes.data ?? []).map((r) => [
          r.ma_nxb,
          new NhaXuatBan({
            maNXB: r.ma_nxb,
            tenNXB: r.ten_nxb,
            diaChi: r.dia_chi ?? '',
            soDienThoai: r.so_dien_thoai ?? '',
          }),
        ])
      );
      const tgMap = new Map(
        (tgRes.data ?? []).map((r) => [
          r.ma_tac_gia,
          new TacGia({ maTacGia: r.ma_tac_gia, tenTacGia: r.ten_tac_gia, tieuSu: r.tieu_su ?? '' }),
        ])
      );
      const kmMap = new Map(
        (kmRes.data ?? []).map((r) => [
          r.ma_ctkm,
          new ChuongTrinhKhuyenMai({
            maCTKM: r.ma_ctkm,
            tenCTKM: r.ten_ctkm,
            ngayBatDau: r.ngay_bat_dau,
            ngayKetThuc: r.ngay_ket_thuc,
            phanTramGiam: Number(r.phan_tram_giam),
            trangThai: r.trang_thai,
          }),
        ])
      );

      const authorsByBook = new Map<string, TacGia[]>();
      for (const link of stgRes.data ?? []) {
        const tg = tgMap.get(link.ma_tac_gia);
        if (tg) {
          const list = authorsByBook.get(link.ma_sach) ?? [];
          list.push(tg);
          authorsByBook.set(link.ma_sach, list);
        }
      }

      const list = sachRes.data.map(
        (row) =>
          new Sach({
            maSach: row.ma_sach,
            tenSach: row.ten_sach,
            namXuatBan: row.nam_xuat_ban ?? new Date().getFullYear(),
            giaNhap: Number(row.gia_nhap),
            giaBan: Number(row.gia_ban),
            soLuongTon: row.so_luong_ton,
            mucTonToiThieu: row.muc_ton_toi_thieu,
            trangThai: row.trang_thai,
            theLoai: tlMap.get(row.ma_the_loai) ?? null,
            nhaXuatBan: nxbMap.get(row.ma_nxb) ?? null,
            danhSachTacGia: authorsByBook.get(row.ma_sach) ?? [],
            chuongTrinhKhuyenMai: row.ma_ctkm ? kmMap.get(row.ma_ctkm) ?? null : null,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          })
      );

      return this.filterList(list, filter);
    } catch {
      return this.filterList(this.getMockSachList(), filter);
    }
  }

  async findById(maSach: string): Promise<Sach | null> {
    const all = await this.findAll();
    const target = maSach.trim().toLowerCase();
    return all.find((s) => s.maSach.toLowerCase() === target) ?? null;
  }

  async create(dto: CreateBookDTO): Promise<Sach> {
    const maSach = dto.isbn.trim() || `S-${Date.now().toString().slice(-6)}`;
    const giaNhap = dto.costPrice ?? Math.round(dto.price * 0.7);
    const mucTonToiThieu = dto.minStockThreshold ?? 5;

    // Validate bằng Domain Entity Sach
    const sach = new Sach({
      maSach,
      tenSach: dto.title,
      namXuatBan: dto.publishYear ?? new Date().getFullYear(),
      giaNhap,
      giaBan: dto.price,
      soLuongTon: dto.stockQuantity,
      mucTonToiThieu,
      trangThai: dto.stockQuantity > 0 ? 'CON_HANG' : 'HET_HANG',
    });

    if (isSupabaseConfigured()) {
      const maTheLoai = dto.categoryId?.trim() || 'TL01';
      const maNxb = dto.publisherId?.trim() || 'NXB01';

      const { error } = await supabase.from('sach').insert({
        ma_sach: sach.maSach,
        ten_sach: sach.tenSach,
        nam_xuat_ban: sach.namXuatBan,
        gia_nhap: sach.giaNhap,
        gia_ban: sach.giaBan,
        so_luong_ton: sach.soLuongTon,
        muc_ton_toi_thieu: sach.mucTonToiThieu,
        trang_thai: sach.trangThai,
        ma_the_loai: maTheLoai,
        ma_nxb: maNxb,
        ma_ctkm: dto.promotionId || null,
      });

      if (error) {
        throw new Error(`Không thể thêm sách vào CSDL: ${error.message}`);
      }

      if (dto.authorIds && dto.authorIds.length > 0) {
        await supabase.from('sach_tac_gia').insert(
          dto.authorIds.map((maTacGia) => ({ ma_sach: sach.maSach, ma_tac_gia: maTacGia }))
        );
      }

      return (await this.findById(sach.maSach)) ?? sach;
    }

    const cat = bookstoreStore.categories.find(
      (c) => c.id === dto.categoryId || c.code === dto.categoryId
    );
    const pub = bookstoreStore.publishers.find(
      (p) => p.id === dto.publisherId || p.name === dto.publisher
    );

    bookstoreStore.books.unshift({
      id: sach.maSach,
      isbn: sach.maSach,
      title: sach.tenSach,
      author: dto.author || 'Chưa rõ tác giả',
      publisher: pub?.name ?? dto.publisher ?? 'NXB Trẻ',
      categoryName: cat?.name ?? 'Công nghệ thông tin',
      price: sach.giaBan,
      costPrice: sach.giaNhap,
      stockQuantity: sach.soLuongTon,
      minStockThreshold: sach.mucTonToiThieu,
      maxStockThreshold: 100,
      soldQuantity: 0,
      businessStatus: 'SELLING',
    });

    return (await this.findById(sach.maSach)) ?? sach;
  }

  async update(dto: UpdateBookDTO): Promise<Sach> {
    if (isSupabaseConfigured()) {
      const updatePayload: {
        ten_sach?: string;
        nam_xuat_ban?: number | null;
        gia_nhap?: number;
        gia_ban?: number;
        so_luong_ton?: number;
        muc_ton_toi_thieu?: number;
        ma_the_loai?: string;
        ma_nxb?: string;
        ma_ctkm?: string | null;
        trang_thai?: string;
        updated_at: string;
      } = {
        updated_at: new Date().toISOString(),
      };
      if (dto.title !== undefined) updatePayload.ten_sach = dto.title.trim();
      if (dto.publishYear !== undefined) updatePayload.nam_xuat_ban = dto.publishYear;
      if (dto.costPrice !== undefined) updatePayload.gia_nhap = dto.costPrice;
      if (dto.price !== undefined) updatePayload.gia_ban = dto.price;
      if (dto.stockQuantity !== undefined) updatePayload.so_luong_ton = dto.stockQuantity;
      if (dto.minStockThreshold !== undefined) updatePayload.muc_ton_toi_thieu = dto.minStockThreshold;
      if (dto.categoryId !== undefined) updatePayload.ma_the_loai = dto.categoryId;
      if (dto.publisherId !== undefined) updatePayload.ma_nxb = dto.publisherId;
      if (dto.promotionId !== undefined) updatePayload.ma_ctkm = dto.promotionId || null;
      if (dto.status !== undefined) updatePayload.trang_thai = dto.status;

      const { error } = await supabase.from('sach').update(updatePayload).eq('ma_sach', dto.id);
      if (error) throw new Error(`Không thể cập nhật sách: ${error.message}`);

      if (dto.authorIds) {
        await supabase.from('sach_tac_gia').delete().eq('ma_sach', dto.id);
        if (dto.authorIds.length > 0) {
          await supabase.from('sach_tac_gia').insert(
            dto.authorIds.map((maTacGia) => ({ ma_sach: dto.id, ma_tac_gia: maTacGia }))
          );
        }
      }

      const updated = await this.findById(dto.id);
      if (!updated) throw new Error('Không tìm thấy sách sau khi cập nhật.');
      return updated;
    }

    const found = bookstoreStore.books.find((b) => b.id === dto.id || b.isbn === dto.id);
    if (!found) throw new Error('Không tìm thấy sách cần cập nhật.');
    if (dto.title !== undefined) found.title = dto.title.trim();
    if (dto.author !== undefined) found.author = dto.author.trim();
    if (dto.publisher !== undefined) found.publisher = dto.publisher.trim();
    if (dto.price !== undefined) found.price = dto.price;
    if (dto.costPrice !== undefined) found.costPrice = dto.costPrice;
    if (dto.stockQuantity !== undefined) found.stockQuantity = dto.stockQuantity;
    if (dto.minStockThreshold !== undefined) found.minStockThreshold = dto.minStockThreshold;
    if (dto.status === 'NGUNG_BAN') found.businessStatus = 'DISCONTINUED';
    if (dto.status === 'CON_HANG') found.businessStatus = 'SELLING';
    if (dto.categoryId) {
      const cat = bookstoreStore.categories.find(
        (c) => c.id === dto.categoryId || c.code === dto.categoryId
      );
      if (cat) found.categoryName = cat.name;
    }

    const updated = await this.findById(found.id);
    if (!updated) throw new Error('Không tìm thấy sách sau khi cập nhật.');
    return updated;
  }

  /**
   * Xóa sách theo Activity `xoa-sach.drawio` & State Diagram `state-book.drawio`:
   * - Nếu sách đã có giao dịch (ràng buộc FK) -> chuyển sang trạng thái NGUNG_BAN
   * - Nếu chưa có giao dịch -> xóa hẳn khỏi CSDL
   */
  async delete(maSach: string): Promise<{ deleted: boolean; discontinued: boolean }> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('sach').delete().eq('ma_sach', maSach);
      if (error) {
        const { error: updErr } = await supabase
          .from('sach')
          .update({ trang_thai: 'NGUNG_BAN', updated_at: new Date().toISOString() })
          .eq('ma_sach', maSach);
        if (updErr) throw new Error(`Không thể xóa hoặc ngưng bán sách: ${updErr.message}`);
        return { deleted: false, discontinued: true };
      }
      return { deleted: true, discontinued: false };
    }

    const idx = bookstoreStore.books.findIndex((b) => b.id === maSach || b.isbn === maSach);
    if (idx === -1) throw new Error('Không tìm thấy đầu sách cần xóa.');
    const target = bookstoreStore.books[idx];
    if (target.soldQuantity > 0) {
      target.businessStatus = 'DISCONTINUED';
      return { deleted: false, discontinued: true };
    }
    bookstoreStore.books.splice(idx, 1);
    return { deleted: true, discontinued: false };
  }

  async updateStock(maSach: string, remainingStock: number): Promise<void> {
    if (remainingStock < 0) {
      throw new Error('Số lượng tồn kho không thể âm.');
    }

    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('sach')
        .update({
          so_luong_ton: remainingStock,
          trang_thai: remainingStock > 0 ? 'CON_HANG' : 'HET_HANG',
          updated_at: new Date().toISOString(),
        })
        .eq('ma_sach', maSach);
      if (error) throw new Error(`Lỗi cập nhật tồn kho: ${error.message}`);
      return;
    }

    const found = bookstoreStore.books.find((b) => b.id === maSach || b.isbn === maSach);
    if (found) {
      found.stockQuantity = remainingStock;
    }
  }

  private getMockSachList(): Sach[] {
    return bookstoreStore.books.map((b) => {
      const cat = bookstoreStore.categories.find((c) => c.name === b.categoryName);
      const pub = bookstoreStore.publishers.find((p) => p.name === b.publisher);
      return new Sach({
        maSach: b.id,
        tenSach: b.title,
        namXuatBan: 2024,
        giaNhap: b.costPrice,
        giaBan: b.price,
        soLuongTon: b.stockQuantity,
        mucTonToiThieu: b.minStockThreshold,
        trangThai:
          b.businessStatus === 'DISCONTINUED'
            ? 'NGUNG_BAN'
            : b.stockQuantity > 0
              ? 'CON_HANG'
              : 'HET_HANG',
        theLoai: new TheLoai({
          maTheLoai: cat?.code ?? 'TL01',
          tenTheLoai: b.categoryName,
          moTa: cat?.description ?? '',
        }),
        nhaXuatBan: new NhaXuatBan({
          maNXB: pub?.id ?? 'NXB01',
          tenNXB: b.publisher,
          diaChi: pub?.address ?? '',
          soDienThoai: pub?.phoneNumber ?? '',
        }),
        danhSachTacGia: [
          new TacGia({
            maTacGia: `TG-${b.id}`,
            tenTacGia: b.author,
          }),
        ],
      });
    });
  }

  private filterList(list: Sach[], filter?: BookFilterParams): Sach[] {
    let result = list;
    if (filter?.categoryId) {
      const targetCat = filter.categoryId.toLowerCase();
      result = result.filter(
        (s) =>
          s.theLoai?.maTheLoai.toLowerCase() === targetCat ||
          s.theLoai?.tenTheLoai.toLowerCase() === targetCat
      );
    }
    if (filter?.inStockOnly) {
      result = result.filter((s) => s.soLuongTon > 0 && s.trangThai !== 'NGUNG_BAN');
    }
    if (filter?.searchTerm?.trim()) {
      const kw = filter.searchTerm.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.maSach.toLowerCase().includes(kw) ||
          s.tenSach.toLowerCase().includes(kw) ||
          s.danhSachTacGia.some((tg) => tg.tenTacGia.toLowerCase().includes(kw)) ||
          (s.theLoai?.tenTheLoai.toLowerCase().includes(kw) ?? false) ||
          (s.nhaXuatBan?.tenNXB.toLowerCase().includes(kw) ?? false)
      );
    }
    return result;
  }
}
