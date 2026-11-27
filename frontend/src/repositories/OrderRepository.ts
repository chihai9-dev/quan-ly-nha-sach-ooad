import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { bookstoreStore } from '@/lib/mock/bookstoreStore';
import { HoaDon } from '@/models/HoaDon';
import { ChiTietHoaDon } from '@/models/ChiTietHoaDon';
import { ThanhToan } from '@/models/ThanhToan';
import { Sach } from '@/models/Sach';
import { NhanVien } from '@/models/NhanVien';
import { KhachHang } from '@/models/KhachHang';
import { MaGiamGia } from '@/models/MaGiamGia';
import type { IOrderRepository } from './IOrderRepository';

const mockHoaDonStore: HoaDon[] = [];

/**
 * Triển khai OrderRepository kết nối trực tiếp 3 bảng `hoa_don`, `chi_tiet_hoa_don`, `thanh_toan`
 * theo Relational Data Model (có fallback in-memory khi chưa cấu hình Supabase).
 */
export class OrderRepository implements IOrderRepository {
  async saveHoaDon(hoaDon: HoaDon, thanhToan: ThanhToan): Promise<HoaDon> {
    hoaDon.themThanhToan(thanhToan);

    if (isSupabaseConfigured()) {
      const { error: hdErr } = await supabase.from('hoa_don').insert({
        ma_hoa_don: hoaDon.maHoaDon,
        ngay_lap: hoaDon.ngayLap.toISOString(),
        tong_tien_hang: hoaDon.tongTienHang,
        tien_giam_gia: hoaDon.tienGiamGia,
        trang_thai: hoaDon.trangThai,
        ma_kh: hoaDon.khachHang?.maKH ?? null,
        ma_nv: hoaDon.nhanVien?.maNV ?? 'NV003',
        ma_code: hoaDon.maGiamGia?.maCode ?? null,
      });

      if (hdErr) {
        throw new Error(`Không thể lưu hóa đơn vào CSDL: ${hdErr.message}`);
      }

      if (hoaDon.danhSachChiTiet.length > 0) {
        const { error: ctErr } = await supabase.from('chi_tiet_hoa_don').insert(
          hoaDon.danhSachChiTiet.map((ct) => ({
            ma_hoa_don: hoaDon.maHoaDon,
            ma_sach: ct.sach.maSach,
            so_luong_ban: ct.soLuongBan,
            don_gia_ban: ct.donGiaBan,
            giam_gia: ct.giamGia,
          }))
        );
        if (ctErr) {
          throw new Error(`Không thể lưu chi tiết hóa đơn: ${ctErr.message}`);
        }
      }

      const { error: ttErr } = await supabase.from('thanh_toan').insert({
        ma_thanh_toan: thanhToan.maThanhToan,
        ngay_thanh_toan: thanhToan.ngayThanhToan.toISOString(),
        so_tien: thanhToan.soTien,
        phuong_thuc: thanhToan.phuongThuc,
        trang_thai: thanhToan.trangThai,
        ma_hoa_don: hoaDon.maHoaDon,
      });
      if (ttErr) {
        throw new Error(`Không thể ghi nhận thanh toán: ${ttErr.message}`);
      }

      // Trừ lượt sử dụng mã giảm giá nếu có
      if (hoaDon.maGiamGia) {
        await supabase
          .from('ma_giam_gia')
          .update({
            so_luong_con_lai: hoaDon.maGiamGia.soLuongConLai,
            updated_at: new Date().toISOString(),
          })
          .eq('ma_code', hoaDon.maGiamGia.maCode);
      }

      // Cộng điểm tích lũy khách hàng nếu có
      if (hoaDon.khachHang) {
        await supabase
          .from('khach_hang')
          .update({
            diem_tich_luy: hoaDon.khachHang.diemTichLuy,
            updated_at: new Date().toISOString(),
          })
          .eq('ma_kh', hoaDon.khachHang.maKH);
      }

      return hoaDon;
    }

    // Fallback in-memory mock store
    mockHoaDonStore.unshift(hoaDon);
    // Cập nhật số lượng bán & tồn kho trên bookstoreStore
    for (const ct of hoaDon.danhSachChiTiet) {
      const mockBook = bookstoreStore.books.find((b) => b.id === ct.sach.maSach);
      if (mockBook) {
        mockBook.stockQuantity = Math.max(0, mockBook.stockQuantity - ct.soLuongBan);
        mockBook.soldQuantity += ct.soLuongBan;
      }
    }
    if (hoaDon.khachHang) {
      const mockKh = bookstoreStore.customers.find((c) => c.id === hoaDon.khachHang?.maKH);
      if (mockKh) {
        mockKh.loyaltyPoints = hoaDon.khachHang.diemTichLuy;
        mockKh.tier = hoaDon.khachHang.xacDinhHangThanhVien();
        mockKh.totalSpent += hoaDon.thanhToanCuoi;
        mockKh.orderCount += 1;
      }
    }
    return hoaDon;
  }

  async findById(maHoaDon: string): Promise<HoaDon | null> {
    const list = await this.listRecent(100);
    return list.find((hd) => hd.maHoaDon === maHoaDon) ?? null;
  }

