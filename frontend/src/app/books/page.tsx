'use client';

import React, { useState, useEffect } from 'react';
import type { AuthorDTO, CategoryDTO, PublisherDTO } from '@/types/dtos';
import {
  Plus,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

interface BookRow {
  maSach: string;
  tenSach: string;
  namXuatBan: number;
  giaNhap: number;
  giaBan: number;
  giaSauKhuyenMai: number;
  soLuongTon: number;
  mucTonToiThieu: number;
  trangThai: string;
  trangThaiTonKho: string;
  theLoai: { maTheLoai: string; tenTheLoai: string } | null;
  nhaXuatBan: { maNXB: string; tenNXB: string } | null;
  danhSachTacGia: Array<{ maTacGia: string; tenTacGia: string }>;
}

export default function BooksPage() {
  const [books, setBooks] = useState<BookRow[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [authors, setAuthors] = useState<AuthorDTO[]>([]);
  const [publishers, setPublishers] = useState<PublisherDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [maSach, setMaSach] = useState('');
  const [tenSach, setTenSach] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [publisherId, setPublisherId] = useState('');
  const [authorText, setAuthorText] = useState('');
  const [selectedAuthorId, setSelectedAuthorId] = useState('');
  const [namXuatBan, setNamXuatBan] = useState('2025');
  const [giaNhap, setGiaNhap] = useState('100000');
  const [giaBan, setGiaBan] = useState('150000');
  const [soLuongTon, setSoLuongTon] = useState('10');
  const [mucTonToiThieu, setMucTonToiThieu] = useState('5');

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set('q', searchTerm.trim());
      if (selectedCategory) params.set('categoryId', selectedCategory);
      const [booksRes, catRes] = await Promise.all([
        fetch(`/api/books?${params.toString()}`, { cache: 'no-store' }),
        fetch('/api/catalog', { cache: 'no-store' }),
      ]);
      const bData = (await booksRes.json()) as { books?: BookRow[]; error?: string };
      if (!booksRes.ok) {
        setError(bData.error ?? 'Vui lòng đăng nhập để xem danh sách sách.');
        return;
      }
      setBooks(bData.books ?? []);
      if (catRes.ok) {
        const cData = (await catRes.json()) as {
          categories?: CategoryDTO[];
          authors?: AuthorDTO[];
          publishers?: PublisherDTO[];
        };
        setCategories(cData.categories ?? []);
        setAuthors(cData.authors ?? []);
        setPublishers(cData.publishers ?? []);
      }
    } catch {
      setError('Không thể kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, [selectedCategory]);

  const openCreateModal = () => {
    setEditingId(null);
    setMaSach(`S-${Date.now().toString().slice(-5)}`);
    setTenSach('');
    setCategoryId(categories[0]?.id ?? '');
    setPublisherId(publishers[0]?.id ?? '');
    setSelectedAuthorId(authors[0]?.id ?? '');
    setAuthorText(authors[0]?.name ?? '');
    setNamXuatBan(String(new Date().getFullYear()));
    setGiaNhap('100000');
    setGiaBan('150000');
    setSoLuongTon('10');
    setMucTonToiThieu('5');
    setModalOpen(true);
  };

  const openEditModal = (b: BookRow) => {
    setEditingId(b.maSach);
    setMaSach(b.maSach);
    setTenSach(b.tenSach);
    setCategoryId(b.theLoai?.maTheLoai ?? '');
    setPublisherId(b.nhaXuatBan?.maNXB ?? '');
    setSelectedAuthorId(b.danhSachTacGia[0]?.maTacGia ?? '');
    setAuthorText(b.danhSachTacGia.map((t) => t.tenTacGia).join(', '));
    setNamXuatBan(String(b.namXuatBan));
    setGiaNhap(String(b.giaNhap));
    setGiaBan(String(b.giaBan));
    setSoLuongTon(String(b.soLuongTon));
    setMucTonToiThieu(String(b.mucTonToiThieu));
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);
    const isEdit = Boolean(editingId);
    const selectedAut = authors.find((a) => a.id === selectedAuthorId);
    const selectedPub = publishers.find((p) => p.id === publisherId);

    const payload = {
      ...(isEdit ? { id: editingId } : { isbn: maSach }),
      title: tenSach,
      author: selectedAut?.name ?? authorText,
      authorIds: selectedAuthorId ? [selectedAuthorId] : [],
      publisher: selectedPub?.name ?? '',
      publisherId: publisherId || undefined,
      categoryId: categoryId || undefined,
      publishYear: Number(namXuatBan),
      costPrice: Number(giaNhap),
      price: Number(giaBan),
      stockQuantity: Number(soLuongTon),
      minStockThreshold: Number(mucTonToiThieu),
    };

    const res = await fetch('/api/books', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể lưu thông tin sách.');
      return;
    }
    setModalOpen(false);
    setFeedback(isEdit ? 'Đã cập nhật thông tin sách.' : 'Đã thêm đầu sách mới.');
    await loadAll();
  };

  const handleDelete = async (b: BookRow) => {
    if (!window.confirm(`Xác nhận xóa đầu sách "${b.tenSach}"?`)) return;
    setError(null);
    setFeedback(null);
    const res = await fetch(`/api/books?id=${encodeURIComponent(b.maSach)}`, { method: 'DELETE' });
    const data = (await res.json()) as { deleted?: boolean; discontinued?: boolean; error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể xóa sách.');
      return;
    }
    setFeedback(
      data.discontinued
        ? `Sách "${b.tenSach}" đã phát sinh giao dịch nên được chuyển sang trạng thái Ngưng bán.`
        : `Đã xóa hẳn đầu sách "${b.tenSach}".`
    );
    await loadAll();
  };

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Quản Lý Sách (QLS)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý thực thể <code className="font-mono text-indigo-600">Sach</code> liên kết Thể loại, Tác giả, NXB và kiểm soát trạng thái tồn kho.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void loadAll()}
            className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sách mới</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
          {feedback}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void loadAll();
          }}
          className="flex gap-2 flex-1 min-w-[240px]"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm mã sách, tên sách, tác giả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>
          <button type="submit" className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold">
            Tìm
          </button>
        </form>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
        >
          <option value="">Tất cả thể loại</option>
          {categories.map((c) => (
            <option key={c.id} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Đang tải danh sách sách...</div>
        ) : books.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">Chưa có đầu sách nào khớp điều kiện.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3 px-4 font-semibold">Mã sách</th>
                <th className="py-3 px-4 font-semibold">Tên sách & Tác giả</th>
                <th className="py-3 px-4 font-semibold">Thể loại / NXB</th>
                <th className="py-3 px-4 font-semibold text-right">Giá nhập</th>
                <th className="py-3 px-4 font-semibold text-right">Giá bán</th>
                <th className="py-3 px-4 font-semibold text-center">Tồn kho</th>
                <th className="py-3 px-4 font-semibold">Trạng thái</th>
                <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {books.map((b) => (
                <tr key={b.maSach} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600">{b.maSach}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">{b.tenSach}</p>
                    <p className="text-[11px] text-slate-500">
                      {b.danhSachTacGia.map((t) => t.tenTacGia).join(', ') || 'Chưa rõ tác giả'} ({b.namXuatBan})
                    </p>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <p>{b.theLoai?.tenTheLoai ?? '—'}</p>
                    <p className="text-[11px] text-slate-400">{b.nhaXuatBan?.tenNXB ?? '—'}</p>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600">{formatCurrency(b.giaNhap)}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-800">{formatCurrency(b.giaBan)}</td>
                  <td className="py-3 px-4 text-center font-semibold">
                    {b.soLuongTon}
                    <span className="text-[10px] text-slate-400 block">Min: {b.mucTonToiThieu}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        b.trangThaiTonKho === 'NGUNG_BAN'
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
                          : b.trangThaiTonKho === 'HET_HANG'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : b.trangThaiTonKho === 'SAP_HET_HANG'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {b.trangThaiTonKho === 'NGUNG_BAN'
                        ? 'Ngưng bán'
                        : b.trangThaiTonKho === 'HET_HANG'
                          ? 'Hết hàng'
                          : b.trangThaiTonKho === 'SAP_HET_HANG'
                            ? 'Sắp hết'
                            : 'Còn hàng'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => openEditModal(b)}
                      className="inline-flex items-center p-1.5 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-600"
                      title="Cập nhật thông tin sách"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(b)}
                      className="inline-flex items-center p-1.5 rounded-md border border-rose-200 hover:bg-rose-50 text-rose-600"
                      title="Xóa / Ngưng bán sách"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-800">
                {editingId ? 'Cập nhật thông tin sách' : 'Thêm đầu sách mới'}
              </h2>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mã sách</label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingId)}
                  value={maSach}
                  onChange={(e) => setMaSach(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg disabled:bg-slate-100"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Năm xuất bản</label>
                <input
                  type="number"
                  value={namXuatBan}
                  onChange={(e) => setNamXuatBan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">Tên sách</label>
                <input
                  type="text"
                  required
                  value={tenSach}
                  onChange={(e) => setTenSach(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Thể loại</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nhà xuất bản</label>
                <select
                  value={publisherId}
                  onChange={(e) => setPublisherId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {publishers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">Tác giả</label>
                <select
                  value={selectedAuthorId}
                  onChange={(e) => {
                    setSelectedAuthorId(e.target.value);
                    const found = authors.find((a) => a.id === e.target.value);
                    if (found) setAuthorText(found.name);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Giá nhập (VNĐ)</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={giaNhap}
                  onChange={(e) => setGiaNhap(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Giá bán (VNĐ)</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={giaBan}
                  onChange={(e) => setGiaBan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Số lượng tồn</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={soLuongTon}
                  onChange={(e) => setSoLuongTon(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mức tồn tối thiểu</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={mucTonToiThieu}
                  onChange={(e) => setMucTonToiThieu(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
              >
                {editingId ? 'Lưu thay đổi' : 'Thêm sách'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
