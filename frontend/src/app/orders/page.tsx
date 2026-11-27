'use client';

import React, { useState, useEffect } from 'react';
import type { InventoryItemDTO, ReturnExchangeDTO } from '@/types/dtos';
import { History, RotateCcw, CheckCircle2, AlertCircle, Search } from 'lucide-react';

interface InvoiceRow {
  maHoaDon: string;
  ngayLap: string;
  tongTienHang: number;
  tienGiamGia: number;
  thanhToanCuoi: number;
  trangThai: string;
  conTrongHanDoiTra: boolean;
  nhanVienLap: string;
  khachHang: { maKH: string; hoTen: string } | null;
  maGiamGia: string | null;
  phuongThuc: string;
  chiTiet: Array<{
    maSach: string;
    tenSach: string;
    soLuongBan: number;
    donGiaBan: number;
    thanhTien: number;
  }>;
}

export default function OrdersPage() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [returns, setReturns] = useState<ReturnExchangeDTO[]>([]);
  const [books, setBooks] = useState<InventoryItemDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'orders' | 'returns'>('orders');

  // Return form state
  const [orderCode, setOrderCode] = useState('');
  const [returnType, setReturnType] = useState<'RETURN' | 'EXCHANGE'>('RETURN');
  const [bookId, setBookId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [exchangeBookId, setExchangeBookId] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadAll = async (q?: string) => {
    setLoading(true);
    try {
      const invUrl = q?.trim() ? `/api/invoices?q=${encodeURIComponent(q.trim())}` : '/api/invoices';
      const [invRes, retRes] = await Promise.all([
        fetch(invUrl, { cache: 'no-store' }),
        fetch('/api/returns', { cache: 'no-store' }),
      ]);
      if (invRes.ok) {
        const invData = (await invRes.json()) as { invoices?: InvoiceRow[] };
        setInvoices(invData.invoices ?? []);
      }
      if (retRes.ok) {
        const retData = (await retRes.json()) as {
          returns?: ReturnExchangeDTO[];
          books?: InventoryItemDTO[];
        };
        setReturns(retData.returns ?? []);
        setBooks(retData.books ?? []);
        if (!bookId && retData.books?.length) {
          setBookId(retData.books[0].bookId);
          setExchangeBookId(retData.books[Math.min(1, retData.books.length - 1)].bookId);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  const handleCreateReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);
    const selectedBook = books.find((b) => b.bookId === bookId);
    if (!selectedBook) {
      setError('Vui lòng chọn đầu sách khách trả.');
      return;
    }

    const matchedInv = invoices.find((inv) => inv.maHoaDon === orderCode.trim());
    const res = await fetch('/api/returns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderCode: orderCode.trim(),
        orderDate: matchedInv?.ngayLap ?? new Date().toISOString(),
        type: returnType,
        reason,
        items: [
          {
            bookId: selectedBook.bookId,
            bookTitle: selectedBook.title,
            quantity: Number(quantity),
            maxPurchasedQuantity: 10,
            unitPrice: selectedBook.price,
          },
        ],
        exchangeBookId: returnType === 'EXCHANGE' ? exchangeBookId : undefined,
      }),
    });
    const data = (await res.json()) as { record?: ReturnExchangeDTO; error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể lập phiếu đổi/trả.');
      return;
    }
    setReason('');
    setFeedback(`Đã lập phiếu ${data.record?.returnCode} và tự động cập nhật tồn kho.`);
    await loadAll(searchTerm);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Hóa Đơn Bán Lẻ & Đổi / Trả Hàng
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tra cứu <code className="font-mono text-indigo-600">HoaDon</code> và xử lý <code className="font-mono text-indigo-600">PhieuDoiTra</code> trong vòng 7 ngày.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void loadAll(searchTerm);
          }}
          className="flex gap-2"
        >
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm mã hóa đơn, khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg w-60"
            />
          </div>
          <button type="submit" className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold">
            Tra cứu
          </button>
        </form>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setTab('orders')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 ${
            tab === 'orders' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500'
          }`}
        >
          <History className="w-4 h-4" /> Hóa đơn bán lẻ ({invoices.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('returns')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 ${
            tab === 'returns' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500'
          }`}
        >
          <RotateCcw className="w-4 h-4" /> Phiếu Đổi / Trả hàng ({returns.length})
        </button>
      </div>

      {tab === 'orders' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Đang tải danh sách hóa đơn...</div>
          ) : invoices.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <History className="w-12 h-12 text-slate-200 mx-auto mb-2" />
              <p className="text-sm font-medium">Chưa có hóa đơn bán lẻ nào.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">Mã Hóa Đơn</th>
                  <th className="py-3 px-4 font-semibold">Ngày Lập</th>
                  <th className="py-3 px-4 font-semibold">Khách Hàng</th>
                  <th className="py-3 px-4 font-semibold">Thu Ngân</th>
                  <th className="py-3 px-4 font-semibold">Mã Giảm Giá</th>
                  <th className="py-3 px-4 font-semibold">Trạng Thái</th>
                  <th className="py-3 px-4 font-semibold text-right">Thanh Toán Cuối</th>
                  <th className="py-3 px-4 font-semibold text-right">Đổi / Trả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.maHoaDon} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600">{inv.maHoaDon}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {new Date(inv.ngayLap).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{inv.khachHang?.hoTen ?? 'Khách vãng lai'}</td>
                    <td className="py-3 px-4 text-slate-600">{inv.nhanVienLap}</td>
                    <td className="py-3 px-4 font-mono text-emerald-700">{inv.maGiamGia ?? '—'}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> {inv.trangThai}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800">
                      {formatCurrency(inv.thanhToanCuoi)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {inv.conTrongHanDoiTra ? (
                        <button
                          type="button"
                          onClick={() => {
                            setOrderCode(inv.maHoaDon);
                            setTab('returns');
                          }}
                          className="px-2.5 py-1 rounded-md border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-semibold"
                        >
                          Đổi / Trả
                        </button>
                      ) : (
                        <span className="text-slate-400">Hết hạn 7 ngày</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleCreateReturn} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 h-fit">
            <h2 className="text-sm font-bold text-slate-800">Lập Phiếu Đổi / Trả Hàng</h2>
            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {feedback && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
                {feedback}
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Mã hóa đơn gốc</label>
              <input
                type="text"
                required
                placeholder="VD: HD-20261127-1234"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Hình thức xử lý</label>
              <select
                value={returnType}
                onChange={(e) => setReturnType(e.target.value as 'RETURN' | 'EXCHANGE')}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="RETURN">Trả sách & Hoàn tiền</option>
                <option value="EXCHANGE">Đổi sang đầu sách khác</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Sách khách trả lại</label>
              <select
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                {books.map((b) => (
                  <option key={b.bookId} value={b.bookId}>
                    {b.title} ({formatCurrency(b.price)})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Số lượng trả</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            {returnType === 'EXCHANGE' && (
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Sách mới đổi cho khách</label>
                <select
                  value={exchangeBookId}
                  onChange={(e) => setExchangeBookId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  {books.map((b) => (
                    <option key={b.bookId} value={b.bookId}>
                      {b.title} ({formatCurrency(b.price)} — Tồn: {b.stockQuantity})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Lý do đổi / trả</label>
              <textarea
                required
                rows={3}
                placeholder="VD: Sách bị lỗi in ấn, khách đổi sang đầu sách khác..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
            >
              Xác nhận lập phiếu đổi / trả
            </button>
          </form>

          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">Mã Phiếu</th>
                  <th className="py-3 px-4 font-semibold">Hóa Đơn Gốc</th>
                  <th className="py-3 px-4 font-semibold">Hình Thức</th>
                  <th className="py-3 px-4 font-semibold">Chi Tiết & Lý Do</th>
                  <th className="py-3 px-4 font-semibold text-right">Tiền Hoàn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {returns.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600">{r.returnCode}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{r.orderCode}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        {r.type === 'EXCHANGE' ? 'Đổi sách' : 'Trả hàng'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <p className="font-medium text-slate-800">
                        {r.items.map((i) => `${i.bookTitle} (x${i.quantity})`).join(', ')}
                      </p>
                      <p className="text-[11px] text-slate-500">{r.reason}</p>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-rose-600">
                      {formatCurrency(r.refundAmount)}
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
