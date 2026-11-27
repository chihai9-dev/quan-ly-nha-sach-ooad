'use client';

import React from 'react';
import { Sach } from '@/models/Sach';
import { Plus, AlertCircle, BookOpen } from 'lucide-react';

interface BookCardProps {
  book: Sach;
  onAddToCart?: (book: Sach) => void;
  showActions?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onAddToCart,
  showActions = true,
}) => {
  const status = book.layTrangThaiTonKho();
  const isAvailable = book.soLuongTon > 0 && status !== 'NGUNG_BAN';
  const giaSauKM = book.tinhGiaBanSauKhuyenMai();
  const hasDiscount = giaSauKM < book.giaBan;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const authorText =
    book.danhSachTacGia.length > 0
      ? book.danhSachTacGia.map((t) => t.tenTacGia).join(', ')
      : 'Chưa rõ tác giả';

  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="relative h-32 w-full bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center p-4">
          <BookOpen className="w-12 h-12 text-indigo-300 group-hover:scale-110 transition-transform" />
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            {status === 'NGUNG_BAN' ? (
              <span className="bg-slate-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow">
                Ngưng bán
              </span>
            ) : !isAvailable ? (
              <span className="bg-rose-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow">
                Hết hàng
              </span>
            ) : status === 'SAP_HET_HANG' ? (
              <span className="bg-amber-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Còn {book.soLuongTon}
              </span>
            ) : (
              <span className="bg-emerald-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow">
                Còn {book.soLuongTon}
              </span>
            )}
          </div>
          {book.theLoai && (
            <span className="absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-white/90 text-indigo-700 border border-indigo-100">
              {book.theLoai.tenTheLoai}
            </span>
          )}
        </div>

        <div className="p-3.5">
          <p className="text-[11px] font-mono text-slate-400 mb-0.5">{book.maSach}</p>
          <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
            {book.tenSach}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{authorText}</p>
        </div>
      </div>

      <div className="p-3.5 pt-0">
        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
          <div>
            {hasDiscount ? (
              <>
                <span className="text-[11px] text-slate-400 line-through block">
                  {formatCurrency(book.giaBan)}
                </span>
                <span className="text-sm font-bold text-rose-600">{formatCurrency(giaSauKM)}</span>
              </>
            ) : (
              <>
                <span className="text-[11px] text-slate-400 block">Giá bán</span>
                <span className="text-sm font-bold text-indigo-600">{formatCurrency(book.giaBan)}</span>
              </>
            )}
          </div>

          {showActions && onAddToCart && (
            <button
              onClick={() => onAddToCart(book)}
              disabled={!isAvailable}
              className={`p-2 rounded-lg font-medium text-sm flex items-center justify-center transition-colors ${
                isAvailable
                  ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              title={isAvailable ? 'Thêm vào hóa đơn' : 'Không thể bán'}
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
