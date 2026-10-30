import Link from 'next/link';
import { BookOpen, ShoppingCart, AlertTriangle, TrendingUp, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Welcome */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-100 text-xs font-semibold mb-3 border border-indigo-400/20">
            Đồ Án Môn Học OOAD 2026
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Hệ Thống Quản Lý Nhà Sách
          </h1>
          <p className="mt-3 text-sm text-indigo-100 leading-relaxed">
            Kiến trúc phân tầng (Layered Architecture) chuẩn hóa tư duy Hướng đối tượng (OOP).
            Đóng gói thực thể nghiệp vụ, quản lý kho, quầy bán lẻ POS tự động hóa và tích hợp Supabase BaaS.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/pos"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-sm shadow hover:bg-indigo-50 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Mở quầy POS bán hàng</span>
            </Link>
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/40 text-white font-semibold text-sm hover:bg-indigo-500/60 border border-indigo-400/30 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Tra cứu & Quản lý Kho</span>
            </Link>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-[-40px] bottom-[-40px] opacity-10 pointer-events-none">
          <BookOpen className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Tổng đầu sách</p>
            <h3 className="text-2xl font-bold text-slate-800">6</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">Hoạt động trong kho</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Doanh thu hôm nay</p>
            <h3 className="text-2xl font-bold text-slate-800">1.250.000 đ</h3>
            <p className="text-xs text-slate-400 mt-0.5">3 đơn hoàn tất</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Cảnh báo sắp hết</p>
            <h3 className="text-2xl font-bold text-slate-800">0</h3>
            <p className="text-xs text-slate-400 mt-0.5">Mức kho an toàn</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-violet-50 text-violet-600">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Danh mục sách</p>
            <h3 className="text-2xl font-bold text-slate-800">4</h3>
            <p className="text-xs text-slate-400 mt-0.5">CNTT, Kinh tế, Văn học...</p>
          </div>
        </div>
      </div>

      {/* OOAD Architecture Spotlight */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Đặc Điểm Thiết Kế Hướng Đối Tượng (OOAD) Trong Dự Án
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Các tầng mã nguồn được phân định rành mạch theo Layered Architecture
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
            SOLID Compliant
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Domain Entities (Models)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Các lớp <code className="text-indigo-600 font-mono">Book</code>, <code className="text-indigo-600 font-mono">Order</code>, <code className="text-indigo-600 font-mono">Customer</code> đóng gói toàn bộ quy tắc nghiệp vụ (tính thuế, chiết khấu, trừ tồn kho), bảo vệ tính toàn vẹn của dữ liệu.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Repository Pattern</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tách biệt logic truy xuất dữ liệu thông qua <code className="text-indigo-600 font-mono">IBookRepository</code> và <code className="text-indigo-600 font-mono">IOrderRepository</code>, giúp ứng dụng không phụ thuộc cứng vào cơ sở dữ liệu.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Service Layer</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <code className="text-indigo-600 font-mono">BookService</code> và <code className="text-indigo-600 font-mono">OrderService</code> điều phối các giao dịch nghiệp vụ phức tạp như quy trình Checkout, tự động cập nhật tồn kho và phát hành hóa đơn.
            </p>
          </div>
        </div>

        <div className="pt-2 text-right">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <span>Xem tài liệu thiết kế trong thư mục /docs</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}
