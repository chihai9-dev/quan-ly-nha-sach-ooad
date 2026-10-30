import { POSCheckout } from '@/components/pos/POSCheckout';

export const metadata = {
  title: 'Quầy POS Bán Hàng | Quản lý Nhà sách',
  description: 'Giao diện bán hàng và thu ngân quầy POS nhà sách',
};

export default function POSPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Quầy Thu Ngân Bán Lẻ (POS)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Chọn hoặc quét mã sách, điều chỉnh giỏ hàng, áp dụng giảm giá thành viên và xuất hóa đơn.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Ca bán hàng trực tuyến</span>
        </div>
      </div>

      <POSCheckout />
    </div>
  );
}
