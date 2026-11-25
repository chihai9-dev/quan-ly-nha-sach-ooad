'use client';

import React, { useEffect, useState } from 'react';
import { Shield, Save, UserPlus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { AccountSummaryDTO } from '@/services/AuthService';

interface RoleData {
  maVaiTro: string;
  tenVaiTro: string;
  danhSachQuyen: string[];
}

interface PermissionMeta {
  code: string;
  label: string;
  group: string;
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [permissions, setPermissions] = useState<PermissionMeta[]>([]);
  const [accounts, setAccounts] = useState<AccountSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Form tạo tài khoản
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('123456');
  const [newMaNV, setNewMaNV] = useState('');
  const [newHoTen, setNewHoTen] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('NHAN_VIEN_BAN_HANG');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rolesRes, accountsRes] = await Promise.all([
        fetch('/api/roles'),
        fetch('/api/accounts'),
      ]);

      if (!rolesRes.ok) {
        const errData = (await rolesRes.json()) as { error?: string };
        setError(
          errData.error ??
            'Bạn không có quyền truy cập trang này (Yêu cầu vai trò Quản trị viên).'
        );
        return;
      }

      const rolesData = (await rolesRes.json()) as {
        roles: RoleData[];
        availablePermissions: PermissionMeta[];
      };
      setRoles(rolesData.roles);
      setPermissions(rolesData.availablePermissions);

      if (accountsRes.ok) {
        const accData = (await accountsRes.json()) as { accounts: AccountSummaryDTO[] };
        setAccounts(accData.accounts);
      }
    } catch {
      setError('Không thể kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const togglePermission = (maVaiTro: string, permCode: string) => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.maVaiTro !== maVaiTro) return role;
        const exists = role.danhSachQuyen.includes(permCode);
        return {
          ...role,
          danhSachQuyen: exists
            ? role.danhSachQuyen.filter((p) => p !== permCode)
            : [...role.danhSachQuyen, permCode],
        };
      })
    );
  };

  const saveRolePermissions = async (role: RoleData) => {
    setNotice(null);
    setError(null);
    try {
      const res = await fetch(`/api/roles/${role.maVaiTro}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ danhSachQuyen: role.danhSachQuyen }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Cập nhật thất bại.');
        return;
      }
      setNotice(data.message ?? 'Đã cập nhật quyền thành công.');
    } catch {
      setError('Lỗi kết nối.');
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setError(null);
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenDangNhap: newUsername,
          matKhau: newPassword,
          maNV: newMaNV,
          hoTen: newHoTen,
          emailKhoiPhuc: newEmail,
          maVaiTro: newRole,
        }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Tạo tài khoản thất bại.');
        return;
      }
      setNotice(data.message ?? 'Tạo tài khoản thành công.');
      setNewUsername('');
      setNewMaNV('');
      setNewHoTen('');
      setNewEmail('');
      await fetchData();
    } catch {
      setError('Lỗi kết nối.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-600" />
          <span>Quản lý Hệ thống & Phân quyền Actor</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Dành riêng cho Actor <strong>Quản trị viên</strong> — Quản lý 5 vai trò theo Sơ đồ Use Case Tổng quát.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {!loading && roles.length > 0 && (
        <>
          {/* Bảng Phân Quyền 5 Actor */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800 text-sm">
                Ma trận Phân quyền 5 Actor (VaiTro.phanQuyen)
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {roles.map((role) => (
                <div key={role.maVaiTro} className="p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{role.tenVaiTro}</span>
                      <span className="ml-2 text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {role.maVaiTro}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => void saveRolePermissions(role)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Lưu quyền</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {permissions.map((perm) => {
                      const checked = role.danhSachQuyen.includes(perm.code);
                      return (
                        <label
                          key={perm.code}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                            checked
                              ? 'bg-indigo-50/70 border-indigo-300 text-indigo-900 font-medium'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePermission(role.maVaiTro, perm.code)}
                            className="rounded text-indigo-600"
                          />
                          <span className="truncate" title={perm.code}>
                            {perm.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danh sách Tài khoản & Tạo mới */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-800 text-sm">Danh sách Tài khoản Hệ thống</h2>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="py-2.5 px-4">Tên đăng nhập</th>
                    <th className="py-2.5 px-4">Nhân viên</th>
                    <th className="py-2.5 px-4">Vai trò (Actor)</th>
                    <th className="py-2.5 px-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {accounts.map((acc) => (
                    <tr key={acc.tenDangNhap}>
                      <td className="py-2.5 px-4 font-mono font-semibold text-indigo-600">
                        {acc.tenDangNhap}
                      </td>
                      <td className="py-2.5 px-4 text-slate-700">
                        {acc.hoTen} ({acc.maNV})
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                          {acc.tenVaiTro}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        {acc.trangThai ? (
                          <span className="text-emerald-600 font-semibold">Hoạt động</span>
                        ) : (
                          <span className="text-rose-600 font-semibold">Đã khóa</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <form
              onSubmit={handleCreateAccount}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3"
            >
              <h2 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-indigo-600" />
                <span>Cấp Tài khoản Nhân viên</span>
              </h2>
              <input
                type="text"
                required
                placeholder="Tên đăng nhập (vd: banhang02)"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
              <input
                type="password"
                required
                placeholder="Mật khẩu (>= 6 ký tự)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
              <input
                type="text"
                required
                placeholder="Mã nhân viên (vd: NV005)"
                value={newMaNV}
                onChange={(e) => setNewMaNV(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
              <input
                type="text"
                required
                placeholder="Họ tên nhân viên"
                value={newHoTen}
                onChange={(e) => setNewHoTen(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
              <input
                type="email"
                required
                placeholder="Email khôi phục"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
              >
                {roles
                  .filter((r) => r.maVaiTro !== 'NGUOI_DUNG_HE_THONG')
                  .map((r) => (
                    <option key={r.maVaiTro} value={r.maVaiTro}>
                      {r.tenVaiTro}
                    </option>
                  ))}
              </select>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
              >
                Tạo tài khoản
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
