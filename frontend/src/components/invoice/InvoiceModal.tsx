'use client';

import React from 'react';
import { Invoice } from '@/models/Invoice';
import { Order } from '@/models/Order';
import { CheckCircle2, Printer, X, Receipt } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  order: Order | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
  order,
}) => {
  if (!isOpen || !invoice || !order) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const paymentMethodLabels: Record<string, string> = {
    CASH: 'Tiền mặt',
    BANK_TRANSFER: 'Chuyển khoản Ngân hàng',
    MOMO: 'Ví điện tử MoMo',
    CARD: 'Thẻ tín dụng / Ghi nợ',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/50 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Thanh Toán Thành Công</h3>
              <p className="text-xs text-indigo-100">Hóa đơn điện tử nhà sách</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-indigo-700 text-indigo-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Receipt Body */}
        <div className="p-6 space-y-5 text-sm" id="printable-invoice">
          {/* Top metadata */}
          <div className="text-center pb-4 border-b border-dashed border-slate-300">
            <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">
              NHÀ SÁCH TRÍ TUỆ
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Số 123 Đường Sách, Q.1, TP. Hồ Chí Minh</p>
            <p className="text-xs text-slate-500">Hotline: 1900 1234 - ĐT: (028) 3822 9999</p>
            <div className="mt-3 inline-block bg-slate-100 px-3 py-1 rounded text-xs font-mono font-semibold text-slate-700">
              Mã HĐ: {invoice.invoiceCode}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div>
              <span className="text-slate-400">Mã đơn hàng:</span> {order.orderCode}
            </div>
            <div className="text-right">
              <span className="text-slate-400">Ngày lập:</span>{' '}
              {invoice.issuedAt.toLocaleDateString('vi-VN')} {invoice.issuedAt.toLocaleTimeString('vi-VN')}
            </div>
            <div>
              <span className="text-slate-400">Thu ngân:</span> {order.cashierName}
            </div>
            <div className="text-right">
              <span className="text-slate-400">Phương thức:</span>{' '}
              <span className="font-medium text-slate-800">
                {paymentMethodLabels[invoice.paymentMethod] || invoice.paymentMethod}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-t border-b border-slate-200 py-3">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100">
                  <th className="text-left pb-1 font-semibold">Tên sách</th>
                  <th className="text-center pb-1 font-semibold">SL</th>
                  <th className="text-right pb-1 font-semibold">Đ.Giá</th>
                  <th className="text-right pb-1 font-semibold">T.Tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="py-1">
                    <td className="py-1.5 font-medium text-slate-800 max-w-[180px] truncate">
                      {item.bookTitle}
                    </td>
                    <td className="py-1.5 text-center text-slate-600">{item.quantity}</td>
                    <td className="py-1.5 text-right text-slate-600">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-1.5 text-right font-semibold text-slate-800">
                      {formatCurrency(item.getSubtotal())}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Cộng tiền hàng:</span>
              <span>{formatCurrency(order.calculateSubtotal())}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Chiết khấu:</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Thuế GTGT (VAT 8%):</span>
              <span>{formatCurrency(order.calculateTax())}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
              <span>TỔNG CỘNG:</span>
              <span className="text-indigo-600 text-base">
                {formatCurrency(order.calculateFinalTotal())}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 pt-1">
              <span>Tiền khách thanh toán:</span>
              <span className="font-medium">{formatCurrency(invoice.paidAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-600 font-semibold">
              <span>Tiền thối lại khách:</span>
              <span className="text-emerald-600 font-bold">
                {formatCurrency(invoice.changeAmount)}
              </span>
            </div>
          </div>

          {/* Greeting */}
          <div className="text-center text-xs text-slate-400 italic pt-2 border-t border-dashed border-slate-200">
            Cảm ơn Quý khách & Hẹn gặp lại!
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>In hóa đơn</span>
          </button>
        </div>
      </div>
    </div>
  );
};
