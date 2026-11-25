'use client';

import React, { useEffect, useState } from 'react';
import { FolderTree, UserPen, Building2, Plus, Lock, Unlock, AlertCircle } from 'lucide-react';
import type { AuthorDTO, CategoryDTO, PublisherDTO } from '@/types/dtos';

type TabKey = 'categories' | 'authors' | 'publishers';

export default function CategoriesPage() {
  const [tab, setTab] = useState<TabKey>('categories');
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [authors, setAuthors] = useState<AuthorDTO[]>([]);
  const [publishers, setPublishers] = useState<PublisherDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Category form
  const [catCode, setCatCode] = useState('');
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Author form
  const [autName, setAutName] = useState('');
  const [autPenName, setAutPenName] = useState('');
  const [autNation, setAutNation] = useState('Việt Nam');
  const [autBio, setAutBio] = useState('');

  // Publisher form
  const [pubName, setPubName] = useState('');
  const [pubAddress, setPubAddress] = useState('');
  const [pubPhone, setPubPhone] = useState('');
  const [pubContact, setPubContact] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/catalog', { cache: 'no-store' });
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

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);
    const res = await fetch('/api/catalog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'category', code: catCode, name: catName, description: catDesc }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể thêm thể loại.');
      return;
    }
    setCatCode('');
    setCatName('');
    setCatDesc('');
    setFeedback('Đã thêm thể loại sách mới.');
    await loadData();
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
    await loadData();
  };

  const handleAddAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);
    const res = await fetch('/api/catalog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'author',
        name: autName,
        penName: autPenName,
        nationality: autNation,
        biography: autBio,
      }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể thêm tác giả.');
      return;
    }
    setAutName('');
    setAutPenName('');
    setAutBio('');
    setFeedback('Đã thêm tác giả mới.');
    await loadData();
  };

  const handleAddPublisher = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);
    const res = await fetch('/api/catalog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'publisher',
        name: pubName,
        address: pubAddress,
        phoneNumber: pubPhone,
        contactPerson: pubContact,
      }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể thêm nhà xuất bản.');
      return;
    }
    setPubName('');
    setPubAddress('');
    setPubPhone('');
    setPubContact('');
    setFeedback('Đã thêm nhà xuất bản mới.');
    await loadData();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Quản Lý Danh Mục Sách</h1>
        <p className="text-xs text-slate-500 mt-1">
          Quản lý thể loại, tác giả và nhà xuất bản (Phân hệ Nhân viên kho).
        </p>
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
          <form onSubmit={handleAddCategory} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 h-fit">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-600" /> Thêm thể loại mới
            </h2>
            <input
              type="text"
              required
              placeholder="Mã thể loại (VD: LICH_SU)"
              value={catCode}
              onChange={(e) => setCatCode(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
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
              Lưu thể loại
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
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => void handleToggleCategory(cat.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-600"
                      >
                        {cat.isActive ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        {cat.isActive ? 'Khóa' : 'Mở'}
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
          <form onSubmit={handleAddAuthor} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 h-fit">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-600" /> Thêm tác giả mới
            </h2>
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
              Lưu tác giả
            </button>
          </form>

          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">Tác giả</th>
                  <th className="py-3 px-4 font-semibold">Bút danh</th>
                  <th className="py-3 px-4 font-semibold">Quốc tịch</th>
                  <th className="py-3 px-4 font-semibold">Tiểu sử</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {authors.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-semibold text-slate-800">{a.name}</td>
                    <td className="py-3 px-4 text-slate-600">{a.penName || '—'}</td>
                    <td className="py-3 px-4 text-slate-600">{a.nationality || '—'}</td>
                    <td className="py-3 px-4 text-slate-500">{a.biography || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleAddPublisher} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 h-fit">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-600" /> Thêm Nhà xuất bản
            </h2>
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
              Lưu NXB
            </button>
          </form>

          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">Tên NXB</th>
                  <th className="py-3 px-4 font-semibold">Địa chỉ</th>
                  <th className="py-3 px-4 font-semibold">Điện thoại</th>
                  <th className="py-3 px-4 font-semibold">Đại diện</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {publishers.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-semibold text-slate-800">{p.name}</td>
                    <td className="py-3 px-4 text-slate-600">{p.address || '—'}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{p.phoneNumber || '—'}</td>
                    <td className="py-3 px-4 text-slate-500">{p.contactPerson || '—'}</td>
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
