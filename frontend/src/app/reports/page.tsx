'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Package, Truck, AlertCircle } from 'lucide-react';
import type { FullReportDTO } from '@/types/dtos';

export default function ReportsPage() {
  const [report, setReport] = useState<FullReportDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/reports', { cache: 'no-store' });
        const data = (await res.json()) as { report?: FullReportDTO; error?: string };
        if (!res.ok) {
          setError(data.error ?? 'Chỉ Quản lý mới có quyền xem Thống kê – Báo cáo.');
          return;
        }
        setReport(data.report ?? null);
      } catch {
        setError('Không thể kết nối máy chủ.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" /> Thống Kê – Báo Cáo Kinh Doanh
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Tổng hợp doanh thu, sách bán chạy, giá trị tồn kho và công nợ nhà cung cấp (Dành cho Quản lý).
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-xl border border-slate-200">
          Đang tổng hợp số liệu báo cáo...
        </div>
      ) : report ? (
        <>
          {/* Summary KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500">Doanh thu thuần</p>
              <p className="text-xl font-bold text-emerald-700 mt-1">{formatCurrency(report.netRevenue)}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{report.totalOrders} hóa đơn · Hoàn trả {formatCurrency(report.totalRefunds)}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500">Giá trị tồn kho (giá vốn)</p>
              <p className="text-xl font-bold text-indigo-700 mt-1">{formatCurrency(report.inventory.totalInventoryValue)}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{report.inventory.totalUnits} cuốn ({report.inventory.totalTitles} đầu sách)</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500">Cảnh báo tồn kho</p>
              <p className="text-xl font-bold text-amber-600 mt-1">
                {report.inventory.lowStockCount} sắp hết · {report.inventory.overstockCount} dư tồn
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Theo ngưỡng Min / Max</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500">Tổng công nợ NCC còn lại</p>
              <p className="text-xl font-bold text-rose-600 mt-1">{formatCurrency(report.supplierDebt.totalRemainingDebt)}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Trên tổng nhập {formatCurrency(report.supplierDebt.totalImported)}</p>
            </div>
          </div>

          {/* Revenue by payment method + Bestsellers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> Doanh thu theo phương thức thanh toán
              </h2>
              <div className="space-y-2.5">
                {report.revenueByMethod.map((m) => {
                  const pct = report.totalRevenue > 0 ? Math.round((m.revenue / report.totalRevenue) * 100) : 0;
                  return (
                    <div key={m.method} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-700">{m.label} ({m.orderCount} đơn)</span>
                        <span className="font-bold text-slate-900">{formatCurrency(m.revenue)} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-indigo-600" /> Top sách bán chạy
              </h2>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="py-2 px-3 font-semibold">Đầu sách</th>
                    <th className="py-2 px-3 font-semibold text-right">Đã bán</th>
                    <th className="py-2 px-3 font-semibold text-right">Doanh thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.bestsellers.map((b) => (
                    <tr key={b.bookId}>
                      <td className="py-2 px-3 font-medium text-slate-800">{b.title}</td>
                      <td className="py-2 px-3 text-right font-bold text-indigo-600">{b.soldQuantity}</td>
                      <td className="py-2 px-3 text-right font-semibold text-slate-800">{formatCurrency(b.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Supplier Debt table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-rose-600" /> Báo cáo công nợ Nhà cung cấp
            </h2>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Nhà cung cấp</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Tổng tiền nhập</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Đã thanh toán</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Dư nợ còn lại</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.supplierDebt.suppliers.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{s.name}</td>
                    <td className="py-2.5 px-3 text-right text-slate-700">{formatCurrency(s.totalImported)}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-700 font-medium">{formatCurrency(s.totalPaid)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-rose-600">{formatCurrency(s.currentDebt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}
