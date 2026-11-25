'use client';

import React, { useEffect, useState } from 'react';
import { Users, Search, UserPlus, Award, AlertCircle } from 'lucide-react';
import type { CustomerDTO, CustomerTier } from '@/types/dtos';

const TIER_STYLES: Record<CustomerTier, string> = {
  STANDARD: 'bg-slate-100 text-slate-700 border-slate-200',
  SILVER: 'bg-sky-50 text-sky-700 border-sky-200',
  GOLD: 'bg-amber-50 text-amber-700 border-amber-200',
  PLATINUM: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerDTO[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const loadCustomers = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const url = query ? `/api/customers?q=${encodeURIComponent(query)}` : '/api/customers';
      const res = await fetch(url, { cache: 'no-store' });
      const data = (await res.json()) as { customers?: CustomerDTO[]; error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Không thể tải danh sách khách hàng.');
        return;
      }
      setCustomers(data.customers ?? []);
    } catch {
      setError('Không thể kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCustomers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    void loadCustomers(search);
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, phoneNumber, email, address }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể thêm khách hàng.');
      return;
    }
    setFullName('');
    setPhoneNumber('');
    setEmail('');
    setAddress('');
    setFeedback('Đã thêm hồ sơ khách hàng mới.');
    await loadCustomers(search);
  };

  const handleAddPoints = async (customer: CustomerDTO, delta: number) => {
    setError(null);
    const res = await fetch('/api/customers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: customer.id, loyaltyPoints: Math.max(0, customer.loyaltyPoints + delta) }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể cập nhật điểm.');
      return;
    }
    await loadCustomers(search);
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" /> Quản Lý Khách Hàng
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý hồ sơ thành viên, điểm tích lũy, hạng thẻ và lịch sử chi tiêu.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, SĐT..."
              className="pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white w-56"
            />
          </div>
          <button type="submit" className="px-3.5 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold">
            Tìm
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleAddCustomer} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 h-fit">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-indigo-600" /> Thêm khách hàng mới
          </h2>
          <input
            type="text"
            required
            placeholder="Họ và tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
          />
          <input
            type="text"
            required
            placeholder="Số điện thoại"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
          />
          <input
            type="email"
            placeholder="Email (tùy chọn)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
          />
          <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold">
            Đăng ký thành viên
          </button>
        </form>

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">Đang tải danh sách khách hàng...</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">Khách hàng</th>
                  <th className="py-3 px-4 font-semibold">Liên hệ</th>
                  <th className="py-3 px-4 font-semibold">Hạng thẻ</th>
                  <th className="py-3 px-4 font-semibold text-right">Điểm</th>
                  <th className="py-3 px-4 font-semibold text-right">Tổng chi tiêu</th>
                  <th className="py-3 px-4 font-semibold text-right">Điều chỉnh điểm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{c.fullName}</p>
                      <p className="text-[11px] text-slate-400">{c.address || 'Chưa cập nhật địa chỉ'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-mono text-slate-700">{c.phoneNumber}</p>
                      <p className="text-[11px] text-slate-400">{c.email || '—'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${TIER_STYLES[c.tier]}`}>
                        <Award className="w-3 h-3" /> {c.tier}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-indigo-600">{c.loyaltyPoints}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700">
                      {formatCurrency(c.totalSpent)}
                      <span className="block text-[10px] text-slate-400">{c.orderCount} đơn hàng</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => void handleAddPoints(c, 50)}
                        className="px-2 py-1 rounded border border-indigo-200 bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100"
                      >
                        +50đ
                      </button>
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
