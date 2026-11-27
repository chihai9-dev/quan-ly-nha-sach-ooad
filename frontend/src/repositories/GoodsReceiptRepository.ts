import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { bookstoreStore } from '@/lib/mock/bookstoreStore';
import type {
  CreateGoodsReceiptDTO,
  CreateSupplierPaymentDTO,
  GoodsReceiptDTO,
  GoodsReceiptItemDTO,
  PaymentMethod,
  SupplierPaymentDTO,
} from '@/types/dtos';

export interface IGoodsReceiptRepository {
  findAllReceipts(supplierId?: string): Promise<GoodsReceiptDTO[]>;
  createReceipt(dto: CreateGoodsReceiptDTO): Promise<GoodsReceiptDTO>;
  findAllPayments(supplierId?: string): Promise<SupplierPaymentDTO[]>;
  createPayment(dto: CreateSupplierPaymentDTO): Promise<SupplierPaymentDTO>;
}

/**
 * Triển khai GoodsReceiptRepository kết nối bảng `phieu_nhap`, `chi_tiet_phieu_nhap`, `phieu_thanh_toan_ncc`
 * trên Supabase (có fallback sang `bookstoreStore`).
 */
export class GoodsReceiptRepository implements IGoodsReceiptRepository {
  async findAllReceipts(supplierId?: string): Promise<GoodsReceiptDTO[]> {
    if (!isSupabaseConfigured()) {
      const list = [...bookstoreStore.goodsReceipts];
      return supplierId ? list.filter((r) => r.supplierId === supplierId) : list;
    }

    try {
      const [pnRes, ctRes, nccRes, sachRes, nvRes] = await Promise.all([
        supabase.from('phieu_nhap').select('*').order('ngay_nhap', { ascending: false }),
        supabase.from('chi_tiet_phieu_nhap').select('*'),
        supabase.from('nha_cung_cap').select('ma_ncc, ten_ncc'),
        supabase.from('sach').select('ma_sach, ten_sach'),
        supabase.from('nhan_vien').select('ma_nv, ho_ten'),
      ]);
      if (pnRes.error || !pnRes.data) {
        const list = [...bookstoreStore.goodsReceipts];
        return supplierId ? list.filter((r) => r.supplierId === supplierId) : list;
      }

      const nccMap = new Map((nccRes.data ?? []).map((n) => [n.ma_ncc, n.ten_ncc]));
      const sachMap = new Map((sachRes.data ?? []).map((s) => [s.ma_sach, s.ten_sach]));
      const nvMap = new Map((nvRes.data ?? []).map((n) => [n.ma_nv, n.ho_ten]));

      let list: GoodsReceiptDTO[] = pnRes.data.map((row) => {
        const items: GoodsReceiptItemDTO[] = (ctRes.data ?? [])
          .filter((ct) => ct.ma_phieu_nhap === row.ma_phieu_nhap)
          .map((ct) => ({
            bookId: ct.ma_sach,
            bookTitle: sachMap.get(ct.ma_sach) ?? ct.ma_sach,
            quantity: ct.so_luong_nhap,
            unitCost: Number(ct.don_gia_nhap),
            subtotal: Number(ct.thanh_tien),
          }));
        const total = Number(row.tong_tien);
        const paid = Number(row.da_thanh_toan);
        const debt = Number(row.con_no);
        return {
          id: row.ma_phieu_nhap,
          receiptCode: row.ma_phieu_nhap,
          supplierId: row.ma_ncc,
          supplierName: nccMap.get(row.ma_ncc) ?? row.ma_ncc,
          staffName: nvMap.get(row.ma_nv) ?? row.ma_nv,
          createdAt: row.ngay_nhap,
          items,
          discountAmount: 0,
          totalAmount: total,
          paidAmount: paid,
          remainingDebt: debt,
          paymentStatus: debt === 0 ? 'PAID' : paid > 0 ? 'PARTIAL' : 'UNPAID',
        };
      });

      if (supplierId) {
        list = list.filter((r) => r.supplierId === supplierId);
      }
      return list;
    } catch {
      const list = [...bookstoreStore.goodsReceipts];
      return supplierId ? list.filter((r) => r.supplierId === supplierId) : list;
    }
  }

