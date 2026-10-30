'use client';

import React, { useState } from 'react';
import { Book } from '@/models/Book';
import { BookCard } from './BookCard';
import { Search, Filter, BookOpen } from 'lucide-react';

interface BookListProps {
  books: Book[];
  onAddToCart?: (book: Book) => void;
  showActions?: boolean;
}

export const BookList: React.FC<BookListProps> = ({
  books,
  onAddToCart,
  showActions = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK'>('ALL');

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);

    if (!matchesSearch) return false;

    if (selectedFilter === 'IN_STOCK') {
      return book.isAvailable(1);
    }
    if (selectedFilter === 'LOW_STOCK') {
      return book.isLowStock(5);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm sách theo tên, tác giả, ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedFilter === 'ALL'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({books.length})
            </button>
            <button
              onClick={() => setSelectedFilter('IN_STOCK')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedFilter === 'IN_STOCK'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Còn hàng
            </button>
            <button
              onClick={() => setSelectedFilter('LOW_STOCK')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedFilter === 'LOW_STOCK'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sắp hết
            </button>
          </div>
        </div>
      </div>

      {/* Book Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.getId()}
              book={book}
              onAddToCart={onAddToCart}
              showActions={showActions}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">Không tìm thấy sách phù hợp</h3>
          <p className="text-sm text-slate-400 mt-1">
            Vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc.
          </p>
        </div>
      )}
    </div>
  );
};
