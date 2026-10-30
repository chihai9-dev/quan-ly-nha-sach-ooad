'use client';

import React from 'react';
import { Book } from '@/models/Book';
import { Plus, Check, AlertCircle } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onAddToCart?: (book: Book) => void;
  showActions?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onAddToCart,
  showActions = true,
}) => {
  const isAvailable = book.isAvailable(1);
  const isLowStock = book.isLowStock(5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Book Cover Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Stock Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            {!isAvailable ? (
              <span className="bg-rose-500 text-white text-xs font-semibold px-2 py-0.5 rounded shadow">
                Hết hàng
              </span>
            ) : isLowStock ? (
              <span className="bg-amber-500 text-white text-xs font-semibold px-2 py-0.5 rounded shadow flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Còn {book.stockQuantity}
              </span>
            ) : (
              <span className="bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded shadow">
                Còn {book.stockQuantity}
              </span>
            )}
          </div>
        </div>

        {/* Book Details */}
        <div className="p-4">
          <p className="text-xs font-mono text-slate-400 mb-1">{book.isbn}</p>
          <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{book.author}</p>
        </div>
      </div>

      {/* Footer & Price */}
      <div className="p-4 pt-0">
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <div>
            <span className="text-xs text-slate-400 block">Đơn giá</span>
            <span className="text-base font-bold text-indigo-600">
              {formatCurrency(book.price)}
            </span>
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
              title={isAvailable ? 'Thêm vào đơn hàng' : 'Hết hàng'}
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
