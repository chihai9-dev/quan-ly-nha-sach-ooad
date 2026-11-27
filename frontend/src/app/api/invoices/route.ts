import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/services/OrderService';
import { PromotionService } from '@/services/PromotionService';
import { NhanVien } from '@/models/NhanVien';
import { KhachHang } from '@/models/KhachHang';
import { MaGiamGia } from '@/models/MaGiamGia';
import { requirePermission } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';
import type { PaymentMethod } from '@/types/dtos';

const orderService = new OrderService();
const promotionService = new PromotionService();

interface InvoiceItemRequest {
  maSach: string;
  soLuongBan: number;
}

interface CreateInvoiceRequest {
  items: InvoiceItemRequest[];
  paymentMethod: PaymentMethod;
  paidAmount: number;
  khachHang?: { maKH: string; hoTen: string; soDienThoai: string; diemTichLuy: number } | null;
  couponCode?: string;
  directDiscountAmount?: number;
}

export async function GET(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_BAN_HANG);
  if (!auth.ok) return auth.response;

  try {
    const q = request.nextUrl.searchParams.get('q') ?? undefined;
    const hoaDons = await orderService.getRecentOrders(50, q);
    return NextResponse.json({
      invoices: hoaDons.map((hd) => ({
        maHoaDon: hd.maHoaDon,
        ngayLap: hd.ngayLap.toISOString(),
        tongTienHang: hd.tongTienHang,
        tienGiamGia: hd.tienGiamGia,
        thanhToanCuoi: hd.thanhToanCuoi,
        trangThai: hd.trangThai,
        conTrongHanDoiTra: hd.conTrongHanDoiTra(7),
        nhanVienLap: hd.nhanVien?.hoTen ?? 'Thu ngân',
        khachHang: hd.khachHang ? { maKH: hd.khachHang.maKH, hoTen: hd.khachHang.hoTen } : null,
        maGiamGia: hd.maGiamGia?.maCode ?? null,
        phuongThuc: hd.danhSachThanhToan[0]?.phuongThuc ?? 'CASH',
        chiTiet: hd.danhSachChiTiet.map((ct) => ({
          maSach: ct.sach.maSach,
          tenSach: ct.sach.tenSach,
          soLuongBan: ct.soLuongBan,
          donGiaBan: ct.donGiaBan,
          giamGia: ct.giamGia,
          thanhTien: ct.tinhThanhTien(),
        })),
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi tải danh sách hóa đơn.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_BAN_HANG);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Partial<CreateInvoiceRequest>;
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: 'Hóa đơn phải có ít nhất 1 đầu sách.' }, { status: 400 });
    }

    const nhanVien = new NhanVien({
      maNV: auth.user.maNV,
      hoTen: auth.user.hoTen,
      soDienThoai: '',
      email: auth.user.email,
      diaChi: '',
    });

    const khachHang = body.khachHang
      ? new KhachHang({
          maKH: body.khachHang.maKH,
          hoTen: body.khachHang.hoTen,
          soDienThoai: body.khachHang.soDienThoai,
          diemTichLuy: body.khachHang.diemTichLuy,
        })
      : null;

    let maGiamGia: MaGiamGia | null = null;
    if (body.couponCode?.trim()) {
      const { coupons } = await promotionService.getAll();
      const matched = coupons.find((c) => c.code.toUpperCase() === body.couponCode?.trim().toUpperCase());
      if (!matched) {
        return NextResponse.json({ error: `Mã giảm giá "${body.couponCode}" không tồn tại.` }, { status: 400 });
      }
      maGiamGia = new MaGiamGia({
        maCode: matched.code,
        giaTriGiam: matched.discountAmount,
        donToiThieu: matched.minOrderAmount,
        soLuongConLai: Math.max(0, matched.maxUses - matched.usedCount),
        hanSuDung: matched.expiryDate,
      });
    }

    const result = await orderService.checkout({
      items: body.items,
      paymentMethod: body.paymentMethod ?? 'CASH',
      paidAmount: Number(body.paidAmount ?? 0),
      nhanVien,
      khachHang,
      maGiamGia,
      directDiscountAmount: body.directDiscountAmount,
    });

    return NextResponse.json(
      {
        maHoaDon: result.hoaDon.maHoaDon,
        maThanhToan: result.thanhToan.maThanhToan,
        tongTienHang: result.hoaDon.tongTienHang,
        tienGiamGia: result.hoaDon.tienGiamGia,
        thanhToanCuoi: result.hoaDon.thanhToanCuoi,
        tienThoi: result.tienThoi,
        phuongThuc: result.thanhToan.phuongThuc,
        nguoiLap: auth.user.hoTen,
        ngayLap: result.hoaDon.ngayLap.toISOString(),
        chiTiet: result.hoaDon.danhSachChiTiet.map((ct) => ({
          maSach: ct.sach.maSach,
          tenSach: ct.sach.tenSach,
          soLuongBan: ct.soLuongBan,
          donGiaBan: ct.donGiaBan,
          giamGia: ct.giamGia,
          thanhTien: ct.tinhThanhTien(),
        })),
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể lập hóa đơn.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
