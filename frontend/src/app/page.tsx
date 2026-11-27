import Link from 'next/link';
import { BookService } from '@/services/BookService';
import { CatalogService } from '@/services/CatalogService';
import { ReportService } from '@/services/ReportService';
import { BookOpen, ShoppingCart, AlertTriangle, TrendingUp, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const bookService = new BookService();
  const catalogService = new CatalogService();
  const reportService = new ReportService();

  const [books, catalog, report] = await Promise.all([
    bookService.getAllBooks(),
    catalogService.getAllCatalog(),
    reportService.getFullReport(),
  ]);

  const lowStockCount = books.filter((s) => s.kiemTraCanhBaoTonKho() && s.trangThai !== 'NGUNG_BAN').length;
  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-100 text-xs font-semibold mb-3 border border-indigo-400/20">
            Đồ Án Môn Học PTTKHDT / OOAD 2026
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Hệ Thống Quản Lý Nhà Sách
          </h1>
          <p className="mt-3 text-sm text-indigo-100 leading-relaxed">
            Kiến trúc phân tầng (Layered Architecture) chuẩn hóa 21 thực thể Hướng đối tượng theo Class Diagram,
            22 bảng Relational Data Model trên Supabase và đầy đủ 11 phân hệ nghiệp vụ từ BFD.
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
              <span>Quản lý Sách & Kho</span>
            </Link>
          </div>
        </div>

        <div className="absolute right-[-40px] bottom-[-40px] opacity-10 pointer-events-none">
          <BookOpen className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* KPI Stats (Dữ liệu thực từ Services) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Tổng đầu sách</p>
            <h3 className="text-2xl font-bold text-slate-800">{books.length}</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">
              {report.inventory.totalUnits} cuốn tồn kho
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Doanh thu thuần</p>
            <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(report.netRevenue)}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{report.totalOrders} hóa đơn ghi nhận</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Cảnh báo sắp hết</p>
            <h3 className="text-2xl font-bold text-slate-800">{lowStockCount}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lowStockCount > 0 ? 'Cần lập phiếu nhập' : 'Mức kho an toàn'}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-violet-50 text-violet-600">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Danh mục thể loại</p>
            <h3 className="text-2xl font-bold text-slate-800">{catalog.categories.length}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {catalog.authors.length} tác giả • {catalog.publishers.length} NXB
            </p>
          </div>
        </div>
      </div>

      {/* OOAD Architecture Spotlight */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Kiến Trúc Hướng Đối Tượng (OOAD) Đồng Bộ Theo Sơ Đồ Thiết Kế
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Phân tách rành mạch Presentation → Services → Repositories (Supabase 22 bảng) → Domain Entities (21 lớp)
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
              <span>21 Domain Entities (Class Diagram)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Các lớp <code className="text-indigo-600 font-mono">Sach</code>, <code className="text-indigo-600 font-mono">HoaDon</code>, <code className="text-indigo-600 font-mono">KhachHang</code>, <code className="text-indigo-600 font-mono">PhieuNhap</code>, <code className="text-indigo-600 font-mono">PhieuKiemKe</code>, <code className="text-indigo-600 font-mono">MaGiamGia</code> đóng gói đầy đủ quy tắc nghiệp vụ và chuyển trạng thái.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Repository Pattern (22 Bảng)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Toàn bộ Repository tách biệt qua Interface (<code className="text-indigo-600 font-mono">IBookRepository</code>, <code className="text-indigo-600 font-mono">IOrderRepository</code>,...) kết nối trực tiếp Supabase PostgreSQL theo Relational Data Model và có fallback an toàn.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>11 Phân Hệ Nghiệp Vụ (BFD)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bao phủ trọn vẹn QLBH, QLS, QLDMS, QLK, QLNH, QLNCC, QLKH, QLKM, QLNV, QLHT (RBAC) và TK-BC theo đúng Sequence & Activity Diagrams.
            </p>
          </div>
        </div>

        <div className="pt-2 text-right">
          <Link
            href="/reports"
            className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <span>Xem Thống kê & Báo cáo chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
