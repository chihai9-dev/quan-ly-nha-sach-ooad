import Link from 'next/link';
import { BookService } from '@/services/BookService';
import { OrderService } from '@/services/OrderService';
import { ReportService } from '@/services/ReportService';
import {
  Wallet,
  Receipt,
  BookOpen,
  Boxes,
  Plus,
  Calendar,
  ArrowUpRight,
  ChevronRight,
  Truck,
  TrendingUp,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const COVER_IMAGES = [
  '/covers/nha-gia-kim.jpg',
  '/covers/dac-nhan-tam.jpg',
  '/covers/cay-cam-ngot-cua-toi.jpg',
  '/covers/de-men-phieu-luu-ky.jpg',
  '/covers/tu-duy-nhanh-va-cham.jpg',
  '/covers/tuoi-tre-dang-gia-bao-nhieu.jpg',
];

export default async function HomePage() {
  const bookService = new BookService();
  const orderService = new OrderService();
  const reportService = new ReportService();

  const [books, recentOrders, report] = await Promise.all([
    bookService.getAllBooks(),
    orderService.getRecentOrders(5),
    reportService.getFullReport(),
  ]);

  const lowStockCount = books.filter(
    (s) => s.kiemTraCanhBaoTonKho() && s.trangThai !== 'NGUNG_BAN'
  ).length;
  const totalSold = report.bestsellers.reduce((s, b) => s + b.soldQuantity, 0);
  const topBooks = report.bestsellers.slice(0, 4);

  const todayStr = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const formatNum = (v: number) => new Intl.NumberFormat('vi-VN').format(v);

  return (
    <div className="space-y-5">
      {/* Page head giống UI/tong-quan.html */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[#1e2a23] leading-tight">
            Chào mừng đến với mộc.
          </h1>
          <p className="text-[13px] text-[#737a72] mt-1">
            Một ngày mới, những câu chuyện mới. Cùng nhìn lại hoạt động nhà sách hôm nay.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[8px] border border-[#e7e6dc] bg-white text-[13px] font-semibold text-[#3b453f]">
            <Calendar className="w-4 h-4 text-[#737a72]" />
            <span>Hôm nay, {todayStr}</span>
          </div>
          <Link
            href="/pos"
            className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[8px] bg-[#24533a] hover:bg-[#1d4630] text-white text-[13px] font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo đơn hàng</span>
          </Link>
        </div>
      </div>

      {/* 4 KPI Cards giống UI/tong-quan.html (Card 1 nền xanh rừng đậm) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <div className="moc-stat-hero rounded-[14px] border p-4">
          <div className="flex items-center justify-between text-[13px] text-white/85 font-medium">
            <span>Doanh thu thuần</span>
            <Wallet className="w-4 h-4 text-white/80" />
          </div>
          <div className="text-[26px] font-bold tracking-[-0.02em] mt-2.5 mb-1.5">
            {formatNum(report.netRevenue)}{' '}
            <small className="text-[13px] font-medium text-white/80">đ</small>
          </div>
          <div className="text-[11.5px] text-white/80 flex items-center gap-1.5">
            <span className="font-semibold text-white">↗ Trực tiếp từ dữ liệu</span>
          </div>
        </div>

        <div className="bg-white rounded-[14px] border border-[#e7e6dc] p-4">
          <div className="flex items-center justify-between text-[13px] text-[#3b453f] font-medium">
            <span>Đơn hàng</span>
            <Receipt className="w-4 h-4 text-[#737a72]" />
          </div>
          <div className="text-[26px] font-bold tracking-[-0.02em] text-[#1e2a23] mt-2.5 mb-1.5">
            {report.totalOrders}{' '}
            <small className="text-[13px] font-medium text-[#737a72]">đơn</small>
          </div>
          <div className="text-[11.5px] text-[#737a72]">
            <Link href="/orders" className="text-[#2f6648] font-semibold hover:underline">
              Xem hóa đơn & đổi trả →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-[14px] border border-[#e7e6dc] p-4">
          <div className="flex items-center justify-between text-[13px] text-[#3b453f] font-medium">
            <span>Sách đã bán</span>
            <BookOpen className="w-4 h-4 text-[#737a72]" />
          </div>
          <div className="text-[26px] font-bold tracking-[-0.02em] text-[#1e2a23] mt-2.5 mb-1.5">
            {formatNum(totalSold)}{' '}
            <small className="text-[13px] font-medium text-[#737a72]">cuốn</small>
          </div>
          <div className="text-[11.5px] text-[#737a72]">
            <span className="text-[#2f6648] font-semibold">{books.length} đầu sách</span> đang kinh doanh
          </div>
        </div>

        <div className="bg-white rounded-[14px] border border-[#e7e6dc] p-4">
          <div className="flex items-center justify-between text-[13px] text-[#3b453f] font-medium">
            <span>Sách trong kho</span>
            <Boxes className="w-4 h-4 text-[#737a72]" />
          </div>
          <div className="text-[26px] font-bold tracking-[-0.02em] text-[#1e2a23] mt-2.5 mb-1.5">
            {formatNum(report.inventory.totalUnits)}{' '}
            <small className="text-[13px] font-medium text-[#737a72]">cuốn</small>
          </div>
          <div className="text-[11.5px] text-[#737a72] flex items-center gap-1.5">
            <span className="text-[#b7791f] font-semibold">! {lowStockCount} đầu sách sắp hết</span>
            <span>·</span>
            <Link href="/inventory" className="hover:underline">
              Xem kho
            </Link>
          </div>
        </div>
      </div>

      {/* Hàng 2: Biểu đồ doanh thu + Sách bán chạy (g-2-1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 bg-white rounded-[14px] border border-[#e7e6dc] p-5">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-[15px] font-semibold text-[#1e2a23]">Tổng quan doanh thu</h3>
            <Link href="/reports" className="text-xs font-semibold text-[#24533a] inline-flex items-center gap-1 hover:underline">
              Chi tiết báo cáo <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="text-[26px] font-bold tracking-[-0.02em] text-[#1e2a23]">
            {formatNum(report.totalRevenue)} đ
            <span className="text-xs text-[#2f6648] font-semibold ml-2">
              (Hoàn trả: {formatNum(report.totalRefunds)} đ)
            </span>
          </div>

          <div className="flex items-center justify-between mt-3 text-[11px] text-[#737a72]">
            <span>Triệu đồng</span>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5">
                <i className="w-2 h-2 rounded-[2px] bg-[#24533a] inline-block" /> Kỳ này
              </span>
              <span className="inline-flex items-center gap-1.5">
                <i className="w-2 h-2 rounded-[2px] bg-[#b8d0c0] inline-block" /> Kỳ trước
              </span>
            </div>
          </div>

          <div className="mt-3">
            <svg className="w-full h-[190px]" viewBox="0 0 650 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mocChartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#24533a" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#24533a" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="30" y1="20" x2="630" y2="20" stroke="#efeee6" strokeWidth="1" />
              <line x1="30" y1="70" x2="630" y2="70" stroke="#efeee6" strokeWidth="1" />
              <line x1="30" y1="120" x2="630" y2="120" stroke="#efeee6" strokeWidth="1" />
              <line x1="30" y1="170" x2="630" y2="170" stroke="#efeee6" strokeWidth="1" />
              <text x="5" y="24" fill="#a3a89f" fontSize="11">30</text>
              <text x="5" y="74" fill="#a3a89f" fontSize="11">20</text>
              <text x="5" y="124" fill="#a3a89f" fontSize="11">10</text>
              <text x="12" y="174" fill="#a3a89f" fontSize="11">0</text>
              <path
                d="M 40 102 C 120 95, 180 110, 240 92 C 300 78, 360 118, 440 104 C 520 92, 570 100, 620 94"
                fill="none"
                stroke="#b8d0c0"
                strokeWidth="1.8"
                strokeDasharray="3 3"
              />
              <path
                d="M 40 100 C 110 88, 160 84, 230 96 C 300 106, 350 72, 420 74 C 490 76, 550 96, 620 50 L 620 170 L 40 170 Z"
                fill="url(#mocChartGrad)"
              />
              <path
                d="M 40 100 C 110 88, 160 84, 230 96 C 300 106, 350 72, 420 74 C 490 76, 550 96, 620 50"
                fill="none"
                stroke="#24533a"
                strokeWidth="2.5"
              />
              <circle cx="620" cy="50" r="4.5" fill="#24533a" stroke="#fff" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex items-center gap-2 text-[11.5px] text-[#737a72] mt-3 pt-3 border-t border-[#efeee6]">
            <TrendingUp className="w-3.5 h-3.5 text-[#2f6648]" />
            <span>
              Giá trị tồn kho hiện tại: <b className="text-[#1e2a23]">{formatNum(report.inventory.totalInventoryValue)} đ</b> · Công nợ NCC: <b className="text-[#b4472f]">{formatNum(report.supplierDebt.totalRemainingDebt)} đ</b>
            </span>
          </div>
        </div>

        {/* Sách bán chạy với bìa sách thật từ UI/assets/covers/ */}
        <div className="lg:col-span-5 bg-white rounded-[14px] border border-[#e7e6dc] p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[15px] font-semibold text-[#1e2a23]">Sách bán chạy</h3>
              <p className="text-[11.5px] text-[#737a72] mt-0.5">
                Những đầu sách được yêu thích nhất tại cửa hàng
              </p>
            </div>
            <Link href="/books" className="text-xs font-semibold text-[#24533a] inline-flex items-center gap-0.5 hover:underline">
              Xem tất cả <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#efeee6]">
            {topBooks.map((item, idx) => (
              <div key={item.bookId} className="flex items-center gap-3 py-2.5">
                <span className="w-5 text-xs font-bold text-[#a3a89f]">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <img
                  src={COVER_IMAGES[idx % COVER_IMAGES.length]}
                  alt={item.title}
                  className="w-[34px] h-[46px] rounded-[4px] object-cover shadow-sm shrink-0 bg-[#e5e5dc]"
                />
                <div className="min-w-0 flex-1">
                  <b className="block text-[13px] font-semibold text-[#1e2a23] truncate">{item.title}</b>
                  <small className="text-[11.5px] text-[#737a72]">{item.categoryName}</small>
                </div>
                <div className="text-right shrink-0">
                  <b className="text-[13px] text-[#1e2a23]">{item.soldQuantity}</b>{' '}
                  <span className="text-[11px] text-[#737a72]">cuốn</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hàng 3: Giao dịch gần đây + Cần chú ý */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 bg-white rounded-[14px] border border-[#e7e6dc] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#efeee6]">
            <h3 className="text-[15px] font-semibold text-[#1e2a23]">Giao dịch gần đây</h3>
            <Link href="/orders" className="text-xs font-semibold text-[#24533a] inline-flex items-center gap-0.5 hover:underline">
              Xem tất cả <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-10 text-center text-xs text-[#737a72]">
              Chưa có hóa đơn bán lẻ mới. Mở{' '}
              <Link href="/pos" className="text-[#24533a] font-semibold underline">
                Bán hàng (POS)
              </Link>{' '}
              để tạo đơn đầu tiên.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fafaf6] text-[#737a72] border-b border-[#efeee6]">
                  <tr>
                    <th className="py-2.5 px-4 font-medium">Mã hóa đơn</th>
                    <th className="py-2.5 px-4 font-medium">Khách hàng</th>
                    <th className="py-2.5 px-4 font-medium text-right">Tổng tiền</th>
                    <th className="py-2.5 px-4 font-medium">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#efeee6]">
                  {recentOrders.map((hd) => (
                    <tr key={hd.maHoaDon} className="hover:bg-[#fcfcf8]">
                      <td className="py-3 px-4">
                        <b className="font-semibold text-[#1e2a23]">{hd.maHoaDon}</b>
                        <div className="text-[11px] text-[#737a72]">
                          {hd.ngayLap.toLocaleString('vi-VN')}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#3b453f]">
                        {hd.khachHang?.hoTen ?? 'Khách lẻ'}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-[#1e2a23]">
                        {formatNum(hd.thanhToanCuoi)} đ
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[6px] text-[11px] font-semibold bg-[#eff4ee] text-[#2f6648]">
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          Đã thanh toán
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-white rounded-[14px] border border-[#e7e6dc] p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-[#1e2a23]">Cần chú ý</h3>
            <span className="text-[11.5px] text-[#737a72]">2 việc cần theo dõi</span>
          </div>

          <div className="divide-y divide-[#efeee6]">
            <Link href="/inventory" className="flex items-center gap-3 py-3 hover:opacity-85 transition-opacity">
              <span className="w-[34px] h-[34px] rounded-[9px] bg-[#fcf0d9] text-[#b7791f] grid place-items-center shrink-0">
                <Boxes className="w-4 h-4" />
              </span>
              <div className="flex-1 min-w-0">
                <b className="block text-[13px] font-semibold text-[#1e2a23]">
                  {lowStockCount} đầu sách sắp hết hàng
                </b>
                <div className="text-[11.5px] text-[#737a72]">
                  Tồn kho dưới mức tối thiểu · Kiểm tra và bổ sung
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#737a72]" />
            </Link>

            <Link href="/imports" className="flex items-center gap-3 py-3 hover:opacity-85 transition-opacity">
              <span className="w-[34px] h-[34px] rounded-[9px] bg-[#eff4ee] text-[#24533a] grid place-items-center shrink-0">
                <Truck className="w-4 h-4" />
              </span>
              <div className="flex-1 min-w-0">
                <b className="block text-[13px] font-semibold text-[#1e2a23]">
                  Công nợ NCC: {formatNum(report.supplierDebt.totalRemainingDebt)} đ
                </b>
                <div className="text-[11.5px] text-[#737a72]">
                  Theo dõi {report.supplierDebt.totalSuppliers} nhà cung cấp & phiếu nhập kho
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#737a72]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
