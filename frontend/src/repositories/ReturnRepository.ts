import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { bookstoreStore } from '@/lib/mock/bookstoreStore';
import type { CreateReturnDTO, ReturnExchangeDTO, ReturnItemDTO } from '@/types/dtos';

export interface IReturnRepository {
  findAll(): Promise<ReturnExchangeDTO[]>;
  create(dto: CreateReturnDTO): Promise<ReturnExchangeDTO>;
}

/**
 * Triển khai ReturnRepository kết nối bảng `phieu_doi_tra` & `chi_tiet_doi_tra` trên Supabase
 * (có fallback sang `bookstoreStore.returns`).
 */
export class ReturnRepository implements IReturnRepository {
  async findAll(): Promise<ReturnExchangeDTO[]> {
    if (!isSupabaseConfigured()) {
      return [...bookstoreStore.returns];
    }

    try {
      const [pdtRes, ctRes, sachRes, nvRes] = await Promise.all([
        supabase.from('phieu_doi_tra').select('*').order('ngay_doi_tra', { ascending: false }),
        supabase.from('chi_tiet_doi_tra').select('*'),
        supabase.from('sach').select('ma_sach, ten_sach'),
        supabase.from('nhan_vien').select('ma_nv, ho_ten'),
      ]);

      if (pdtRes.error || !pdtRes.data) {
        return [...bookstoreStore.returns];
      }

      const sachMap = new Map((sachRes.data ?? []).map((s) => [s.ma_sach, s.ten_sach]));
      const nvMap = new Map((nvRes.data ?? []).map((n) => [n.ma_nv, n.ho_ten]));

      return pdtRes.data.map((row) => {
        const items: ReturnItemDTO[] = (ctRes.data ?? [])
          .filter((ct) => ct.ma_doi_tra === row.ma_doi_tra)
          .map((ct) => ({
            bookId: ct.ma_sach,
            bookTitle: sachMap.get(ct.ma_sach) ?? ct.ma_sach,
            quantity: ct.so_luong_tra,
            unitPrice: Number(ct.don_gia_hoan),
            refundSubtotal: ct.so_luong_tra * Number(ct.don_gia_hoan),
          }));

        return {
          id: row.ma_doi_tra,
          returnCode: row.ma_doi_tra,
          orderCode: row.ma_hoa_don,
          type: row.hinh_thuc_xu_ly === 'DOI_SACH' ? 'EXCHANGE' : 'RETURN',
          staffName: nvMap.get(row.ma_nv) ?? row.ma_nv,
          reason: row.ly_do,
          createdAt: row.ngay_doi_tra,
          items,
          refundAmount: Number(row.tien_hoan_tra),
          status: 'COMPLETED',
        };
      });
    } catch {
      return [...bookstoreStore.returns];
    }
  }

  async create(dto: CreateReturnDTO): Promise<ReturnExchangeDTO> {
    if (!dto.orderCode.trim()) throw new Error('Vui lòng nhập mã hóa đơn cần đổi/trả.');
    if (!dto.reason.trim()) throw new Error('Vui lòng nhập lý do đổi/trả hàng.');
    if (!dto.items.length) throw new Error('Phải chọn ít nhất 1 cuốn sách để đổi/trả.');

    if (dto.orderDate) {
      const diffDays = (Date.now() - new Date(dto.orderDate).getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays > 7) {
        throw new Error('Hóa đơn đã quá thời hạn đổi/trả 7 ngày theo quy định.');
      }
    }

    const items: ReturnItemDTO[] = dto.items.map((i) => {
      if (i.quantity <= 0) throw new Error('Số lượng trả phải lớn hơn 0.');
      if (i.quantity > i.maxPurchasedQuantity) {
        throw new Error(`Số lượng trả (${i.quantity}) vượt quá số lượng đã mua (${i.maxPurchasedQuantity}).`);
      }
      return {
        bookId: i.bookId,
        bookTitle: i.bookTitle,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        refundSubtotal: i.quantity * i.unitPrice,
      };
    });

    const returnedValue = items.reduce((sum, i) => sum + i.refundSubtotal, 0);
    const maDoiTra = `DT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`;

    if (isSupabaseConfigured()) {
      const { error: pErr } = await supabase.from('phieu_doi_tra').insert({
        ma_doi_tra: maDoiTra,
        ly_do: dto.reason.trim(),
        hinh_thuc_xu_ly: dto.type === 'EXCHANGE' ? 'DOI_SACH' : 'HOAN_TIEN',
        tien_hoan_tra: Math.max(0, returnedValue),
        ma_hoa_don: dto.orderCode.trim(),
        ma_nv: 'NV003',
      });
      if (pErr) throw new Error(`Không thể lập phiếu đổi/trả trong CSDL: ${pErr.message}`);

      const { error: ctErr } = await supabase.from('chi_tiet_doi_tra').insert(
        items.map((item) => ({
          ma_doi_tra: maDoiTra,
          ma_sach: item.bookId,
          so_luong_tra: item.quantity,
          tinh_trang_sach: 'NGUYEN_VEN',
          don_gia_hoan: item.unitPrice,
        }))
      );
      if (ctErr) throw new Error(`Không thể lưu chi tiết đổi/trả: ${ctErr.message}`);

      return {
        id: maDoiTra,
        returnCode: maDoiTra,
        orderCode: dto.orderCode.trim(),
        type: dto.type,
        staffName: dto.staffName,
        reason: dto.reason.trim(),
        createdAt: new Date().toISOString(),
        items,
        refundAmount: returnedValue,
        status: 'COMPLETED',
      };
    }

    // Fallback in-memory mock store
    for (const item of items) {
      const book = bookstoreStore.books.find((b) => b.id === item.bookId);
      if (book) book.stockQuantity += item.quantity;
    }

    let exchangeBookTitle: string | undefined;
    let exchangeBookPrice: number | undefined;
    let refundAmount = returnedValue;

    if (dto.type === 'EXCHANGE' && dto.exchangeBookId) {
      const newBook = bookstoreStore.books.find((b) => b.id === dto.exchangeBookId);
      if (!newBook) throw new Error('Không tìm thấy sách mới cần đổi.');
      if (newBook.stockQuantity <= 0) throw new Error(`Sách "${newBook.title}" hiện đã hết hàng.`);
      newBook.stockQuantity -= 1;
      exchangeBookTitle = newBook.title;
      exchangeBookPrice = newBook.price;
      refundAmount = returnedValue - newBook.price;
    }

    const record: ReturnExchangeDTO = {
      id: maDoiTra,
      returnCode: maDoiTra,
      orderCode: dto.orderCode.trim(),
      type: dto.type,
      staffName: dto.staffName,
      reason: dto.reason.trim(),
      createdAt: new Date().toISOString(),
      items,
      exchangeBookTitle,
      exchangeBookPrice,
      refundAmount,
      status: 'COMPLETED',
    };

    bookstoreStore.returns.unshift(record);
    return record;
  }
}
