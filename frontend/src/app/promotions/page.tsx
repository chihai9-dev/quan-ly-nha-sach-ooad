'use client';

import React, { useEffect, useState } from 'react';
import { Tag, Ticket, Plus, StopCircle, AlertCircle } from 'lucide-react';
import type { DiscountCouponDTO, PromotionCampaignDTO } from '@/types/dtos';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<PromotionCampaignDTO[]>([]);
  const [coupons, setCoupons] = useState<DiscountCouponDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Campaign form
  const [name, setName] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENT' | 'FIXED'>('PERCENT');
  const [discountValue, setDiscountValue] = useState('10');
  const [scope, setScope] = useState<'ALL' | 'CATEGORY' | 'BOOK'>('ALL');
  const [startDate, setStartDate] = useState('2026-11-25');
  const [endDate, setEndDate] = useState('2026-12-31');

  // Coupon form
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('25000');
  const [minOrder, setMinOrder] = useState('150000');
  const [maxUses, setMaxUses] = useState('50');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/promotions', { cache: 'no-store' });
      const data = (await res.json()) as {
        promotions?: PromotionCampaignDTO[];
        coupons?: DiscountCouponDTO[];
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? 'Vui lòng đăng nhập để xem khuyến mãi.');
        return;
      }
      setPromotions(data.promotions ?? []);
      setCoupons(data.coupons ?? []);
    } catch {
      setError('Không thể kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleAddCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);
    const res = await fetch('/api/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'campaign',
        name,
        discountType,
        discountValue: Number(discountValue),
        scope,
        startDate,
        endDate,
      }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể tạo chương trình khuyến mãi.');
      return;
    }
    setName('');
    setFeedback('Đã tạo chương trình khuyến mãi mới.');
    await loadData();
  };

  const handleStopCampaign = async (id: string) => {
    const res = await fetch('/api/promotions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) await loadData();
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);
    const res = await fetch('/api/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'coupon',
        code: couponCode,
        discountAmount: Number(couponDiscount),
        minOrderAmount: Number(minOrder),
        maxUses: Number(maxUses),
        expiryDate,
      }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể phát hành mã giảm giá.');
      return;
    }
    setCouponCode('');
    setFeedback('Đã phát hành mã giảm giá mới.');
    await loadData();
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Tag className="w-6 h-6 text-indigo-600" /> Quản Lý Khuyến Mãi & Mã Giảm Giá
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Thiết lập chiến dịch ưu đãi và phát hành mã coupon áp dụng trực tiếp tại quầy POS (Dành cho Quản lý).
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

      {/* Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleAddCampaign} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 h-fit">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-indigo-600" /> Tạo chương trình khuyến mãi
          </h2>
          <input type="text" required placeholder="Tên chương trình KM" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
          <div className="grid grid-cols-2 gap-2">
            <select value={discountType} onChange={(e) => setDiscountType(e.target.value as 'PERCENT' | 'FIXED')} className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white">
              <option value="PERCENT">Giảm theo %</option>
              <option value="FIXED">Giảm tiền cố định</option>
            </select>
            <input type="number" min={1} required value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="px-3 py-2 text-xs border border-slate-300 rounded-lg" />
          </div>
          <select value={scope} onChange={(e) => setScope(e.target.value as 'ALL' | 'CATEGORY' | 'BOOK')} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white">
            <option value="ALL">Phạm vi: Toàn cửa hàng</option>
            <option value="CATEGORY">Phạm vi: Theo danh mục</option>
            <option value="BOOK">Phạm vi: Theo đầu sách</option>
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-2.5 py-2 text-xs border border-slate-300 rounded-lg" />
            <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-2.5 py-2 text-xs border border-slate-300 rounded-lg" />
          </div>
          <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold">
            Lưu chương trình KM
          </button>
        </form>

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-slate-400 text-sm">Đang tải...</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">Chương trình</th>
                  <th className="py-3 px-4 font-semibold">Mức giảm</th>
                  <th className="py-3 px-4 font-semibold">Thời gian</th>
                  <th className="py-3 px-4 font-semibold">Trạng thái</th>
                  <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {promotions.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] font-bold text-indigo-600">{p.code}</span>
                      <p className="font-semibold text-slate-800">{p.name}</p>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-700">
                      {p.discountType === 'PERCENT' ? `${p.discountValue}%` : formatCurrency(p.discountValue)}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {p.startDate} → {p.endDate}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        p.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : p.status === 'UPCOMING'
                          ? 'bg-sky-50 text-sky-700 border-sky-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {p.status !== 'STOPPED' && (
                        <button
                          type="button"
                          onClick={() => void handleStopCampaign(p.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50"
                        >
                          <StopCircle className="w-3 h-3" /> Ngừng
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Coupons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleAddCoupon} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 h-fit">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-emerald-600" /> Phát hành mã giảm giá (Voucher)
          </h2>
          <input type="text" required placeholder="Mã voucher (VD: SALE30K)" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg uppercase font-mono" />
          <div className="grid grid-cols-2 gap-2">
            <input type="number" min={1000} required placeholder="Số tiền giảm" value={couponDiscount} onChange={(e) => setCouponDiscount(e.target.value)} className="px-3 py-2 text-xs border border-slate-300 rounded-lg" />
            <input type="number" min={0} required placeholder="Đơn tối thiểu" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} className="px-3 py-2 text-xs border border-slate-300 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" min={1} required placeholder="Lượt dùng tối đa" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} className="px-3 py-2 text-xs border border-slate-300 rounded-lg" />
            <input type="date" required value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="px-2.5 py-2 text-xs border border-slate-300 rounded-lg" />
          </div>
          <button type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold">
            Phát hành mã
          </button>
        </form>

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3 px-4 font-semibold">Mã Voucher</th>
                <th className="py-3 px-4 font-semibold text-right">Giảm giá</th>
                <th className="py-3 px-4 font-semibold text-right">Đơn tối thiểu</th>
                <th className="py-3 px-4 font-semibold text-right">Đã dùng</th>
                <th className="py-3 px-4 font-semibold">Hạn dùng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600">{c.code}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-700">{formatCurrency(c.discountAmount)}</td>
                  <td className="py-3 px-4 text-right text-slate-600">{formatCurrency(c.minOrderAmount)}</td>
                  <td className="py-3 px-4 text-right font-mono">{c.usedCount}/{c.maxUses}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{c.expiryDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
