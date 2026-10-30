'use client';

import React from 'react';
import { Order } from '@/models/Order';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  order: Order;
  onUpdateQuantity: (bookId: string, quantity: number) => void;
  onRemoveItem: (bookId: string) => void;
  onClearCart: () => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  order,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedCheckout,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const items = order.items;
  const subtotal = order.calculateSubtotal();
  const tax = order.calculateTax();
  const discount = order.discountAmount;
  const total = order.calculateFinalTotal();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-140px)] sticky top-20">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-indigo-600" />
          <h2 className="font-bold text-slate-800">Đơn hàng hiện tại</h2>
          <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {order.getTotalItemQuantity()} món
          </span>
        </div>

        {items.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors"
          >
            Xóa hết
          </button>
        )}
      </div>

      {/* Item List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
            <ShoppingBag className="w-12 h-12 text-slate-200 mb-2" />
            <p className="text-sm font-medium">Chưa có sản phẩm nào</p>
            <p className="text-xs text-slate-400 mt-1">
              Nhấn vào dấu (+) trên danh sách sách để thêm vào đơn
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.bookId}
              className="flex gap-3 p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-colors"
            >
              <img
                src={item.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120'}
                alt={item.bookTitle}
                className="w-12 h-16 object-cover rounded bg-white shadow-xs"
              />
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 truncate" title={item.bookTitle}>
                    {item.bookTitle}
                  </h4>
                  <p className="text-xs text-indigo-600 font-bold mt-0.5">
                    {formatCurrency(item.unitPrice)}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-slate-200 rounded-md bg-white">
                    <button
                      onClick={() => onUpdateQuantity(item.bookId, item.quantity - 1)}
                      className="p-1 hover:bg-slate-100 text-slate-500 rounded-l"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-semibold px-2 text-slate-700 min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.bookId, item.quantity + 1)}
                      className="p-1 hover:bg-slate-100 text-slate-500 rounded-r"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">
                      {formatCurrency(item.getSubtotal())}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.bookId)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/80 rounded-b-xl space-y-2">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Tạm tính:</span>
          <span className="font-medium text-slate-700">{formatCurrency(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-xs text-emerald-600">
            <span>Chiết khấu hội viên:</span>
            <span className="font-medium">-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-xs text-slate-500">
          <span>Thuế VAT (8%):</span>
          <span className="font-medium text-slate-700">{formatCurrency(tax)}</span>
        </div>

        <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
          <span>Tổng thanh toán:</span>
          <span className="text-base text-indigo-600">{formatCurrency(total)}</span>
        </div>

        <button
          onClick={onProceedCheckout}
          disabled={items.length === 0}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
            items.length > 0
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Thanh toán & Xuất hóa đơn</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
