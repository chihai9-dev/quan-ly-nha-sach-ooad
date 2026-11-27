import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { bookstoreStore, computeAlertStatus, type MockBookRecord } from '@/lib/mock/bookstoreStore';
import type {
  CreateDamagedWriteOffDTO,
  CreateStockAuditDTO,
  InventoryItemDTO,
  StockAuditDTO,
  StockAuditItemDTO,
} from '@/types/dtos';

function toInventoryDTO(b: MockBookRecord): InventoryItemDTO {
  return {
    bookId: b.id,
    isbn: b.isbn,
    title: b.title,
    categoryName: b.categoryName,
    price: b.price,
    costPrice: b.costPrice,
    stockQuantity: b.stockQuantity,
    minStockThreshold: b.minStockThreshold,
    maxStockThreshold: b.maxStockThreshold,
    soldQuantity: b.soldQuantity,
    businessStatus: b.businessStatus,
    alertStatus: computeAlertStatus(b.stockQuantity, b.minStockThreshold, b.maxStockThreshold),
  };
}

export interface IInventoryRepository {
  getInventoryItems(): Promise<InventoryItemDTO[]>;
  updateThresholds(bookId: string, minStock: number, maxStock: number): Promise<InventoryItemDTO>;
  toggleBusinessStatus(bookId: string): Promise<InventoryItemDTO>;
  updateBookPrice(bookId: string, newPrice: number): Promise<InventoryItemDTO>;
  getAudits(): Promise<StockAuditDTO[]>;
  createAudit(dto: CreateStockAuditDTO): Promise<StockAuditDTO>;
  writeOffDamaged(dto: CreateDamagedWriteOffDTO): Promise<StockAuditDTO>;
}

/**
 * Triển khai InventoryRepository kết nối bảng `sach`, `phieu_kiem_ke`, `chi_tiet_kiem_ke` trên Supabase
 * (có fallback sang `bookstoreStore` khi chưa cấu hình `.env.local`).
 */
export class InventoryRepository implements IInventoryRepository {
  async getInventoryItems(): Promise<InventoryItemDTO[]> {
    if (!isSupabaseConfigured()) {
      return bookstoreStore.books.map(toInventoryDTO);
    }

    try {
      const [sachRes, tlRes, cthdRes] = await Promise.all([
        supabase.from('sach').select('*').order('ten_sach'),
        supabase.from('the_loai').select('ma_the_loai, ten_the_loai'),
        supabase.from('chi_tiet_hoa_don').select('ma_sach, so_luong_ban'),
      ]);
      if (sachRes.error || !sachRes.data) {
        return bookstoreStore.books.map(toInventoryDTO);
      }

      const tlMap = new Map((tlRes.data ?? []).map((t) => [t.ma_the_loai, t.ten_the_loai]));
      const soldMap = new Map<string, number>();
      for (const ct of cthdRes.data ?? []) {
        soldMap.set(ct.ma_sach, (soldMap.get(ct.ma_sach) ?? 0) + ct.so_luong_ban);
      }

      return sachRes.data.map((row) => {
        const minStock = row.muc_ton_toi_thieu;
        const maxStock = Math.max(minStock * 10, 100);
        return {
          bookId: row.ma_sach,
          isbn: row.ma_sach,
          title: row.ten_sach,
          categoryName: tlMap.get(row.ma_the_loai) ?? row.ma_the_loai,
          price: Number(row.gia_ban),
          costPrice: Number(row.gia_nhap),
          stockQuantity: row.so_luong_ton,
          minStockThreshold: minStock,
          maxStockThreshold: maxStock,
          soldQuantity: soldMap.get(row.ma_sach) ?? 0,
          businessStatus: row.trang_thai === 'NGUNG_BAN' ? 'DISCONTINUED' : 'SELLING',
          alertStatus: computeAlertStatus(row.so_luong_ton, minStock, maxStock),
        };
      });
    } catch {
      return bookstoreStore.books.map(toInventoryDTO);
    }
  }

