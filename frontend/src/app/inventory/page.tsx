'use client';

import React, { useEffect, useState } from 'react';
import { Warehouse, AlertTriangle, ClipboardCheck, AlertCircle } from 'lucide-react';
import type { InventoryItemDTO, StockAuditDTO } from '@/types/dtos';

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItemDTO[]>([]);
  const [audits, setAudits] = useState<StockAuditDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Quick stock audit form
  const [auditBookId, setAuditBookId] = useState('');
  const [actualQty, setActualQty] = useState('');
  const [auditReason, setAuditReason] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/inventory', { cache: 'no-store' });
      const data = (await res.json()) as {
        items?: InventoryItemDTO[];
        audits?: StockAuditDTO[];
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? 'Bạn không có quyền truy cập Quản lý kho.');
        return;
      }
      setItems(data.items ?? []);
      setAudits(data.audits ?? []);
      if (!auditBookId && data.items?.length) {
        setAuditBookId(data.items[0].bookId);
        setActualQty(String(data.items[0].stockQuantity));
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

  const handleCreateAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);
    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        note: 'Phiếu kiểm kê điều chỉnh tồn kho',
        items: [{ bookId: auditBookId, actualQuantity: Number(actualQty), reason: auditReason }],
      }),
    });
    const data = (await res.json()) as { audit?: StockAuditDTO; error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể lập phiếu kiểm kê.');
      return;
    }
    setAuditReason('');
    setFeedback(`Đã lưu phiếu kiểm kê ${data.audit?.auditCode} và cân bằng lại tồn kho.`);
    await loadData();
  };

  const lowCount = items.filter((i) => i.alertStatus === 'LOW').length;
  const overCount = items.filter((i) => i.alertStatus === 'OVERSTOCK').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Warehouse className="w-6 h-6 text-indigo-600" /> Quản Lý Kho & Kiểm Kê
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Theo dõi tồn kho thời gian thực, cảnh báo mức tồn tối thiểu / tối đa và lập phiếu kiểm kê cân bằng kho.
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

      {/* Alerts KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500">Tổng đầu sách đang theo dõi</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{items.length}</p>
        </div>
        <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
          <p className="text-xs text-rose-700 font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Cảnh báo sắp hết hàng (≤ tối thiểu)
          </p>
          <p className="text-2xl font-bold text-rose-700 mt-1">{lowCount}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
          <p className="text-xs text-amber-700 font-semibold">Cảnh báo tồn quá mức (≥ tối đa)</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{overCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleCreateAudit} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 h-fit">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <ClipboardCheck className="w-4 h-4 text-indigo-600" /> Lập phiếu kiểm kê & cân bằng
          </h2>
          <select
            value={auditBookId}
            onChange={(e) => {
              setAuditBookId(e.target.value);
              const found = items.find((i) => i.bookId === e.target.value);
              if (found) setActualQty(String(found.stockQuantity));
            }}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
          >
            {items.map((i) => (
              <option key={i.bookId} value={i.bookId}>
                {i.title} (Hệ thống: {i.stockQuantity})
              </option>
            ))}
          </select>
          <input
            type="number"
            min={0}
            required
            placeholder="Số lượng đếm thực tế"
            value={actualQty}
            onChange={(e) => setActualQty(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Lý do chênh lệch (VD: Hư hỏng, thất thoát...)"
            value={auditReason}
            onChange={(e) => setAuditReason(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
          />
          <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold">
            Lưu phiếu kiểm kê
          </button>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-semibold text-slate-500">Lịch sử kiểm kê ({audits.length})</p>
            {audits.map((a) => (
              <div key={a.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px]">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span className="font-mono">{a.auditCode}</span>
                  <span className={a.totalDiscrepancy === 0 ? 'text-emerald-600' : 'text-rose-600'}>
                    Chênh lệch: {a.totalDiscrepancy > 0 ? `+${a.totalDiscrepancy}` : a.totalDiscrepancy}
                  </span>
                </div>
                <p className="text-slate-500 mt-0.5">{a.items.map((x) => `${x.bookTitle} (${x.systemQuantity}→${x.actualQuantity})`).join(', ')}</p>
              </div>
            ))}
          </div>
        </form>

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">Đang tải dữ liệu tồn kho...</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">Sách</th>
                  <th className="py-3 px-4 font-semibold text-right">Tồn kho</th>
                  <th className="py-3 px-4 font-semibold text-right">Ngưỡng Min / Max</th>
                  <th className="py-3 px-4 font-semibold">Cảnh báo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.bookId} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{item.title}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{item.isbn} · {item.categoryName}</p>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">{item.stockQuantity}</td>
                    <td className="py-3 px-4 text-right text-slate-500 font-mono">
                      {item.minStockThreshold} / {item.maxStockThreshold}
                    </td>
                    <td className="py-3 px-4">
                      {item.alertStatus === 'LOW' ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          Sắp hết — Cần nhập
                        </span>
                      ) : item.alertStatus === 'OVERSTOCK' ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Tồn quá mức
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          An toàn
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
