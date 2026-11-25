'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Warehouse,
  AlertTriangle,
  ClipboardCheck,
  Trash2,
  Ban,
  RotateCw,
  Tag,
  AlertCircle,
} from 'lucide-react';
import type { InventoryItemDTO, StockAuditDTO } from '@/types/dtos';

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItemDTO[]>([]);
  const [audits, setAudits] = useState<StockAuditDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [mode, setMode] = useState<'writeOff' | 'audit'>('writeOff');

  // Damaged write-off form
  const [damagedBookId, setDamagedBookId] = useState('');
  const [damagedQty, setDamagedQty] = useState('1');
  const [damagedReason, setDamagedReason] = useState('Hư hỏng không thể bán (rách bìa, ẩm mốc, mất trang)');

  // Stock audit form
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
      if (data.items?.length) {
        if (!damagedBookId) setDamagedBookId(data.items[0].bookId);
        if (!auditBookId) {
          setAuditBookId(data.items[0].bookId);
          setActualQty(String(data.items[0].stockQuantity));
        }
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

  const handleWriteOff = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);
    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'writeOff',
        bookId: damagedBookId,
        damagedQuantity: Number(damagedQty),
        reason: damagedReason,
      }),
    });
    const data = (await res.json()) as { audit?: StockAuditDTO; error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể lập phiếu xuất hủy.');
      return;
    }
    setDamagedQty('1');
    setFeedback(
      `Đã lập phiếu xuất hủy ${data.audit?.auditCode}, trừ tồn kho và ghi nhận thất thoát ${formatCurrency(data.audit?.lossValue ?? 0)}.`
    );
    await loadData();
  };

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

  const handleToggleDiscontinued = async (item: InventoryItemDTO) => {
    setError(null);
    setFeedback(null);
    const res = await fetch('/api/inventory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggleStatus', bookId: item.bookId }),
    });
    const data = (await res.json()) as { item?: InventoryItemDTO; error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể đổi trạng thái kinh doanh.');
      return;
    }
    setFeedback(
      data.item?.businessStatus === 'DISCONTINUED'
        ? `Đã chuyển "${item.title}" sang trạng thái Ngừng kinh doanh (vẫn giữ lịch sử trong DB).`
        : `Đã mở kinh doanh lại cho "${item.title}".`
    );
    await loadData();
  };

  const handleClearancePrice = async (item: InventoryItemDTO) => {
    const suggested = Math.round((item.price * 0.8) / 1000) * 1000;
    const raw = window.prompt(
      `Nhập giá bán thanh lý mới cho "${item.title}" (Giá hiện tại: ${item.price.toLocaleString('vi-VN')} đ):`,
      String(suggested)
    );
    if (!raw) return;
    const newPrice = Number(raw);
    if (Number.isNaN(newPrice) || newPrice < 0) {
      setError('Giá bán mới không hợp lệ.');
      return;
    }
    const res = await fetch('/api/inventory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updatePrice', bookId: item.bookId, price: newPrice }),
    });
    if (res.ok) {
      setFeedback(`Đã cập nhật giá bán mới cho "${item.title}": ${formatCurrency(newPrice)}.`);
      await loadData();
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const lowCount = items.filter((i) => i.alertStatus === 'LOW' && i.businessStatus === 'SELLING').length;
  const overCount = items.filter((i) => i.alertStatus === 'OVERSTOCK' && i.businessStatus === 'SELLING').length;
  const totalLoss = audits.reduce((sum, a) => sum + (a.lossValue ?? 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Warehouse className="w-6 h-6 text-indigo-600" /> Quản Lý Kho, Xuất Hủy & Thanh Lý Tồn Chậm
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Theo dõi tồn kho, xuất hủy sách hư hỏng (trừ tồn + lưu vết thất thoát), đẩy hàng tồn chậm và ngừng kinh doanh đầu sách cũ.
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

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500">Tổng đầu sách</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{items.length}</p>
        </div>
        <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
          <p className="text-xs text-rose-700 font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Sắp hết hàng
          </p>
          <p className="text-2xl font-bold text-rose-700 mt-1">{lowCount}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
          <p className="text-xs text-amber-700 font-semibold">Tồn quá mức / Cần đẩy hàng</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{overCount}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-600 font-semibold">Thất thoát / Xuất hủy (giá vốn)</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalLoss)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Write-off / Audit forms */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 h-fit">
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode('writeOff')}
              className={`py-1.5 rounded-md flex items-center justify-center gap-1 ${
                mode === 'writeOff' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" /> Xuất hủy hỏng
            </button>
            <button
              type="button"
              onClick={() => setMode('audit')}
              className={`py-1.5 rounded-md flex items-center justify-center gap-1 ${
                mode === 'audit' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5" /> Kiểm kê kho
            </button>
          </div>

          {mode === 'writeOff' ? (
            <form onSubmit={handleWriteOff} className="space-y-3">
              <p className="text-[11px] text-slate-500">
                Lập phiếu điều chỉnh xuất hủy cho sách bị rách, ẩm mốc, mất trang → tự động trừ tồn kho và lưu vết thất thoát.
              </p>
              <select
                value={damagedBookId}
                onChange={(e) => setDamagedBookId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                {items.map((i) => (
                  <option key={i.bookId} value={i.bookId}>
                    {i.title} (Tồn: {i.stockQuantity})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                required
                placeholder="Số lượng sách hỏng cần xuất hủy"
                value={damagedQty}
                onChange={(e) => setDamagedQty(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
              <input
                type="text"
                required
                placeholder="Nguyên nhân hư hỏng"
                value={damagedReason}
                onChange={(e) => setDamagedReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
              <button
                type="submit"
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
              >
                Xác nhận xuất hủy & trừ tồn kho
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreateAudit} className="space-y-3">
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
                placeholder="Lý do chênh lệch"
                value={auditReason}
                onChange={(e) => setAuditReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
              >
                Lưu phiếu kiểm kê
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-semibold text-slate-500">
              Lịch sử kiểm kê & xuất hủy ({audits.length})
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {audits.map((a) => (
                <div key={a.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px]">
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span className="font-mono">
                      {a.auditCode}{' '}
                      {a.adjustmentType === 'DAMAGED_WRITE_OFF' && (
                        <span className="text-[10px] text-rose-600 font-sans">(Xuất hủy)</span>
                      )}
                    </span>
                    <span className={a.totalDiscrepancy === 0 ? 'text-emerald-600' : 'text-rose-600'}>
                      {a.totalDiscrepancy > 0 ? `+${a.totalDiscrepancy}` : a.totalDiscrepancy}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    {a.items.map((x) => `${x.bookTitle} (${x.systemQuantity}→${x.actualQuantity})`).join(', ')}
                  </p>
                  {a.lossValue > 0 && (
                    <p className="text-rose-600 font-medium mt-0.5">
                      Thất thoát: {formatCurrency(a.lossValue)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Stock table with Clearance & Discontinue actions */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">Đang tải dữ liệu tồn kho...</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">Đầu sách</th>
                  <th className="py-3 px-4 font-semibold text-right">Giá bán</th>
                  <th className="py-3 px-4 font-semibold text-right">Tồn kho</th>
                  <th className="py-3 px-4 font-semibold">Trạng thái</th>
                  <th className="py-3 px-4 font-semibold text-right">Xử lý tồn cũ / Ngừng bán</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr
                    key={item.bookId}
                    className={item.businessStatus === 'DISCONTINUED' ? 'bg-slate-50/80 opacity-75' : 'hover:bg-slate-50/70'}
                  >
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{item.title}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {item.isbn} · Min/Max: {item.minStockThreshold}/{item.maxStockThreshold}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-700">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">{item.stockQuantity}</td>
                    <td className="py-3 px-4 space-y-1">
                      {item.businessStatus === 'DISCONTINUED' ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200 text-slate-700">
                          Ngừng kinh doanh
                        </span>
                      ) : item.alertStatus === 'LOW' ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          Sắp hết — Cần nhập
                        </span>
                      ) : item.alertStatus === 'OVERSTOCK' ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Tồn chậm — Cần đẩy KM
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Đang kinh doanh
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {item.businessStatus === 'SELLING' && (
                          <>
                            <button
                              type="button"
                              onClick={() => void handleClearancePrice(item)}
                              className="px-2 py-1 rounded border border-indigo-200 bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100"
                              title="Điều chỉnh giá bán thanh lý"
                            >
                              Đổi giá
                            </button>
                            {item.alertStatus === 'OVERSTOCK' && (
                              <Link
                                href="/promotions"
                                className="inline-flex items-center gap-1 px-2 py-1 rounded border border-amber-200 bg-amber-50 text-amber-700 font-semibold hover:bg-amber-100"
                                title="Tạo khuyến mãi đẩy hàng"
                              >
                                <Tag className="w-3 h-3" /> Tạo KM
                              </Link>
                            )}
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => void handleToggleDiscontinued(item)}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded border font-semibold ${
                            item.businessStatus === 'DISCONTINUED'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {item.businessStatus === 'DISCONTINUED' ? (
                            <>
                              <RotateCw className="w-3 h-3" /> Mở bán
                            </>
                          ) : (
                            <>
                              <Ban className="w-3 h-3" /> Ngừng bán
                            </>
                          )}
                        </button>
                      </div>
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
