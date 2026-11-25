'use client';

import React, { useEffect, useState } from 'react';
import { PackagePlus, Wallet, AlertCircle } from 'lucide-react';
import type {
  GoodsReceiptDTO,
  InventoryItemDTO,
  PaymentMethod,
  SupplierDTO,
  SupplierPaymentDTO,
} from '@/types/dtos';

export default function ImportsPage() {
  const [receipts, setReceipts] = useState<GoodsReceiptDTO[]>([]);
  const [payments, setPayments] = useState<SupplierPaymentDTO[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierDTO[]>([]);
  const [books, setBooks] = useState<InventoryItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Create receipt form
  const [supplierId, setSupplierId] = useState('');
  const [bookId, setBookId] = useState('');
  const [quantity, setQuantity] = useState('10');
  const [unitCost, setUnitCost] = useState('100000');
  const [paidAmount, setPaidAmount] = useState('0');
  const [note, setNote] = useState('');

  // Record payment form
  const [paySupplierId, setPaySupplierId] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('BANK_TRANSFER');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/imports', { cache: 'no-store' });
      const data = (await res.json()) as {
        receipts?: GoodsReceiptDTO[];
        payments?: SupplierPaymentDTO[];
        suppliers?: SupplierDTO[];
        books?: InventoryItemDTO[];
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? 'Bạn không có quyền truy cập phân hệ Nhập hàng.');
        return;
      }
      setReceipts(data.receipts ?? []);
      setPayments(data.payments ?? []);
      setSuppliers(data.suppliers ?? []);
      setBooks(data.books ?? []);
      if (!supplierId && data.suppliers?.length) setSupplierId(data.suppliers[0].id);
      if (!paySupplierId && data.suppliers?.length) setPaySupplierId(data.suppliers[0].id);
      if (!bookId && data.books?.length) {
        setBookId(data.books[0].bookId);
        setUnitCost(String(data.books[0].costPrice));
      }
    } catch {
      setError('Không thể kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleCreateReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);
    const res = await fetch('/api/imports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supplierId,
        items: [{ bookId, quantity: Number(quantity), unitCost: Number(unitCost) }],
        paidAmount: Number(paidAmount),
        note,
      }),
    });
    const data = (await res.json()) as { receipt?: GoodsReceiptDTO; error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể lập phiếu nhập.');
      return;
    }
    setNote('');
    setPaidAmount('0');
    setFeedback(`Đã lập phiếu nhập ${data.receipt?.receiptCode} và tự động cộng tồn kho.`);
    await loadData();
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);
    const res = await fetch('/api/imports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'payment',
        supplierId: paySupplierId,
        amount: Number(payAmount),
        paymentMethod: payMethod,
      }),
    });
    const data = (await res.json()) as { payment?: SupplierPaymentDTO; error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể ghi nhận thanh toán NCC.');
      return;
    }
    setPayAmount('');
    setFeedback(`Đã lập phiếu chi ${data.payment?.paymentCode} thanh toán công nợ NCC.`);
    await loadData();
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <PackagePlus className="w-6 h-6 text-indigo-600" /> Quản Lý Nhập Hàng & Công Nợ NCC
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Lập phiếu nhập kho (tự động cộng tồn kho), tra cứu lịch sử nhập và thanh toán công nợ nhà cung cấp.
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleCreateReceipt} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <PackagePlus className="w-4 h-4 text-indigo-600" /> Lập phiếu nhập kho mới
          </h2>
          <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white">
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <select
            value={bookId}
            onChange={(e) => {
              setBookId(e.target.value);
              const found = books.find((b) => b.bookId === e.target.value);
              if (found) setUnitCost(String(found.costPrice));
            }}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
          >
            {books.map((b) => (
              <option key={b.bookId} value={b.bookId}>
                {b.title} (Tồn hiện tại: {b.stockQuantity})
              </option>
            ))}
          </select>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-600">Số lượng nhập</label>
              <input type="number" min={1} required value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600">Đơn giá nhập</label>
              <input type="number" min={0} required value={unitCost} onChange={(e) => setUnitCost(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600">Trả trước NCC</label>
              <input type="number" min={0} value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
            </div>
          </div>
          <input type="text" placeholder="Ghi chú đợt nhập..." value={note} onChange={(e) => setNote(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
          <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold">
            Xác nhận nhập kho
          </button>
        </form>

        <form onSubmit={handleRecordPayment} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-emerald-600" /> Ghi nhận thanh toán công nợ NCC
          </h2>
          <select value={paySupplierId} onChange={(e) => setPaySupplierId(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white">
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — Đang nợ: {formatCurrency(s.currentDebt)}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" min={1000} required placeholder="Số tiền thanh toán (VNĐ)" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
            <select value={payMethod} onChange={(e) => setPayMethod(e.target.value as PaymentMethod)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white">
              <option value="BANK_TRANSFER">Chuyển khoản</option>
              <option value="CASH">Tiền mặt</option>
            </select>
          </div>
          <button type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold">
            Lập phiếu chi thanh toán NCC
          </button>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 mb-2">Phiếu chi gần đây ({payments.length})</p>
            <div className="space-y-1.5 max-h-28 overflow-y-auto">
              {payments.map((p) => (
                <div key={p.id} className="flex justify-between text-[11px] bg-slate-50 px-2.5 py-1.5 rounded-lg">
                  <span className="font-mono text-slate-700">{p.paymentCode} · {p.supplierName}</span>
                  <span className="font-bold text-emerald-700">{formatCurrency(p.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Receipts table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Đang tải danh sách phiếu nhập...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3 px-4 font-semibold">Mã phiếu</th>
                <th className="py-3 px-4 font-semibold">Nhà cung cấp</th>
                <th className="py-3 px-4 font-semibold">Chi tiết sách nhập</th>
                <th className="py-3 px-4 font-semibold text-right">Tổng tiền</th>
                <th className="py-3 px-4 font-semibold text-right">Còn nợ</th>
                <th className="py-3 px-4 font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {receipts.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                    {r.receiptCode}
                    <span className="block text-[10px] font-sans font-normal text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString('vi-VN')} · {r.staffName}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{r.supplierName}</td>
                  <td className="py-3 px-4 text-slate-600">
                    {r.items.map((i) => `${i.bookTitle} (x${i.quantity})`).join(', ')}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-800">{formatCurrency(r.totalAmount)}</td>
                  <td className="py-3 px-4 text-right font-bold text-rose-600">{formatCurrency(r.remainingDebt)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                      r.paymentStatus === 'PAID'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : r.paymentStatus === 'PARTIAL'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {r.paymentStatus === 'PAID' ? 'Đã thanh toán' : r.paymentStatus === 'PARTIAL' ? 'Trả một phần' : 'Chưa thanh toán'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