  async listRecent(limit: number = 20, searchTerm?: string): Promise<HoaDon[]> {
    let list: HoaDon[];

    if (!isSupabaseConfigured()) {
      list = [...mockHoaDonStore];
    } else {
      try {
        const [hdRes, ctRes, ttRes, sachRes, nvRes, khRes, mggRes] = await Promise.all([
          supabase
            .from('hoa_don')
            .select('*')
            .order('ngay_lap', { ascending: false })
            .limit(limit),
          supabase.from('chi_tiet_hoa_don').select('*'),
          supabase.from('thanh_toan').select('*'),
          supabase.from('sach').select('*'),
          supabase.from('nhan_vien').select('*'),
          supabase.from('khach_hang').select('*'),
          supabase.from('ma_giam_gia').select('*'),
        ]);

        if (hdRes.error || !hdRes.data) {
          list = [...mockHoaDonStore];
        } else {
          const sachMap = new Map(
            (sachRes.data ?? []).map((r) => [
              r.ma_sach,
              new Sach({
                maSach: r.ma_sach,
                tenSach: r.ten_sach,
                namXuatBan: r.nam_xuat_ban ?? 2024,
                giaNhap: Number(r.gia_nhap),
                giaBan: Number(r.gia_ban),
                soLuongTon: r.so_luong_ton,
                mucTonToiThieu: r.muc_ton_toi_thieu,
                trangThai: r.trang_thai,
              }),
            ])
          );
          const nvMap = new Map(
            (nvRes.data ?? []).map((r) => [
              r.ma_nv,
              new NhanVien({
                maNV: r.ma_nv,
                hoTen: r.ho_ten,
                soDienThoai: r.so_dien_thoai ?? '',
                email: r.email ?? '',
                diaChi: r.dia_chi ?? '',
                ngayVaoLam: r.ngay_vao_lam,
              }),
            ])
          );
          const khMap = new Map(
            (khRes.data ?? []).map((r) => [
              r.ma_kh,
              new KhachHang({
                maKH: r.ma_kh,
                hoTen: r.ho_ten,
                soDienThoai: r.so_dien_thoai ?? '',
                email: r.email ?? '',
                diemTichLuy: r.diem_tich_luy,
              }),
            ])
          );
          const mggMap = new Map(
            (mggRes.data ?? []).map((r) => [
              r.ma_code,
              new MaGiamGia({
                maCode: r.ma_code,
                giaTriGiam: Number(r.gia_tri_giam),
                donToiThieu: Number(r.don_toi_thieu),
                soLuongConLai: r.so_luong_con_lai,
                hanSuDung: r.han_su_dung,
              }),
            ])
          );

          list = hdRes.data.map((row) => {
            const chiTiets = (ctRes.data ?? [])
              .filter((ct) => ct.ma_hoa_don === row.ma_hoa_don)
              .map((ct) => {
                const sach =
                  sachMap.get(ct.ma_sach) ??
                  new Sach({
                    maSach: ct.ma_sach,
                    tenSach: ct.ma_sach,
                    namXuatBan: 2024,
                    giaNhap: 0,
                    giaBan: Number(ct.don_gia_ban),
                    soLuongTon: 0,
                  });
                return new ChiTietHoaDon({
                  sach,
                  soLuongBan: ct.so_luong_ban,
                  donGiaBan: Number(ct.don_gia_ban),
                  giamGia: Number(ct.giam_gia),
                });
              });

            const thanhToans = (ttRes.data ?? [])
              .filter((tt) => tt.ma_hoa_don === row.ma_hoa_don)
              .map(
                (tt) =>
                  new ThanhToan({
                    maThanhToan: tt.ma_thanh_toan,
                    ngayThanhToan: tt.ngay_thanh_toan,
                    soTien: Number(tt.so_tien),
                    phuongThuc: tt.phuong_thuc,
                    trangThai: tt.trang_thai,
                  })
              );

            return new HoaDon({
              maHoaDon: row.ma_hoa_don,
              ngayLap: row.ngay_lap,
              tongTienHang: Number(row.tong_tien_hang),
              tienGiamGia: Number(row.tien_giam_gia),
              thanhToanCuoi: Number(row.thanh_toan_cuoi),
              trangThai: row.trang_thai,
              khachHang: row.ma_kh ? khMap.get(row.ma_kh) ?? null : null,
              nhanVien: nvMap.get(row.ma_nv) ?? null,
              maGiamGia: row.ma_code ? mggMap.get(row.ma_code) ?? null : null,
              danhSachChiTiet: chiTiets,
              danhSachThanhToan: thanhToans,
              createdAt: row.created_at,
              updatedAt: row.updated_at,
            });
          });
        }
      } catch {
        list = [...mockHoaDonStore];
      }
    }

    if (searchTerm?.trim()) {
      const kw = searchTerm.trim().toLowerCase();
      list = list.filter(
        (hd) =>
          hd.maHoaDon.toLowerCase().includes(kw) ||
          (hd.khachHang?.hoTen.toLowerCase().includes(kw) ?? false) ||
          (hd.nhanVien?.hoTen.toLowerCase().includes(kw) ?? false) ||
          hd.trangThai.toLowerCase().includes(kw)
      );
    }

    return list.slice(0, limit);
  }
}
