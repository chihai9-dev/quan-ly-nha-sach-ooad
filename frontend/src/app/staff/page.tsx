'use client';

import React, { useEffect, useState } from 'react';
import { Briefcase, UserPlus, AlertCircle } from 'lucide-react';
import type { EmploymentStatus, StaffDTO } from '@/types/dtos';

const STATUS_BADGE: Record<EmploymentStatus, { label: string; style: string }> = {
  ACTIVE: { label: 'Đang làm việc', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ON_LEAVE: { label: 'Tạm nghỉ', style: 'bg-amber-50 text-amber-700 border-amber-200' },
  TERMINATED: { label: 'Đã thôi việc', style: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export default function StaffPage() {
  const [staffList, setStaffList] = useState<StaffDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [roleCode, setRoleCode] = useState<StaffDTO['roleCode']>('NHAN_VIEN_BAN_HANG');

  const loadStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/staff', { cache: 'no-store' });
      const data = (await res.json()) as { staff?: StaffDTO[]; error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Chỉ Quản lý mới có quyền truy cập Quản lý nhân viên.');
        return;
      }
      setStaffList(data.staff ?? []);
    } catch {
      setError('Không thể kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStaff();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);
    const res = await fetch('/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, phoneNumber, email, position, roleCode }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Không thể thêm nhân viên.');
      return;
    }
    setFullName('');
    setPhoneNumber('');
    setEmail('');
    setPosition('');
    setFeedback('Đã thêm hồ sơ nhân viên mới.');
    await loadStaff();
  };

  const handleChangeStatus = async (id: string, status: EmploymentStatus) => {
    const res = await fetch('/api/staff', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      await loadStaff();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-indigo-600" /> Quản Lý Nhân Viên
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Quản lý hồ sơ nhân sự, gán vai trò hệ thống và trạng thái làm việc (Dành cho Quản lý).
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
        <form onSubmit={handleAddStaff} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 h-fit">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-indigo-600" /> Thêm nhân viên mới
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
            required
            placeholder="Email công việc"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
          />
          <input
            type="text"
            required
            placeholder="Chức danh (VD: Thu ngân ca chiều)"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
          />
          <select
            value={roleCode}
            onChange={(e) => setRoleCode(e.target.value as StaffDTO['roleCode'])}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="NHAN_VIEN_BAN_HANG">Vai trò: Nhân viên bán hàng</option>
            <option value="NHAN_VIEN_KHO">Vai trò: Nhân viên kho</option>
            <option value="QUAN_LY">Vai trò: Quản lý</option>
          </select>
          <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold">
            Lưu hồ sơ nhân sự
          </button>
        </form>

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">Đang tải danh sách nhân viên...</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">Mã NV</th>
                  <th className="py-3 px-4 font-semibold">Nhân viên</th>
                  <th className="py-3 px-4 font-semibold">Chức vụ / Vai trò</th>
                  <th className="py-3 px-4 font-semibold">Trạng thái</th>
                  <th className="py-3 px-4 font-semibold text-right">Cập nhật</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffList.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600">{s.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{s.fullName}</p>
                      <p className="text-[11px] text-slate-400">{s.phoneNumber} · {s.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-700">{s.position}</p>
                      <span className="text-[11px] text-indigo-600 font-semibold">{s.roleName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_BADGE[s.status].style}`}>
                        {STATUS_BADGE[s.status].label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={s.status}
                        onChange={(e) => void handleChangeStatus(s.id, e.target.value as EmploymentStatus)}
                        className="px-2 py-1 text-[11px] border border-slate-200 rounded-md bg-white"
                      >
                        <option value="ACTIVE">Đang làm việc</option>
                        <option value="ON_LEAVE">Tạm nghỉ</option>
                        <option value="TERMINATED">Thôi việc</option>
                      </select>
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
