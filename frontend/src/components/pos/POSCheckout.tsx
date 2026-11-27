'use client';

import React, { useState, useEffect } from 'react';
import { Sach } from '@/models/Sach';
import { TheLoai } from '@/models/TheLoai';
import { TacGia } from '@/models/TacGia';
import { NhaXuatBan } from '@/models/NhaXuatBan';
import { ChuongTrinhKhuyenMai } from '@/models/ChuongTrinhKhuyenMai';
import { ChiTietHoaDon } from '@/models/ChiTietHoaDon';
import { BookList } from '../books/BookList';
import { CartDrawer } from '../cart/CartDrawer';
import { InvoiceModal, type PrintableInvoiceData } from '../invoice/InvoiceModal';
import type { CustomerDTO, PaymentMethod } from '@/types/dtos';
import {
  CreditCard,
  Banknote,
  QrCode,
  Smartphone,
  Barcode,
  UserCheck,
  AlertTriangle,
  Tag,
  CheckCircle2,
} from 'lucide-react';

interface SerializedSach {
  maSach: string;
  tenSach: string;
  namXuatBan: number;
  giaNhap: number;
  giaBan: number;
  soLuongTon: number;
  mucTonToiThieu: number;
  trangThai: string;
  theLoai: { maTheLoai: string; tenTheLoai: string } | null;
  nhaXuatBan: { maNXB: string; tenNXB: string } | null;
  danhSachTacGia: Array<{ maTacGia: string; tenTacGia: string }>;
  chuongTrinhKhuyenMai: { maCTKM: string; tenCTKM: string; phanTramGiam: number } | null;
}

function hydrateSach(raw: SerializedSach): Sach {
  return new Sach({
    maSach: raw.maSach,
    tenSach: raw.tenSach,
    namXuatBan: raw.namXuatBan,
    giaNhap: raw.giaNhap,
    giaBan: raw.giaBan,
    soLuongTon: raw.soLuongTon,
    mucTonToiThieu: raw.mucTonToiThieu,
    trangThai: raw.trangThai,
    theLoai: raw.theLoai
      ? new TheLoai({ maTheLoai: raw.theLoai.maTheLoai, tenTheLoai: raw.theLoai.tenTheLoai })
      : null,
    nhaXuatBan: raw.nhaXuatBan
      ? new NhaXuatBan({ maNXB: raw.nhaXuatBan.maNXB, tenNXB: raw.nhaXuatBan.tenNXB })
      : null,
    danhSachTacGia: raw.danhSachTacGia.map(
      (tg) => new TacGia({ maTacGia: tg.maTacGia, tenTacGia: tg.tenTacGia })
    ),
    chuongTrinhKhuyenMai: raw.chuongTrinhKhuyenMai
      ? new ChuongTrinhKhuyenMai({
          maCTKM: raw.chuongTrinhKhuyenMai.maCTKM,
          tenCTKM: raw.chuongTrinhKhuyenMai.tenCTKM,
          ngayBatDau: new Date(Date.now() - 86400000),
          ngayKetThuc: new Date(Date.now() + 86400000),
          phanTramGiam: raw.chuongTrinhKhuyenMai.phanTramGiam,
          trangThai: true,
        })
      : null,
  });
}

