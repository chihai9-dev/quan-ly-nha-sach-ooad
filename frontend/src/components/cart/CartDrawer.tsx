'use client';

import React from 'react';
import { ChiTietHoaDon } from '@/models/ChiTietHoaDon';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag } from 'lucide-react';

interface CartDrawerProps {
  items: ChiTietHoaDon[];
  discountAmount: number;
  appliedCouponCode?: string | null;
  onUpdateQuantity: (maSach: string, quantity: number) => void;
  onRemoveItem: (maSach: string) => void;
  onClearCart: () => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  items,
  discountAmount,
  appliedCouponCode,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedCheckout,
}) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const totalQty = items.reduce((sum, ct) => sum + ct.soLuongBan, 0);
  const tongTienHang = items.reduce((sum, ct) => sum + ct.tinhThanhTien(), 0);
  const thanhToanCuoi = Math.max(0, tongTienHang - discountAmount);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-140px)] sticky top-20">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-indigo-600" />
          <h2 className="font-bold text-slate-800">Giỏ hàng (HoaDon)</h2>
          <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {totalQty} cuốn
          </span>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-xs text-rose-500 hover:text-rose-700 font-medium"
          >
            Xóa hết
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
            <ShoppingBag className="w-12 h-12 text-slate-200 mb-2" />
            <p className="text-sm font-medium">Chưa có sách trong giỏ</p>
            <p className="text-xs text-slate-400 mt-1">
              Nhấn dấu (+) trên danh sách sách để thêm vào hóa đơn
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.sach.maSach}
              className="flex flex-col gap-2 p-3 rounded-lg border border-slate-100 bg-slate-50/70"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-800 truncate" title={item.sach.tenSach}>
                    {item.sach.tenSach}
                  </h4>
                  <p className="text-[11px] text-indigo-600 font-bold">
                    {formatCurrency(item.donGiaBan)}
                    {item.giamGia > 0 && (
                      <span className="ml-1.5 text-emerald-600 font-normal">
                        (-{formatCurrency(item.giamGia)})
                      </span>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.sach.maSach)}
                  className="text-slate-400 hover:text-rose-500 p-1"
                  title="Xóa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center border border-slate-200 rounded-md bg-white">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.sach.maSach, item.soLuongBan - 1)}
                    className="p-1 hover:bg-slate-100 text-slate-500 rounded-l"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-semibold px-2.5 text-slate-700">{item.soLuongBan}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.sach.maSach, item.soLuongBan + 1)}
                    className="p-1 hover:bg-slate-100 text-slate-500 rounded-r"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <span className="text-xs font-bold text-slate-800">
                  {formatCurrency(item.tinhThanhTien())}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50/80 rounded-b-xl space-y-2">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Tổng tiền hàng:</span>
          <span className="font-medium text-slate-700">{formatCurrency(tongTienHang)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-xs text-emerald-600 font-medium">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {appliedCouponCode ? `Mã ${appliedCouponCode}:` : 'Giảm giá / Ưu đãi:'}
            </span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
          <span>Thanh toán cuối:</span>
          <span className="text-base text-indigo-600">{formatCurrency(thanhToanCuoi)}</span>
        </div>

        <button
          type="button"
          onClick={onProceedCheckout}
          disabled={items.length === 0}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
            items.length > 0
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Lập hóa đơn & Thanh toán</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
