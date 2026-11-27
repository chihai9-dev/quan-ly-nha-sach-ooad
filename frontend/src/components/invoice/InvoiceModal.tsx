'use client';

import React from 'react';
import { CheckCircle2, Printer, X } from 'lucide-react';

export interface PrintableInvoiceData {
  maHoaDon: string;
  maThanhToan: string;
  ngayLap: string;
  nguoiLap: string;
  khachHangTen?: string;
  phuongThuc: string;
  tongTienHang: number;
  tienGiamGia: number;
  thanhToanCuoi: number;
  tienKhachDua: number;
  tienThoi: number;
  chiTiet: Array<{
    maSach: string;
    tenSach: string;
    soLuongBan: number;
    donGiaBan: number;
    giamGia: number;
    thanhTien: number;
  }>;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: PrintableInvoiceData | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const paymentMethodLabels: Record<string, string> = {
    CASH: 'Tiền mặt',
    BANK_TRANSFER: 'Chuyển khoản Ngân hàng',
    MOMO: 'Ví điện tử MoMo',
    CARD: 'Thẻ tín dụng / Ghi nợ',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-indigo-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/50 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Thanh Toán Thành Công</h3>
              <p className="text-xs text-indigo-100">Hóa đơn bán lẻ (HoaDon + ThanhToan)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-indigo-700 text-indigo-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm" id="printable-invoice">
          <div className="text-center pb-4 border-b border-dashed border-slate-300">
            <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">
              NHÀ SÁCH TRÍ TUỆ
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Số 123 Đường Sách, Q.1, TP. Hồ Chí Minh</p>
            <div className="mt-3 inline-block bg-slate-100 px-3 py-1 rounded text-xs font-mono font-semibold text-slate-700">
              Mã HĐ: {invoice.maHoaDon} | Mã TT: {invoice.maThanhToan}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div>
              <span className="text-slate-400">Thu ngân:</span> {invoice.nguoiLap}
            </div>
            <div className="text-right">
              <span className="text-slate-400">Ngày lập:</span>{' '}
              {new Date(invoice.ngayLap).toLocaleString('vi-VN')}
            </div>
            <div>
              <span className="text-slate-400">Khách hàng:</span> {invoice.khachHangTen || 'Khách vãng lai'}
            </div>
            <div className="text-right">
              <span className="text-slate-400">Phương thức:</span>{' '}
              <span className="font-medium text-slate-800">
                {paymentMethodLabels[invoice.phuongThuc] || invoice.phuongThuc}
              </span>
            </div>
          </div>

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
                {invoice.chiTiet.map((item) => (
                  <tr key={item.maSach}>
                    <td className="py-1.5 font-medium text-slate-800 max-w-[180px] truncate">{item.tenSach}</td>
                    <td className="py-1.5 text-center text-slate-600">{item.soLuongBan}</td>
                    <td className="py-1.5 text-right text-slate-600">{formatCurrency(item.donGiaBan)}</td>
                    <td className="py-1.5 text-right font-semibold text-slate-800">
                      {formatCurrency(item.thanhTien)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Tổng tiền hàng:</span>
              <span>{formatCurrency(invoice.tongTienHang)}</span>
            </div>
            {invoice.tienGiamGia > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Tiền giảm giá:</span>
                <span>-{formatCurrency(invoice.tienGiamGia)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
              <span>THANH TOÁN CUỐI:</span>
              <span className="text-indigo-600 text-base">{formatCurrency(invoice.thanhToanCuoi)}</span>
            </div>
            <div className="flex justify-between text-slate-600 pt-1">
              <span>Tiền khách đưa:</span>
              <span className="font-medium">{formatCurrency(invoice.tienKhachDua)}</span>
            </div>
            <div className="flex justify-between text-slate-600 font-semibold">
              <span>Tiền thối lại:</span>
              <span className="text-emerald-600 font-bold">{formatCurrency(invoice.tienThoi)}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-xs font-semibold hover:bg-slate-100"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-indigo-700"
          >
            <Printer className="w-4 h-4" />
            <span>In hóa đơn</span>
          </button>
        </div>
      </div>
    </div>
  );
};