export const POSCheckout: React.FC = () => {
  const [books, setBooks] = useState<Sach[]>([]);
  const [customers, setCustomers] = useState<CustomerDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<ChiTietHoaDon[]>([]);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [barcodeInput, setBarcodeInput] = useState('');

  // Mã giảm giá (MaGiamGia) theo SD Áp dụng khuyến mãi vào hóa đơn
  const [couponInput, setCouponInput] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  // Modal thanh toán
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [paidAmountInput, setPaidAmountInput] = useState('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Modal in hóa đơn
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [printableInvoice, setPrintableInvoice] = useState<PrintableInvoiceData | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [booksRes, custRes] = await Promise.all([
        fetch('/api/books', { cache: 'no-store' }),
        fetch('/api/customers', { cache: 'no-store' }),
      ]);
      if (booksRes.ok) {
        const bData = (await booksRes.json()) as { books?: SerializedSach[] };
        setBooks((bData.books ?? []).map(hydrateSach));
      }
      if (custRes.ok) {
        const cData = (await custRes.json()) as { customers?: CustomerDTO[] };
        setCustomers(cData.customers ?? []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) ?? null;
  const tongTienHang = cartItems.reduce((sum, ct) => sum + ct.tinhThanhTien(), 0);
  const memberDiscountRate =
    selectedCustomer?.tier === 'PLATINUM'
      ? 0.15
      : selectedCustomer?.tier === 'GOLD'
        ? 0.1
        : selectedCustomer?.tier === 'SILVER'
          ? 0.05
          : 0;
  const memberDiscount = appliedCouponCode ? 0 : Math.round(tongTienHang * memberDiscountRate);
  const totalDiscount = appliedCouponCode ? couponDiscount : memberDiscount;
  const thanhToanCuoi = Math.max(0, tongTienHang - totalDiscount);

  const handleAddToCart = (sach: Sach) => {
    setCartItems((prev) => {
      const existing = prev.find((ct) => ct.sach.maSach === sach.maSach);
      const nextQty = (existing?.soLuongBan ?? 0) + 1;
      if (nextQty > sach.soLuongTon) {
        alert(`Sách "${sach.tenSach}" chỉ còn ${sach.soLuongTon} cuốn trong kho.`);
        return prev;
      }
      const giaSauKM = sach.tinhGiaBanSauKhuyenMai();
      const giamDong = Math.max(0, (sach.giaBan - giaSauKM) * nextQty);
      const updatedItem = new ChiTietHoaDon({
        sach,
        soLuongBan: nextQty,
        donGiaBan: sach.giaBan,
        giamGia: giamDong,
      });
      if (existing) {
        return prev.map((ct) => (ct.sach.maSach === sach.maSach ? updatedItem : ct));
      }
      return [...prev, updatedItem];
    });
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = barcodeInput.trim().toLowerCase();
    if (!code) return;
    const found = books.find(
      (b) => b.maSach.toLowerCase() === code || b.tenSach.toLowerCase().includes(code)
    );
    if (!found) {
      alert(`Không tìm thấy sách với mã: ${barcodeInput}`);
      return;
    }
    handleAddToCart(found);
    setBarcodeInput('');
  };

  const handleUpdateQuantity = (maSach: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((ct) => ct.sach.maSach !== maSach));
      return;
    }
    const sach = books.find((b) => b.maSach === maSach);
    if (!sach) return;
    if (quantity > sach.soLuongTon) {
      alert(`Chỉ còn ${sach.soLuongTon} cuốn trong kho.`);
      return;
    }
    const giaSauKM = sach.tinhGiaBanSauKhuyenMai();
    const giamDong = Math.max(0, (sach.giaBan - giaSauKM) * quantity);
    setCartItems((prev) =>
      prev.map((ct) =>
        ct.sach.maSach === maSach
          ? new ChiTietHoaDon({ sach, soLuongBan: quantity, donGiaBan: sach.giaBan, giamGia: giamDong })
          : ct
      )
    );
  };

  const handleApplyCoupon = async () => {
    setCouponMessage(null);
    if (!couponInput.trim()) {
      setAppliedCouponCode(null);
      setCouponDiscount(0);
      return;
    }
    try {
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'validate-coupon',
          code: couponInput.trim(),
          orderTotal: tongTienHang,
        }),
      });
      const data = (await res.json()) as {
        valid?: boolean;
        discountAmount?: number;
        message?: string;
        error?: string;
      };
      if (!res.ok || !data.valid) {
        setAppliedCouponCode(null);
        setCouponDiscount(0);
        setCouponMessage(data.message ?? data.error ?? 'Mã giảm giá không hợp lệ.');
        return;
      }
      setAppliedCouponCode(couponInput.trim().toUpperCase());
      setCouponDiscount(data.discountAmount ?? 0);
      setCouponMessage(data.message ?? 'Đã áp dụng mã giảm giá.');
    } catch {
      setCouponMessage('Không thể kiểm tra mã giảm giá.');
    }
  };

  const handleProceedCheckout = () => {
    setPaidAmountInput(String(thanhToanCuoi));
    setCheckoutError(null);
    setIsCheckoutOpen(true);
  };

  const handleConfirmPayment = async () => {
    const paidAmount = Number(paidAmountInput);
    if (Number.isNaN(paidAmount) || paidAmount < thanhToanCuoi) {
      setCheckoutError('Số tiền khách đưa chưa đủ để thanh toán hóa đơn.');
      return;
    }

    setSubmitting(true);
    setCheckoutError(null);
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((ct) => ({ maSach: ct.sach.maSach, soLuongBan: ct.soLuongBan })),
          paymentMethod,
          paidAmount,
          khachHang: selectedCustomer
            ? {
                maKH: selectedCustomer.id,
                hoTen: selectedCustomer.fullName,
                soDienThoai: selectedCustomer.phoneNumber,
                diemTichLuy: selectedCustomer.loyaltyPoints,
              }
            : null,
          couponCode: appliedCouponCode ?? undefined,
          directDiscountAmount: appliedCouponCode ? undefined : memberDiscount,
        }),
      });
      const data = (await res.json()) as {
        maHoaDon?: string;
        maThanhToan?: string;
        ngayLap?: string;
        nguoiLap?: string;
        phuongThuc?: string;
        tongTienHang?: number;
        tienGiamGia?: number;
        thanhToanCuoi?: number;
        tienThoi?: number;
        chiTiet?: PrintableInvoiceData['chiTiet'];
        error?: string;
      };
      if (!res.ok || !data.maHoaDon) {
        setCheckoutError(data.error ?? 'Không thể lập hóa đơn.');
        return;
      }

      setPrintableInvoice({
        maHoaDon: data.maHoaDon,
        maThanhToan: data.maThanhToan ?? '',
        ngayLap: data.ngayLap ?? new Date().toISOString(),
        nguoiLap: data.nguoiLap ?? 'Thu ngân',
        khachHangTen: selectedCustomer?.fullName,
        phuongThuc: data.phuongThuc ?? paymentMethod,
        tongTienHang: data.tongTienHang ?? tongTienHang,
        tienGiamGia: data.tienGiamGia ?? totalDiscount,
        thanhToanCuoi: data.thanhToanCuoi ?? thanhToanCuoi,
        tienKhachDua: paidAmount,
        tienThoi: data.tienThoi ?? paidAmount - thanhToanCuoi,
        chiTiet: data.chiTiet ?? [],
      });

      setIsCheckoutOpen(false);
      setIsInvoiceOpen(true);
      setCartItems([]);
      setAppliedCouponCode(null);
      setCouponDiscount(0);
      setCouponInput('');
      setCouponMessage(null);
      await loadData();
    } catch {
      setCheckoutError('Lỗi kết nối máy chủ khi thanh toán.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 space-y-5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Barcode className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Quét mã sách hoặc nhập tên sách..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Thêm nhanh
              </button>
            </form>

            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="flex-1 text-xs border border-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Khách vãng lai (0% ưu đãi)</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} — {c.phoneNumber} ({c.tier})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
            <input
              type="text"
              placeholder="Nhập mã giảm giá (VD: GIAM50K)..."
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg w-56 uppercase"
            />
            <button
              type="button"
              onClick={() => void handleApplyCoupon()}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
            >
              Áp dụng mã
            </button>
            {couponMessage && (
              <span className="text-xs text-slate-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {couponMessage}
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
            Đang tải danh sách sách bán...
          </div>
        ) : (
          <BookList books={books} onAddToCart={handleAddToCart} showActions={true} />
        )}
      </div>

      <div className="lg:col-span-4">
        <CartDrawer
          items={cartItems}
          discountAmount={totalDiscount}
          appliedCouponCode={appliedCouponCode}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={(maSach) => setCartItems((prev) => prev.filter((ct) => ct.sach.maSach !== maSach))}
          onClearCart={() => {
            if (window.confirm('Xóa toàn bộ giỏ hàng hiện tại?')) setCartItems([]);
          }}
          onProceedCheckout={handleProceedCheckout}
        />
      </div>

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Ghi Nhận Thanh Toán</h3>
              <p className="text-xs text-slate-500 mt-1">
                Chọn phương thức thanh toán và xác nhận lập hóa đơn
              </p>
            </div>

            <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 flex justify-between items-center">
              <span className="text-sm font-medium text-indigo-900">Tổng cần thu:</span>
              <span className="text-2xl font-extrabold text-indigo-700">
                {formatCurrency(thanhToanCuoi)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'CASH' as PaymentMethod, label: 'Tiền mặt', icon: Banknote },
                { id: 'BANK_TRANSFER' as PaymentMethod, label: 'Chuyển khoản', icon: QrCode },
                { id: 'MOMO' as PaymentMethod, label: 'Ví MoMo', icon: Smartphone },
                { id: 'CARD' as PaymentMethod, label: 'Thẻ tín dụng', icon: CreditCard },
              ].map((m) => {
                const Icon = m.icon;
                const active = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                      active
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Số tiền khách đưa (VNĐ)</label>
              <input
                type="number"
                value={paidAmountInput}
                onChange={(e) => setPaidAmountInput(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-base font-bold text-slate-800"
              />
              {Number(paidAmountInput) >= thanhToanCuoi && (
                <p className="text-xs text-emerald-600 font-semibold">
                  Tiền thối lại: {formatCurrency(Number(paidAmountInput) - thanhToanCuoi)}
                </p>
              )}
            </div>

            {checkoutError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{checkoutError}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => void handleConfirmPayment()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold"
              >
                {submitting ? 'Đang xử lý...' : 'Xác nhận & In hóa đơn'}
              </button>
            </div>
          </div>
        </div>
      )}

      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        invoice={printableInvoice}
      />
    </div>
  );
};
