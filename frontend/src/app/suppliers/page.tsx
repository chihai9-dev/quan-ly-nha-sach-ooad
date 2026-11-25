'use client';

import React, { useEffect, useState } from 'react';
import { Truck, Plus, AlertCircle } from 'lucide-react';
import type { SupplierDTO } from '@/types/dtos';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [bankAccount, setBankAccount] = useState('');

  const loadSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/suppliers', { cache: 'no-store' });
      const data = (await res.json()) as { suppliers?: SupplierDTO[]; error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Không thể tải danh sách nhà cung cấp.');
        return;
      }
      setSuppliers(data.suppliers ?? []);
    } catch {
      setError('Không thể kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSuppliers();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);
    const res = await fetch('/api/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, name, phoneNumber, email, address, bankAccount }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể thêm nhà cung cấp.');
      return;
    }
    setCode('');
    setName('');
    setPhoneNumber('');
    setEmail('');
    setAddress('');
    setBankAccount('');
    setFeedback('Đã thêm nhà cung cấp mới.');
    await loadSuppliers();
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Truck className="w-6 h-6 text-indigo-600" /> Quản Lý Nhà Cung Cấp
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Quản lý hồ sơ đối tác cung cấp sách, tài khoản thanh toán và tổng công nợ hiện tại.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleAdd} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 h-fit">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-indigo-600" /> Thêm Nhà cung cấp
          </h2>
          <input type="text" placeholder="Mã NCC (tùy chọn)" value={code} onChange={(e) => setCode(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
          <input type="text" required placeholder="Tên đơn vị cung cấp" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
          <input type="text" required placeholder="Số điện thoại" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
          <input type="email" placeholder="Email liên hệ" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
          <input type="text" required placeholder="Địa chỉ" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
          <input type="text" placeholder="Tài khoản ngân hàng" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
          <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold">
            Lưu nhà cung cấp
          </button>
        </form>

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">Đang tải danh sách nhà cung cấp...</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">Nhà cung cấp</th>
                  <th className="py-3 px-4 font-semibold">Liên hệ</th>
                  <th className="py-3 px-4 font-semibold text-right">Tổng nhập</th>
                  <th className="py-3 px-4 font-semibold text-right">Đã trả</th>
                  <th className="py-3 px-4 font-semibold text-right">Công nợ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] font-bold text-indigo-600">{s.code}</span>
                      <p className="font-semibold text-slate-800">{s.name}</p>
                      <p className="text-[11px] text-slate-400">{s.address}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-mono text-slate-700">{s.phoneNumber}</p>
                      <p className="text-[11px] text-slate-400">{s.bankAccount || '—'}</p>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700">{formatCurrency(s.totalImported)}</td>
                    <td className="py-3 px-4 text-right text-emerald-700 font-medium">{formatCurrency(s.totalPaid)}</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-600">{formatCurrency(s.currentDebt)}</td>
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