  async createReceipt(dto: CreateGoodsReceiptDTO): Promise<GoodsReceiptDTO> {
    if (!dto.items.length) throw new Error('Phiếu nhập phải có ít nhất 1 đầu sách.');

    if (isSupabaseConfigured()) {
      const maPhieuNhap = `PN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`;
      const subtotal = dto.items.reduce((sum, i) => sum + i.quantity * i.unitCost, 0);
      const totalAmount = Math.max(0, subtotal - Math.max(0, dto.discountAmount ?? 0));
      const paidAmount = Math.min(totalAmount, Math.max(0, dto.paidAmount ?? 0));
      const trangThai =
        paidAmount >= totalAmount ? 'DA_THANH_TOAN' : paidAmount > 0 ? 'THANH_TOAN_MOT_PHAN' : 'CHUA_THANH_TOAN';

      const { error: pnErr } = await supabase.from('phieu_nhap').insert({
        ma_phieu_nhap: maPhieuNhap,
        tong_tien: totalAmount,
        da_thanh_toan: paidAmount,
        trang_thai: trangThai,
        ma_ncc: dto.supplierId,
        ma_nv: 'NV004',
      });
      if (pnErr) throw new Error(`Không thể lập phiếu nhập trong CSDL: ${pnErr.message}`);

      const { error: ctErr } = await supabase.from('chi_tiet_phieu_nhap').insert(
        dto.items.map((item) => ({
          ma_phieu_nhap: maPhieuNhap,
          ma_sach: item.bookId,
          so_luong_nhap: item.quantity,
          don_gia_nhap: item.unitCost,
        }))
      );
      if (ctErr) throw new Error(`Không thể lưu chi tiết phiếu nhập: ${ctErr.message}`);

      const all = await this.findAllReceipts();
      const created = all.find((r) => r.id === maPhieuNhap);
      if (created) return created;
    }

    const supplier = bookstoreStore.suppliers.find((s) => s.id === dto.supplierId);
    if (!supplier) throw new Error('Nhà cung cấp không tồn tại.');

    const items: GoodsReceiptItemDTO[] = dto.items.map((item) => {
      const book = bookstoreStore.books.find((b) => b.id === item.bookId);
      if (!book) throw new Error(`Không tìm thấy sách với mã ${item.bookId}.`);
      if (item.quantity <= 0) throw new Error('Số lượng nhập phải lớn hơn 0.');
      if (item.unitCost < 0) throw new Error('Đơn giá nhập không được âm.');
      book.stockQuantity += item.quantity;
      book.costPrice = item.unitCost;
      return {
        bookId: book.id,
        bookTitle: book.title,
        quantity: item.quantity,
        unitCost: item.unitCost,
        subtotal: item.quantity * item.unitCost,
      };
    });

    const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
    const discountAmount = Math.max(0, dto.discountAmount ?? 0);
    const totalAmount = Math.max(0, subtotal - discountAmount);
    const paidAmount = Math.min(totalAmount, Math.max(0, dto.paidAmount ?? 0));
    const remainingDebt = totalAmount - paidAmount;

    const receipt: GoodsReceiptDTO = {
      id: `pn-${Date.now()}`,
      receiptCode: `PN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(bookstoreStore.goodsReceipts.length + 1).padStart(2, '0')}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      staffName: dto.staffName,
      createdAt: new Date().toISOString(),
      items,
      discountAmount,
      totalAmount,
      paidAmount,
      remainingDebt,
      paymentStatus: remainingDebt === 0 ? 'PAID' : paidAmount > 0 ? 'PARTIAL' : 'UNPAID',
      note: dto.note,
    };

    bookstoreStore.goodsReceipts.unshift(receipt);
    supplier.totalImported += totalAmount;
    supplier.totalPaid += paidAmount;
    supplier.currentDebt += remainingDebt;

    return receipt;
  }

  async findAllPayments(supplierId?: string): Promise<SupplierPaymentDTO[]> {
    if (!isSupabaseConfigured()) {
      const list = [...bookstoreStore.supplierPayments];
      return supplierId ? list.filter((p) => p.supplierId === supplierId) : list;
    }

    try {
      const [ptRes, nccRes, nvRes] = await Promise.all([
        supabase.from('phieu_thanh_toan_ncc').select('*').order('ngay_thanh_toan', { ascending: false }),
        supabase.from('nha_cung_cap').select('ma_ncc, ten_ncc'),
        supabase.from('nhan_vien').select('ma_nv, ho_ten'),
      ]);
      if (ptRes.error || !ptRes.data) {
        const list = [...bookstoreStore.supplierPayments];
        return supplierId ? list.filter((p) => p.supplierId === supplierId) : list;
      }

      const nccMap = new Map((nccRes.data ?? []).map((n) => [n.ma_ncc, n.ten_ncc]));
      const nvMap = new Map((nvRes.data ?? []).map((n) => [n.ma_nv, n.ho_ten]));

      let list: SupplierPaymentDTO[] = ptRes.data.map((row) => ({
        id: row.ma_thanh_toan_ncc,
        paymentCode: row.ma_thanh_toan_ncc,
        supplierId: row.ma_ncc,
        supplierName: nccMap.get(row.ma_ncc) ?? row.ma_ncc,
        receiptId: row.ma_phieu_nhap ?? undefined,
        receiptCode: row.ma_phieu_nhap ?? undefined,
        amount: Number(row.so_tien_thanh_toan),
        paymentMethod: (row.phuong_thuc as PaymentMethod) || 'BANK_TRANSFER',
        staffName: nvMap.get(row.ma_nv) ?? row.ma_nv,
        paidAt: row.ngay_thanh_toan,
        note: row.ghi_chu ?? undefined,
      }));

      if (supplierId) list = list.filter((p) => p.supplierId === supplierId);
      return list;
    } catch {
      const list = [...bookstoreStore.supplierPayments];
      return supplierId ? list.filter((p) => p.supplierId === supplierId) : list;
    }
  }

  async createPayment(dto: CreateSupplierPaymentDTO): Promise<SupplierPaymentDTO> {
    if (dto.amount <= 0) throw new Error('Số tiền thanh toán phải lớn hơn 0.');

    if (isSupabaseConfigured()) {
      const maTT = `PC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`;
      const { error } = await supabase.from('phieu_thanh_toan_ncc').insert({
        ma_thanh_toan_ncc: maTT,
        so_tien_thanh_toan: dto.amount,
        phuong_thuc: dto.paymentMethod,
        ghi_chu: dto.note?.trim() || null,
        ma_ncc: dto.supplierId,
        ma_phieu_nhap: dto.receiptId || null,
        ma_nv: 'NV002',
      });
      if (error) throw new Error(`Không thể ghi nhận thanh toán NCC: ${error.message}`);
      const all = await this.findAllPayments();
      const created = all.find((p) => p.id === maTT);
      if (created) return created;
    }

    const supplier = bookstoreStore.suppliers.find((s) => s.id === dto.supplierId);
    if (!supplier) throw new Error('Không tìm thấy nhà cung cấp.');
    if (dto.amount > supplier.currentDebt) {
      throw new Error(`Số tiền thanh toán vượt quá công nợ hiện tại (${supplier.currentDebt.toLocaleString('vi-VN')} đ).`);
    }

    let receiptCode: string | undefined;
    if (dto.receiptId) {
      const receipt = bookstoreStore.goodsReceipts.find((r) => r.id === dto.receiptId);
      if (receipt) {
        if (dto.amount > receipt.remainingDebt) {
          throw new Error(`Số tiền vượt quá dư nợ còn lại của phiếu ${receipt.receiptCode}.`);
        }
        receipt.paidAmount += dto.amount;
        receipt.remainingDebt -= dto.amount;
        receipt.paymentStatus = receipt.remainingDebt === 0 ? 'PAID' : 'PARTIAL';
        receiptCode = receipt.receiptCode;
      }
    }

    supplier.totalPaid += dto.amount;
    supplier.currentDebt = Math.max(0, supplier.currentDebt - dto.amount);

    const payment: SupplierPaymentDTO = {
      id: `pt-${Date.now()}`,
      paymentCode: `PC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(bookstoreStore.supplierPayments.length + 1).padStart(2, '0')}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      receiptId: dto.receiptId,
      receiptCode,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      staffName: dto.staffName,
      paidAt: new Date().toISOString(),
      note: dto.note,
    };
    bookstoreStore.supplierPayments.unshift(payment);
    return payment;
  }
}
