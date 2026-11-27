import { HoaDon } from '@/models/HoaDon';
import { ChiTietHoaDon } from '@/models/ChiTietHoaDon';
import { ThanhToan } from '@/models/ThanhToan';
import { NhanVien } from '@/models/NhanVien';
import { KhachHang } from '@/models/KhachHang';
import { MaGiamGia } from '@/models/MaGiamGia';
import type { IOrderRepository } from '@/repositories/IOrderRepository';
import { OrderRepository } from '@/repositories/OrderRepository';
import type { IBookRepository } from '@/repositories/IBookRepository';
import { BookRepository } from '@/repositories/BookRepository';
import type { PaymentMethod } from '@/types/dtos';

export interface CheckoutInput {
  items: Array<{ maSach: string; soLuongBan: number }>;
  paymentMethod: PaymentMethod;
  paidAmount: number;
  nhanVien: NhanVien;
  khachHang?: KhachHang | null;
  maGiamGia?: MaGiamGia | null;
  directDiscountAmount?: number;
}

export interface CheckoutResult {
  hoaDon: HoaDon;
  thanhToan: ThanhToan;
  tienThoi: number;
}

/**
 * Lớp OrderService (Tầng Dịch vụ Nghiệp vụ Bán hàng - Phân hệ QLBH)
 * Thực thi luồng: Kiểm tra tồn kho -> Áp dụng CTKM / MaGiamGia -> Lập HoaDon -> Ghi nhận ThanhToan -> Trừ tồn & Tích điểm.
 */
export class OrderService {
  private readonly orderRepository: IOrderRepository;
  private readonly bookRepository: IBookRepository;

  constructor(
    orderRepo: IOrderRepository = new OrderRepository(),
    bookRepo: IBookRepository = new BookRepository()
  ) {
    this.orderRepository = orderRepo;
    this.bookRepository = bookRepo;
  }

  async checkout(input: CheckoutInput): Promise<CheckoutResult> {
    if (!input.items.length) {
      throw new Error('Hóa đơn phải có ít nhất 1 đầu sách.');
    }

    const chiTiets: ChiTietHoaDon[] = [];
    for (const reqItem of input.items) {
      if (reqItem.soLuongBan <= 0) {
        throw new Error('Số lượng bán phải lớn hơn 0.');
      }
      const sach = await this.bookRepository.findById(reqItem.maSach);
      if (!sach) {
        throw new Error(`Không tìm thấy đầu sách mã "${reqItem.maSach}".`);
      }
      if (sach.trangThai === 'NGUNG_BAN') {
        throw new Error(`Sách "${sach.tenSach}" đã ngưng kinh doanh.`);
      }
      if (sach.soLuongTon < reqItem.soLuongBan) {
        throw new Error(
          `Sách "${sach.tenSach}" không đủ tồn kho (hiện có: ${sach.soLuongTon}, cần mua: ${reqItem.soLuongBan}).`
        );
      }

      const giaSauKM = sach.tinhGiaBanSauKhuyenMai();
      const giamGiaDong = Math.max(0, (sach.giaBan - giaSauKM) * reqItem.soLuongBan);
      chiTiets.push(
        new ChiTietHoaDon({
          sach,
          soLuongBan: reqItem.soLuongBan,
          donGiaBan: sach.giaBan,
          giamGia: giamGiaDong,
        })
      );
    }

    const maHoaDon = `HD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`;
    const hoaDon = new HoaDon({
      maHoaDon,
      nhanVien: input.nhanVien,
      khachHang: input.khachHang ?? null,
      danhSachChiTiet: chiTiets,
    });

    if (input.maGiamGia) {
      hoaDon.applyDiscount(input.maGiamGia);
    } else if (input.directDiscountAmount && input.directDiscountAmount > 0) {
      hoaDon.applyDiscount(Math.min(input.directDiscountAmount, hoaDon.tongTienHang));
    }

    const tongCanTra = hoaDon.tinhTongThanhToan();
    if (input.paidAmount < tongCanTra) {
      throw new Error(
        `Số tiền khách đưa (${input.paidAmount.toLocaleString('vi-VN')} đ) ít hơn tổng thanh toán (${tongCanTra.toLocaleString('vi-VN')} đ).`
      );
    }

    // Thực thi quy tắc Domain: trừ tồn trên entity + cộng điểm tích lũy + đổi trạng thái DA_THANH_TOAN
    hoaDon.lapHoaDon();

    const maThanhToan = `TT-${Date.now().toString().slice(-6)}`;
    const thanhToan = new ThanhToan({
      maThanhToan,
      soTien: tongCanTra,
      phuongThuc: input.paymentMethod,
      trangThai: 'THANH_CONG',
    });

    // Lưu vào CSDL (Trigger DB sẽ tự trừ tồn kho khi insert chi_tiet_hoa_don trên Supabase)
    await this.orderRepository.saveHoaDon(hoaDon, thanhToan);

    return {
      hoaDon,
      thanhToan,
      tienThoi: input.paidAmount - tongCanTra,
    };
  }

  async getRecentOrders(limit: number = 20, searchTerm?: string): Promise<HoaDon[]> {
    return this.orderRepository.listRecent(limit, searchTerm);
  }

  async getOrderById(maHoaDon: string): Promise<HoaDon | null> {
    return this.orderRepository.findById(maHoaDon);
  }
}
