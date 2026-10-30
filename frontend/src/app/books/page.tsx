'use client';

import React, { useState, useEffect } from 'react';
import { Book } from '@/models/Book';
import { BookService } from '@/services/BookService';
import { BookList } from '@/components/books/BookList';
import { BookOpen, Plus, RefreshCw, AlertTriangle } from 'lucide-react';

export default function BooksPage() {
  const [bookService] = useState(() => new BookService());
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Quản Lý Danh Mục & Kho Sách
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tra cứu thông tin chi tiết, theo dõi số lượng tồn kho và mức cảnh báo an toàn.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadBooks}
            className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => alert('Chức năng thêm mới sách có thể mở modal CreateBookForm để thực hiện')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sách mới</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400">Đang tải danh sách sách...</div>
      ) : (
        <BookList books={books} showActions={false} />
      )}
    </div>
  );
}
