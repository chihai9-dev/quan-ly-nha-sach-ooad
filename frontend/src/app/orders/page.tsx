'use client';

import React, { useState, useEffect } from 'react';
import { Order } from '@/models/Order';
import { OrderService } from '@/services/OrderService';
import type { InventoryItemDTO, ReturnExchangeDTO } from '@/types/dtos';
import { History, RotateCcw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function OrdersPage() {
  const [orderService] = useState(() => new OrderService());
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<ReturnExchangeDTO[]>([]);
  const [books, setBooks] = useState<InventoryItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'orders' | 'returns'>('orders');

  // Return form state
  const [orderCode, setOrderCode] = useState('ORD-20261125-001');
  const [returnType, setReturnType] = useState<'RETURN' | 'EXCHANGE'>('RETURN');
  const [bookId, setBookId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [exchangeBookId, setExchangeBookId] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [orderData, retRes] = await Promise.all([
        orderService.getRecentOrders(20),
        fetch('/api/returns', { cache: 'no-store' }),
      ]);
      setOrders(orderData);
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
    } catch (err) {
      console.error('Error fetching orders:', err);
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

    const res = await fetch('/api/returns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderCode,
        orderDate: new Date().toISOString(),
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
    await loadAll();
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Lịch Sử Đơn Hàng & Đổi / Trả Hàng
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Tra cứu hóa đơn bán lẻ và xử lý nghiệp vụ khách trả sách / đổi sách trong vòng 7 ngày.
        </p>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setTab('orders')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 ${
            tab === 'orders' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500'
          }`}
        >
          <History className="w-4 h-4" /> Hóa đơn bán lẻ ({orders.length})
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
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Đang tải lịch sử đơn hàng...</div>
          ) : orders.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <History className="w-12 h-12 text-slate-200 mx-auto mb-2" />
              <p className="text-sm font-medium">Chưa có giao dịch đơn hàng nào được ghi nhận.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">Mã Đơn</th>
                  <th className="py-3 px-4 font-semibold">Thời Gian</th>
                  <th className="py-3 px-4 font-semibold">Thu Ngân</th>
                  <th className="py-3 px-4 font-semibold">Trạng Thái</th>
                  <th className="py-3 px-4 font-semibold text-right">Tổng Tiền</th>
                  <th className="py-3 px-4 font-semibold text-right">Đổi / Trả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.getId()} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600">{order.orderCode}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {order.getCreatedAt().toLocaleDateString('vi-VN')} {order.getCreatedAt().toLocaleTimeString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{order.cashierName}</td>
                    <td className="py-3 px-4">
                      {order.status === 'COMPLETED' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Hoàn tất
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-semibold">
                          <Clock className="w-3 h-3" /> {order.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(order.calculateFinalTotal())}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setOrderCode(order.orderCode);
                          setTab('returns');
                        }}
                        className="px-2.5 py-1 rounded border border-indigo-200 bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100"
                      >
                        Lập đổi/trả
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="space-y-4">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={handleCreateReturn} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 h-fit">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-indigo-600" /> Tạo phiếu Đổi / Trả hàng
              </h2>
              <input type="text" required placeholder="Mã hóa đơn cũ" value={orderCode} onChange={(e) => setOrderCode(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono" />
              <select value={returnType} onChange={(e) => setReturnType(e.target.value as 'RETURN' | 'EXCHANGE')} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white">
                <option value="RETURN">Trả sách & Hoàn tiền</option>
                <option value="EXCHANGE">Đổi sang cuốn sách khác</option>
              </select>
              <select value={bookId} onChange={(e) => setBookId(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white">
                {books.map((b) => (
                  <option key={b.bookId} value={b.bookId}>
                    Sách trả: {b.title} ({formatCurrency(b.price)})
                  </option>
                ))}
              </select>
              <input type="number" min={1} max={10} required value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Số lượng trả" className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
              {returnType === 'EXCHANGE' && (
                <select value={exchangeBookId} onChange={(e) => setExchangeBookId(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white">
                  {books.map((b) => (
                    <option key={b.bookId} value={b.bookId}>
                      Đổi lấy: {b.title} ({formatCurrency(b.price)})
                    </option>
                  ))}
                </select>
              )}
              <input type="text" required placeholder="Lý do đổi / trả (VD: Mua nhầm tập, nguyên vẹn)" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
              <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold">
                Xác nhận đổi / trả & cập nhật kho
              </button>
            </form>

            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Mã phiếu</th>
                    <th className="py-3 px-4 font-semibold">Hóa đơn gốc</th>
                    <th className="py-3 px-4 font-semibold">Loại</th>
                    <th className="py-3 px-4 font-semibold">Chi tiết</th>
                    <th className="py-3 px-4 font-semibold text-right">Hoàn / Chênh lệch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {returns.map((r) => (
                    <tr key={r.id}>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600">{r.returnCode}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">{r.orderCode}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                          r.type === 'RETURN'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-sky-50 text-sky-700 border-sky-200'
                        }`}>
                          {r.type === 'RETURN' ? 'Trả hàng' : 'Đổi sách'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {r.items.map((i) => `${i.bookTitle} (x${i.quantity})`).join(', ')}
                        {r.exchangeBookTitle ? ` → ${r.exchangeBookTitle}` : ''}
                        <span className="block text-[11px] text-slate-400">{r.reason}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        {r.refundAmount >= 0
                          ? `Hoàn ${formatCurrency(r.refundAmount)}`
                          : `Thu thêm ${formatCurrency(Math.abs(r.refundAmount))}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
