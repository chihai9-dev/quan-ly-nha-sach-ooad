'use client';

import React, { useEffect, useState } from 'react';
import {
  FolderTree,
  UserPen,
  Building2,
  Plus,
  Lock,
  Unlock,
  AlertCircle,
  Search,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import type { AuthorDTO, CategoryDTO, PublisherDTO } from '@/types/dtos';

type TabKey = 'categories' | 'authors' | 'publishers';

export default function CategoriesPage() {
  const [tab, setTab] = useState<TabKey>('categories');
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [authors, setAuthors] = useState<AuthorDTO[]>([]);
  const [publishers, setPublishers] = useState<PublisherDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Category form (Add / Edit)
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catCode, setCatCode] = useState('');
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Author form (Add / Edit)
  const [editingAutId, setEditingAutId] = useState<string | null>(null);
  const [autName, setAutName] = useState('');
  const [autPenName, setAutPenName] = useState('');
  const [autNation, setAutNation] = useState('Việt Nam');
  const [autBio, setAutBio] = useState('');

  // Publisher form (Add / Edit)
  const [editingPubId, setEditingPubId] = useState<string | null>(null);
  const [pubName, setPubName] = useState('');
  const [pubAddress, setPubAddress] = useState('');
  const [pubPhone, setPubPhone] = useState('');
  const [pubContact, setPubContact] = useState('');

  const loadData = async (q?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = q?.trim() ? `/api/catalog?q=${encodeURIComponent(q.trim())}` : '/api/catalog';
      const res = await fetch(url, { cache: 'no-store' });
      const data = (await res.json()) as {
        categories?: CategoryDTO[];
        authors?: AuthorDTO[];
        publishers?: PublisherDTO[];
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? 'Vui lòng đăng nhập để xem danh mục sách.');
        return;
      }
      setCategories(data.categories ?? []);
      setAuthors(data.authors ?? []);
      setPublishers(data.publishers ?? []);
    } catch {
      setError('Không thể kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    void loadData(searchTerm);
  };

  const resetCategoryForm = () => {
    setEditingCatId(null);
    setCatCode('');
    setCatName('');
    setCatDesc('');
  };

  const resetAuthorForm = () => {
    setEditingAutId(null);
    setAutName('');
    setAutPenName('');
    setAutNation('Việt Nam');
    setAutBio('');
  };

  const resetPublisherForm = () => {
    setEditingPubId(null);
    setPubName('');
    setPubAddress('');
    setPubPhone('');
    setPubContact('');
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);
    const isEdit = Boolean(editingCatId);
    const res = await fetch('/api/catalog', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        isEdit
          ? { type: 'category', id: editingCatId, name: catName, description: catDesc }
          : { type: 'category', code: catCode, name: catName, description: catDesc }
      ),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể lưu thể loại.');
      return;
    }
    resetCategoryForm();
    setFeedback(isEdit ? 'Đã cập nhật thể loại sách.' : 'Đã thêm thể loại sách mới.');
    await loadData(searchTerm);
  };

  const handleToggleCategory = async (id: string) => {
    setError(null);
    const res = await fetch('/api/catalog', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể cập nhật trạng thái thể loại.');
      return;
    }
    await loadData(searchTerm);
  };

  const handleSaveAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);
    const isEdit = Boolean(editingAutId);
    const res = await fetch('/api/catalog', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'author',
        ...(isEdit ? { id: editingAutId } : {}),
        name: autName,
        penName: autPenName,
        nationality: autNation,
        biography: autBio,
      }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể lưu tác giả.');
      return;
    }
    resetAuthorForm();
    setFeedback(isEdit ? 'Đã cập nhật thông tin tác giả.' : 'Đã thêm tác giả mới.');
    await loadData(searchTerm);
  };

  const handleSavePublisher = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);
    const isEdit = Boolean(editingPubId);
    const res = await fetch('/api/catalog', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'publisher',
        ...(isEdit ? { id: editingPubId } : {}),
        name: pubName,
        address: pubAddress,
        phoneNumber: pubPhone,
        contactPerson: pubContact,
      }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể lưu nhà xuất bản.');
      return;
    }
    resetPublisherForm();
    setFeedback(isEdit ? 'Đã cập nhật nhà xuất bản.' : 'Đã thêm nhà xuất bản mới.');
    await loadData(searchTerm);
  };

  const handleDelete = async (type: 'category' | 'author' | 'publisher', id: string, label: string) => {
    if (!window.confirm(`Xác nhận xóa "${label}"?`)) return;
    setError(null);
    setFeedback(null);
    const res = await fetch(`/api/catalog?type=${type}&id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể xóa mục đã chọn.');
      return;
    }
    setFeedback(`Đã xóa "${label}".`);
    await loadData(searchTerm);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Quản Lý Danh Mục Sách</h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý Thể loại (TheLoai), Tác giả (TacGia) và Nhà xuất bản (NhaXuatBan) theo đúng sơ đồ QLDMS.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm thể loại, tác giả, NXB..."
              className="pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg w-60"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
          >
            Tìm kiếm
          </button>
        </form>
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

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setTab('categories')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            tab === 'categories'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderTree className="w-4 h-4" /> Thể loại ({categories.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('authors')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            tab === 'authors'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserPen className="w-4 h-4" /> Tác giả ({authors.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('publishers')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            tab === 'publishers'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" /> Nhà xuất bản ({publishers.length})
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-xl border border-slate-200">
          Đang tải dữ liệu danh mục...
        </div>
      ) : tab === 'categories' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSaveCategory} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 h-fit">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-indigo-600" />
                {editingCatId ? 'Cập nhật thể loại' : 'Thêm thể loại mới'}
              </h2>
              {editingCatId && (
                <button type="button" onClick={resetCategoryForm} className="text-xs text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <input
              type="text"
              required
              disabled={Boolean(editingCatId)}
              placeholder="Mã thể loại (VD: TL_LICHSU)"
              value={catCode}
              onChange={(e) => setCatCode(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg disabled:bg-slate-100"
            />
            <input
              type="text"
              required
              placeholder="Tên thể loại"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
            <textarea
              placeholder="Mô tả ngắn"
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
            <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold">
              {editingCatId ? 'Cập nhật thể loại' : 'Lưu thể loại'}
            </button>
          </form>

          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">Mã</th>
                  <th className="py-3 px-4 font-semibold">Tên thể loại</th>
                  <th className="py-3 px-4 font-semibold">Mô tả</th>
                  <th className="py-3 px-4 font-semibold">Trạng thái</th>
                  <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600">{cat.code}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{cat.name}</td>
                    <td className="py-3 px-4 text-slate-500">{cat.description || '—'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                          cat.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {cat.isActive ? 'Đang dùng' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCatId(cat.id);
                          setCatCode(cat.code);
                          setCatName(cat.name);
                          setCatDesc(cat.description);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-600"
                        title="Cập nhật thể loại"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleToggleCategory(cat.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-600"
                        title={cat.isActive ? 'Khóa' : 'Mở'}
                      >
                        {cat.isActive ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete('category', cat.id, cat.name)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-rose-200 hover:bg-rose-50 text-rose-600"
                        title="Xóa thể loại"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : tab === 'authors' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSaveAuthor} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 h-fit">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-indigo-600" />
                {editingAutId ? 'Cập nhật tác giả' : 'Thêm tác giả mới'}
              </h2>
              {editingAutId && (
                <button type="button" onClick={resetAuthorForm} className="text-xs text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <input
              type="text"
              required
              placeholder="Họ tên tác giả"
              value={autName}
              onChange={(e) => setAutName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Bút danh"
              value={autPenName}
              onChange={(e) => setAutPenName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Quốc tịch"
              value={autNation}
              onChange={(e) => setAutNation(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
            <textarea
              placeholder="Tiểu sử tóm tắt"
              value={autBio}
              onChange={(e) => setAutBio(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
            <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold">
              {editingAutId ? 'Cập nhật tác giả' : 'Lưu tác giả'}
            </button>
          </form>

          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">Tác giả</th>
                  <th className="py-3 px-4 font-semibold">Bút danh</th>
                  <th className="py-3 px-4 font-semibold">Tiểu sử</th>
                  <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {authors.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-semibold text-slate-800">{a.name}</td>
                    <td className="py-3 px-4 text-slate-600">{a.penName || '—'}</td>
                    <td className="py-3 px-4 text-slate-500">{a.biography || '—'}</td>
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAutId(a.id);
                          setAutName(a.name);
                          setAutPenName(a.penName ?? '');
                          setAutNation(a.nationality ?? 'Việt Nam');
                          setAutBio(a.biography);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-600"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete('author', a.id, a.name)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-rose-200 hover:bg-rose-50 text-rose-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSavePublisher} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 h-fit">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-indigo-600" />
                {editingPubId ? 'Cập nhật NXB' : 'Thêm Nhà xuất bản'}
              </h2>
              {editingPubId && (
                <button type="button" onClick={resetPublisherForm} className="text-xs text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <input
              type="text"
              required
              placeholder="Tên nhà xuất bản"
              value={pubName}
              onChange={(e) => setPubName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Địa chỉ"
              value={pubAddress}
              onChange={(e) => setPubAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              value={pubPhone}
              onChange={(e) => setPubPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Người đại diện liên hệ"
              value={pubContact}
              onChange={(e) => setPubContact(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
            <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold">
              {editingPubId ? 'Cập nhật NXB' : 'Lưu NXB'}
            </button>
          </form>

          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">Tên NXB</th>
                  <th className="py-3 px-4 font-semibold">Địa chỉ</th>
                  <th className="py-3 px-4 font-semibold">Điện thoại</th>
                  <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {publishers.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-semibold text-slate-800">{p.name}</td>
                    <td className="py-3 px-4 text-slate-600">{p.address || '—'}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{p.phoneNumber || '—'}</td>
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPubId(p.id);
                          setPubName(p.name);
                          setPubAddress(p.address);
                          setPubPhone(p.phoneNumber);
                          setPubContact(p.contactPerson ?? '');
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-600"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete('publisher', p.id, p.name)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-rose-200 hover:bg-rose-50 text-rose-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
