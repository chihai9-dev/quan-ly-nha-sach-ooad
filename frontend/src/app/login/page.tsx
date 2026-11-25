'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, ShieldCheck, KeyRound, AlertCircle, CheckCircle2, UserCog } from 'lucide-react';

interface DemoActor {
  username: string;
  password: string;
  role: string;
  description: string;
  badgeColor: string;
}

const DEMO_ACTORS: DemoActor[] = [
  {
    username: 'quanly',
    password: '123456',
    role: 'Quản lý',
    description: 'Bán hàng, Kho, Nhập hàng, NCC, Khuyến mãi, Nhân viên, Báo cáo',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    username: 'banhang',
    password: '123456',
    role: 'Nhân viên bán hàng',
    description: 'Quản lý bán hàng (POS, Hóa đơn, Đổi trả) & Khách hàng',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    username: 'thukho',
    password: '123456',
    role: 'Nhân viên kho',
    description: 'Quản lý sách, Danh mục sách, Kiểm kê kho & Nhập hàng',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [tenDangNhap, setTenDangNhap] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Quên mật khẩu
  const [showForgot, setShowForgot] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  const performLogin = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenDangNhap: username, matKhau: password }),
      });
      const data = (await res.json()) as { message?: string; error?: string };

      if (!res.ok) {
        setError(data.error ?? 'Đăng nhập thất bại.');
        return;
      }

      setSuccess(data.message ?? 'Đăng nhập thành công.');
      window.dispatchEvent(new Event('auth-changed'));
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 400);
    } catch {
      setError('Không thể kết nối máy chủ xác thực.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin(tenDangNhap, matKhau);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);
    setError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenDangNhap, emailKhoiPhuc: recoveryEmail }),
      });
      const data = (await res.json()) as {
        message?: string;
        recoveryOtpHint?: string;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? 'Lỗi khôi phục mật khẩu.');
        return;
      }
      setForgotMsg(`${data.message} (Mã OTP mẫu: ${data.recoveryOtpHint})`);
    } catch {
      setError('Không thể kết nối máy chủ.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Cột trái: Form đăng nhập */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Đăng nhập Hệ thống</h1>
              <p className="text-xs text-slate-500">Use Case: Người dùng hệ thống</p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {!showForgot ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  required
                  value={tenDangNhap}
                  onChange={(e) => setTenDangNhap(e.target.value)}
                  placeholder="Ví dụ: quanly, banhang, thukho"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  required
                  value={matKhau}
                  onChange={(e) => setMatKhau(e.target.value)}
                  placeholder="Mật khẩu mẫu: 123456"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Đang xác thực...' : 'Đăng nhập'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="w-full text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center justify-center gap-1 pt-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Quên mật khẩu?</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-slate-600">
                Nhập tên đăng nhập và email khôi phục để nhận mã OTP.
              </p>
              {forgotMsg && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
                  {forgotMsg}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  required
                  value={tenDangNhap}
                  onChange={(e) => setTenDangNhap(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email khôi phục
                </label>
                <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="quanly@bookstore.vn"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="flex-1 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
                >
                  Gửi mã OTP
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Cột phải: Chọn nhanh Actor từ Sơ đồ Use Case */}
        <div className="bg-slate-50 p-6 sm:p-8 border-t md:border-t-0 md:border-l border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <UserCog className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-800">
              Đăng nhập nhanh theo Actor (Sơ đồ Use Case)
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Cả 4 tài khoản con đều kế thừa quyền cơ bản của Actor cha{' '}
            <strong className="text-slate-700">Người dùng hệ thống</strong> (mật khẩu chung:{' '}
            <code className="bg-slate-200 px-1 rounded">123456</code>).
          </p>

          <div className="space-y-2.5">
            {DEMO_ACTORS.map((actor) => (
              <button
                key={actor.username}
                type="button"
                disabled={loading}
                onClick={() => {
                  setTenDangNhap(actor.username);
                  setMatKhau(actor.password);
                  void performLogin(actor.username, actor.password);
                }}
                className="w-full text-left p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full border ${actor.badgeColor}`}
                  >
                    {actor.role}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {actor.username} / {actor.password}
                  </span>
                </div>
                <p className="text-xs text-slate-600 pt-1">{actor.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
