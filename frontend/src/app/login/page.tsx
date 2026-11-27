'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';

const DEMO_ACTORS = [
  { username: 'quanly', password: '123456', role: 'Quản lý' },
  { username: 'banhang', password: '123456', role: 'Nhân viên bán hàng' },
  { username: 'thukho', password: '123456', role: 'Nhân viên kho' },
];

export default function LoginPage() {
  const router = useRouter();
  const [tenDangNhap, setTenDangNhap] = useState('quanly');
  const [matKhau, setMatKhau] = useState('123456');
  const [branch, setBranch] = useState('Nhà sách Nguyễn Văn Cừ (Quận 5)');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      }, 300);
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
    <div className="min-h-screen bg-[#f6f6f1] grid place-items-center p-5">
      <div className="w-full max-w-[960px] min-h-[560px] bg-white border border-[#e7e6dc] rounded-[20px] shadow-[0_16px_40px_-10px_rgba(29,70,48,0.12)] grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Cột trái: Thương hiệu mộc. giống UI/dang-nhap.html */}
        <div className="md:col-span-6 bg-gradient-to-br from-[#1d4630] via-[#24533a] to-[#2f6648] text-white p-10 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-[10px] bg-white text-[#24533a] grid place-items-center">
              <BookOpen className="w-5 h-5" />
            </span>
            <span>
              <b className="block text-2xl leading-none tracking-[-0.02em]">mộc.</b>
              <small className="text-[10px] tracking-[0.14em] text-white/75 uppercase">
                Quản lý nhà sách
              </small>
            </span>
          </div>

          <div className="my-10">
            <div className="text-[28px] font-bold leading-[1.3] tracking-[-0.02em] mb-3.5">
              Mỗi cuốn sách,
              <br />
              một khởi đầu mới.
            </div>
            <p className="text-white/80 text-[13.5px] leading-relaxed max-w-[380px]">
              Đồng hành cùng nhân viên và quản lý nhà sách trong từng giao dịch tại quầy, kiểm soát
              tồn kho thông minh và quản lý công nợ minh bạch.
            </p>
          </div>

          <div className="text-[11px] text-white/60">
            Phiên bản 2.4 · Thiết kế dành riêng cho nhà sách mộc.
          </div>

          <div className="absolute -right-14 -bottom-14 w-56 h-56 rounded-full bg-white/[0.04] pointer-events-none" />
        </div>

        {/* Cột phải: Form đăng nhập */}
        <div className="md:col-span-6 p-10 sm:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h1 className="text-[22px] font-bold tracking-[-0.02em] text-[#1e2a23]">
              {showForgot ? 'Khôi phục mật khẩu' : 'Đăng nhập ca làm việc'}
            </h1>
            <p className="text-[13px] text-[#737a72] mt-1">
              {showForgot
                ? 'Nhập tên đăng nhập và email khôi phục để nhận mã OTP.'
                : 'Nhập tài khoản được cấp để bắt đầu ca.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-[8px] bg-[#fae6e0] text-[#b4472f] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-[8px] bg-[#eff4ee] text-[#2f6648] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}
          {forgotMsg && (
            <div className="mb-4 p-3 rounded-[8px] bg-[#eff4ee] text-[#2f6648] text-xs">
              {forgotMsg}
            </div>
          )}

          {!showForgot ? (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#3b453f] mb-1.5">
                  Tên đăng nhập *
                </label>
                <input
                  type="text"
                  required
                  value={tenDangNhap}
                  onChange={(e) => setTenDangNhap(e.target.value)}
                  placeholder="VD: quanly, banhang, thukho"
                  className="w-full h-9 px-3 text-[13px] border border-[#e7e6dc] rounded-[8px] focus:outline-none focus:border-[#3f7a58] focus:ring-2 focus:ring-[#eff4ee]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b453f] mb-1.5">
                  Mật khẩu *
                </label>
                <input
                  type="password"
                  required
                  value={matKhau}
                  onChange={(e) => setMatKhau(e.target.value)}
                  className="w-full h-9 px-3 text-[13px] border border-[#e7e6dc] rounded-[8px] focus:outline-none focus:border-[#3f7a58] focus:ring-2 focus:ring-[#eff4ee]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b453f] mb-1.5">
                  Chi nhánh làm việc
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full h-9 px-3 text-[13px] border border-[#e7e6dc] rounded-[8px] bg-white focus:outline-none focus:border-[#3f7a58]"
                >
                  <option>Nhà sách Nguyễn Văn Cừ (Quận 5)</option>
                  <option>Nhà sách Hai Bà Trưng (Quận 1)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-[#3b453f] cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#24533a]" />
                  <span>Ghi nhớ ca làm việc</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-xs font-semibold text-[#24533a] hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-2 rounded-[8px] bg-[#24533a] hover:bg-[#1d4630] disabled:opacity-60 text-white text-sm font-semibold transition-colors"
              >
                {loading ? 'Đang đăng nhập...' : 'Bắt đầu ca làm việc'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#3b453f] mb-1.5">
                  Tên đăng nhập *
                </label>
                <input
                  type="text"
                  required
                  value={tenDangNhap}
                  onChange={(e) => setTenDangNhap(e.target.value)}
                  className="w-full h-9 px-3 text-[13px] border border-[#e7e6dc] rounded-[8px]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#3b453f] mb-1.5">
                  Email khôi phục *
                </label>
                <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="quanly@bookstore.vn"
                  className="w-full h-9 px-3 text-[13px] border border-[#e7e6dc] rounded-[8px]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="flex-1 h-10 rounded-[8px] border border-[#e7e6dc] text-xs font-semibold text-[#3b453f]"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-[8px] bg-[#24533a] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Gửi mã OTP
                </button>
              </div>
            </form>
          )}

          {/* Demo pill giống UI/dang-nhap.html */}
          <div className="mt-5 bg-[#fafaf6] border border-dashed border-[#e7e6dc] rounded-[8px] p-3 text-[11.5px] text-[#737a72] space-y-1.5">
            <b className="text-[#1e2a23] block">Tài khoản thử nghiệm (bấm để điền nhanh):</b>
            <div className="flex flex-wrap gap-1.5">
              {DEMO_ACTORS.map((a) => (
                <button
                  key={a.username}
                  type="button"
                  onClick={() => {
                    setTenDangNhap(a.username);
                    setMatKhau(a.password);
                  }}
                  className="px-2.5 py-1 rounded-[6px] border border-[#e7e6dc] bg-white hover:bg-[#eff4ee] hover:border-[#24533a] text-[#1e2a23] font-medium transition-colors"
                >
                  {a.role}: <code className="font-mono text-[#24533a]">{a.username}</code>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