  async updateThresholds(bookId: string, minStock: number, maxStock: number): Promise<InventoryItemDTO> {
    if (minStock < 0 || maxStock < minStock) {
      throw new Error('Ngưỡng tồn kho không hợp lệ (tối thiểu >= 0 và tối đa >= tối thiểu).');
    }

    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('sach')
        .update({ muc_ton_toi_thieu: minStock, updated_at: new Date().toISOString() })
        .eq('ma_sach', bookId);
      if (error) throw new Error(`Không thể cập nhật ngưỡng tồn: ${error.message}`);
      const items = await this.getInventoryItems();
      const updated = items.find((i) => i.bookId === bookId);
      if (!updated) throw new Error('Không tìm thấy sách trong kho.');
      return { ...updated, maxStockThreshold: maxStock };
    }

    const book = bookstoreStore.books.find((b) => b.id === bookId);
    if (!book) throw new Error('Không tìm thấy sách trong kho.');
    book.minStockThreshold = minStock;
    book.maxStockThreshold = maxStock;
    return toInventoryDTO(book);
  }

  async toggleBusinessStatus(bookId: string): Promise<InventoryItemDTO> {
    if (isSupabaseConfigured()) {
      const { data: current } = await supabase
        .from('sach')
        .select('trang_thai, so_luong_ton')
        .eq('ma_sach', bookId)
        .single();
      if (!current) throw new Error('Không tìm thấy đầu sách.');
      const nextStatus =
        current.trang_thai === 'NGUNG_BAN'
          ? current.so_luong_ton > 0
            ? 'CON_HANG'
            : 'HET_HANG'
          : 'NGUNG_BAN';
      const { error } = await supabase
        .from('sach')
        .update({ trang_thai: nextStatus, updated_at: new Date().toISOString() })
        .eq('ma_sach', bookId);
      if (error) throw new Error(`Không thể đổi trạng thái sách: ${error.message}`);
      const items = await this.getInventoryItems();
      const updated = items.find((i) => i.bookId === bookId);
      if (!updated) throw new Error('Không tìm thấy đầu sách.');
      return updated;
    }

    const book = bookstoreStore.books.find((b) => b.id === bookId);
    if (!book) throw new Error('Không tìm thấy đầu sách.');
    book.businessStatus = book.businessStatus === 'SELLING' ? 'DISCONTINUED' : 'SELLING';
    return toInventoryDTO(book);
  }

  async updateBookPrice(bookId: string, newPrice: number): Promise<InventoryItemDTO> {
    if (newPrice < 0) throw new Error('Giá bán không thể là số âm.');

    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('sach')
        .update({ gia_ban: newPrice, updated_at: new Date().toISOString() })
        .eq('ma_sach', bookId);
      if (error) throw new Error(`Không thể cập nhật giá bán: ${error.message}`);
      const items = await this.getInventoryItems();
      const updated = items.find((i) => i.bookId === bookId);
      if (!updated) throw new Error('Không tìm thấy đầu sách.');
      return updated;
    }

    const book = bookstoreStore.books.find((b) => b.id === bookId);
    if (!book) throw new Error('Không tìm thấy đầu sách.');
    book.price = newPrice;
    return toInventoryDTO(book);
  }

  async getAudits(): Promise<StockAuditDTO[]> {
    if (!isSupabaseConfigured()) {
      return [...bookstoreStore.stockAudits];
    }

    try {
      const [pkkRes, ctRes, sachRes, nvRes] = await Promise.all([
        supabase.from('phieu_kiem_ke').select('*').order('ngay_kiem_ke', { ascending: false }),
        supabase.from('chi_tiet_kiem_ke').select('*'),
        supabase.from('sach').select('ma_sach, ten_sach, gia_nhap'),
        supabase.from('nhan_vien').select('ma_nv, ho_ten'),
      ]);

      if (pkkRes.error || !pkkRes.data) {
        return [...bookstoreStore.stockAudits];
      }

      const sachMap = new Map((sachRes.data ?? []).map((s) => [s.ma_sach, s]));
      const nvMap = new Map((nvRes.data ?? []).map((n) => [n.ma_nv, n.ho_ten]));

      return pkkRes.data.map((row) => {
        let lossValue = 0;
        const items: StockAuditItemDTO[] = (ctRes.data ?? [])
          .filter((ct) => ct.ma_kiem_ke === row.ma_kiem_ke)
          .map((ct) => {
            const s = sachMap.get(ct.ma_sach);
            const diff = ct.chenh_lech;
            if (diff < 0 && s) lossValue += Math.abs(diff) * Number(s.gia_nhap);
            return {
              bookId: ct.ma_sach,
              bookTitle: s?.ten_sach ?? ct.ma_sach,
              systemQuantity: ct.so_luong_he_thong,
              actualQuantity: ct.so_luong_thuc_te,
              discrepancyQuantity: diff,
              reason: ct.ly_do ?? 'Điều chỉnh kiểm kê',
            };
          });
        const totalDiscrepancy = items.reduce((sum, i) => sum + i.discrepancyQuantity, 0);
        const isWriteOff = row.ma_kiem_ke.startsWith('XH-');
        return {
          id: row.ma_kiem_ke,
          auditCode: row.ma_kiem_ke,
          adjustmentType: isWriteOff ? 'DAMAGED_WRITE_OFF' : 'AUDIT',
          staffName: nvMap.get(row.ma_nv) ?? row.ma_nv,
          auditDate: row.ngay_kiem_ke,
          status: items.some((i) => i.discrepancyQuantity !== 0) ? 'ADJUSTED' : 'BALANCED',
          totalDiscrepancy,
          lossValue,
          note: row.ghi_chu ?? undefined,
          items,
        };
      });
    } catch {
      return [...bookstoreStore.stockAudits];
    }
  }

  async createAudit(dto: CreateStockAuditDTO): Promise<StockAuditDTO> {
    if (!dto.items.length) throw new Error('Phiếu kiểm kê phải có ít nhất 1 đầu sách.');

    if (isSupabaseConfigured()) {
      const currentItems = await this.getInventoryItems();
      const itemMap = new Map(currentItems.map((i) => [i.bookId, i]));
      const maKiemKe = `KK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`;

      const { error: pkkErr } = await supabase.from('phieu_kiem_ke').insert({
        ma_kiem_ke: maKiemKe,
        ghi_chu: dto.note?.trim() || null,
        ma_nv: 'NV004',
      });
      if (pkkErr) throw new Error(`Không thể lập phiếu kiểm kê: ${pkkErr.message}`);

      const ctRows = dto.items.map((item) => {
        const book = itemMap.get(item.bookId);
        if (!book) throw new Error(`Không tìm thấy sách ${item.bookId}.`);
        if (item.actualQuantity < 0) throw new Error('Số lượng kiểm kê thực tế không thể âm.');
        return {
          ma_kiem_ke: maKiemKe,
          ma_sach: book.bookId,
          so_luong_he_thong: book.stockQuantity,
          so_luong_thuc_te: item.actualQuantity,
          ly_do: item.reason?.trim() || 'Điều chỉnh sau kiểm kê',
        };
      });

      const { error: ctErr } = await supabase.from('chi_tiet_kiem_ke').insert(ctRows);
      if (ctErr) throw new Error(`Không thể lưu chi tiết kiểm kê: ${ctErr.message}`);

      const audits = await this.getAudits();
      const created = audits.find((a) => a.id === maKiemKe);
      if (created) return created;
    }

    let lossValue = 0;
    const auditItems: StockAuditItemDTO[] = dto.items.map((item) => {
      const book = bookstoreStore.books.find((b) => b.id === item.bookId);
      if (!book) throw new Error(`Không tìm thấy sách ${item.bookId}.`);
      if (item.actualQuantity < 0) throw new Error('Số lượng kiểm kê thực tế không thể âm.');
      const systemQuantity = book.stockQuantity;
      const discrepancyQuantity = item.actualQuantity - systemQuantity;
      if (discrepancyQuantity < 0) {
        lossValue += Math.abs(discrepancyQuantity) * book.costPrice;
      }
      book.stockQuantity = item.actualQuantity;
      return {
        bookId: book.id,
        bookTitle: book.title,
        systemQuantity,
        actualQuantity: item.actualQuantity,
        discrepancyQuantity,
        reason: item.reason?.trim() || (discrepancyQuantity === 0 ? 'Khớp tồn kho' : 'Điều chỉnh sau kiểm kê'),
      };
    });

    const totalDiscrepancy = auditItems.reduce((sum, i) => sum + i.discrepancyQuantity, 0);
    const hasDiff = auditItems.some((i) => i.discrepancyQuantity !== 0);

    const audit: StockAuditDTO = {
      id: `kk-${Date.now()}`,
      auditCode: `KK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(bookstoreStore.stockAudits.length + 1).padStart(2, '0')}`,
      adjustmentType: 'AUDIT',
      staffName: dto.staffName,
      auditDate: new Date().toISOString(),
      status: hasDiff ? 'ADJUSTED' : 'BALANCED',
      totalDiscrepancy,
      lossValue,
      note: dto.note,
      items: auditItems,
    };

    bookstoreStore.stockAudits.unshift(audit);
    return audit;
  }

  async writeOffDamaged(dto: CreateDamagedWriteOffDTO): Promise<StockAuditDTO> {
    if (dto.damagedQuantity <= 0) throw new Error('Số lượng sách hư hỏng phải lớn hơn 0.');
    if (!dto.reason.trim()) throw new Error('Vui lòng ghi rõ nguyên nhân hư hỏng / xuất hủy.');

    if (isSupabaseConfigured()) {
      const items = await this.getInventoryItems();
      const book = items.find((b) => b.bookId === dto.bookId);
      if (!book) throw new Error('Không tìm thấy đầu sách cần xuất hủy.');
      if (dto.damagedQuantity > book.stockQuantity) {
        throw new Error(`Số lượng xuất hủy (${dto.damagedQuantity}) vượt quá tồn kho hiện tại (${book.stockQuantity}).`);
      }

      const maKiemKe = `XH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`;
      const { error: pkkErr } = await supabase.from('phieu_kiem_ke').insert({
        ma_kiem_ke: maKiemKe,
        ghi_chu: `Xuất hủy sách hư hỏng: ${dto.reason.trim()}`,
        ma_nv: 'NV004',
      });
      if (pkkErr) throw new Error(`Không thể lập phiếu xuất hủy: ${pkkErr.message}`);

      const { error: ctErr } = await supabase.from('chi_tiet_kiem_ke').insert({
        ma_kiem_ke: maKiemKe,
        ma_sach: book.bookId,
        so_luong_he_thong: book.stockQuantity,
        so_luong_thuc_te: book.stockQuantity - dto.damagedQuantity,
        ly_do: dto.reason.trim(),
      });
      if (ctErr) throw new Error(`Không thể lưu chi tiết xuất hủy: ${ctErr.message}`);

      const audits = await this.getAudits();
      const created = audits.find((a) => a.id === maKiemKe);
      if (created) return created;
    }

    const book = bookstoreStore.books.find((b) => b.id === dto.bookId);
    if (!book) throw new Error('Không tìm thấy đầu sách cần xuất hủy.');
    if (dto.damagedQuantity > book.stockQuantity) {
      throw new Error(`Số lượng xuất hủy (${dto.damagedQuantity}) vượt quá tồn kho hiện tại (${book.stockQuantity}).`);
    }

    const systemQuantity = book.stockQuantity;
    const actualQuantity = systemQuantity - dto.damagedQuantity;
    const lossValue = dto.damagedQuantity * book.costPrice;
    book.stockQuantity = actualQuantity;

    const record: StockAuditDTO = {
      id: `xh-${Date.now()}`,
      auditCode: `XH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(bookstoreStore.stockAudits.length + 1).padStart(2, '0')}`,
      adjustmentType: 'DAMAGED_WRITE_OFF',
      staffName: dto.staffName,
      auditDate: new Date().toISOString(),
      status: 'ADJUSTED',
      totalDiscrepancy: -dto.damagedQuantity,
      lossValue,
      note: `Xuất hủy sách hư hỏng: ${dto.reason.trim()}`,
      items: [
        {
          bookId: book.id,
          bookTitle: book.title,
          systemQuantity,
          actualQuantity,
          discrepancyQuantity: -dto.damagedQuantity,
          reason: dto.reason.trim(),
        },
      ],
    };

    bookstoreStore.stockAudits.unshift(record);
    return record;
  }
}
