'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  ShoppingBag,
  LayoutGrid,
  History,
  LogIn,
  LogOut,
  FolderTree,
  Users,
  Briefcase,
  Truck,
  PackagePlus,
  Boxes,
  Tag,
  TrendingUp,
  Search,
  Store,
  Bell,
  Home,
  Sprout,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import type { SessionUserDTO } from '@/types/dtos';
import { PERMISSIONS, type PermissionCode } from '@/lib/auth/permissions';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredAny?: PermissionCode[];
}

const ALL_NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Tổng quan', icon: LayoutGrid },
  { href: '/books', label: 'Quản lý sách', icon: BookOpen, requiredAny: [PERMISSIONS.QUAN_LY_SACH, PERMISSIONS.QUAN_LY_BAN_HANG] },
  { href: '/categories', label: 'Danh mục sách', icon: FolderTree, requiredAny: [PERMISSIONS.QUAN_LY_DANH_MUC_SACH] },
  { href: '/pos', label: 'Bán hàng (POS)', icon: ShoppingBag, requiredAny: [PERMISSIONS.QUAN_LY_BAN_HANG] },
  { href: '/orders', label: 'Hóa đơn & Đổi trả', icon: History, requiredAny: [PERMISSIONS.QUAN_LY_BAN_HANG] },
  { href: '/inventory', label: 'Tồn kho', icon: Boxes, requiredAny: [PERMISSIONS.QUAN_LY_KHO] },
  { href: '/imports', label: 'Nhập hàng', icon: PackagePlus, requiredAny: [PERMISSIONS.QUAN_LY_NHAP_HANG] },
  { href: '/suppliers', label: 'Nhà cung cấp', icon: Truck, requiredAny: [PERMISSIONS.QUAN_LY_NHA_CUNG_CAP, PERMISSIONS.QUAN_LY_NHAP_HANG] },
  { href: '/customers', label: 'Khách hàng', icon: Users, requiredAny: [PERMISSIONS.QUAN_LY_KHACH_HANG, PERMISSIONS.QUAN_LY_BAN_HANG] },
  { href: '/promotions', label: 'Khuyến mãi', icon: Tag, requiredAny: [PERMISSIONS.QUAN_LY_KHUYEN_MAI] },
  { href: '/staff', label: 'Nhân viên', icon: Briefcase, requiredAny: [PERMISSIONS.QUAN_LY_NHAN_VIEN] },
  { href: '/reports', label: 'Báo cáo', icon: TrendingUp, requiredAny: [PERMISSIONS.THONG_KE_BAO_CAO] },
];

const CRUMB_LABELS: Record<string, string> = {
  '/': 'Tổng quan',
  '/books': 'Quản lý sách',
  '/categories': 'Danh mục sách',
  '/pos': 'Bán hàng (POS)',
  '/orders': 'Hóa đơn & Đổi trả',
  '/inventory': 'Tồn kho & Kiểm kê',
  '/imports': 'Nhập hàng',
  '/suppliers': 'Nhà cung cấp',
  '/customers': 'Khách hàng',
  '/promotions': 'Khuyến mãi & Mã giảm giá',
  '/staff': 'Nhân viên',
  '/reports': 'Báo cáo & Thống kê',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Header: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<SessionUserDTO | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  const loadSession = async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      if (res.ok) {
        const data = (await res.json()) as { user: SessionUserDTO };
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    void loadSession();
    const handler = () => void loadSession();
    window.addEventListener('auth-changed', handler);
    return () => window.removeEventListener('auth-changed', handler);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    window.dispatchEvent(new Event('auth-changed'));
    router.push('/login');
    router.refresh();
  };

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      router.push('/books');
    }
  };

  // Trang đăng nhập dùng layout toàn màn hình giống UI/dang-nhap.html
  if (pathname === '/login') {
    return <>{children}</>;
  }

  const navItems = ALL_NAV_ITEMS.filter((item) => {
    if (!item.requiredAny) return true;
    if (!currentUser) {
      return (
        item.href === '/' ||
        item.href === '/books' ||
        item.href === '/pos' ||
        item.href === '/orders'
      );
    }
    return item.requiredAny.some((p) => currentUser.danhSachQuyen.includes(p));
  });

  const currentCrumb = CRUMB_LABELS[pathname] ?? 'Không gian làm việc';

  const SidebarContent = (
    <>
      {/* Brand mộc. */}
      <Link href="/" className="flex items-center gap-2.5 px-1.5 pb-6" onClick={() => setMobileOpen(false)}>
        <span className="w-9 h-9 rounded-[9px] bg-[#24533a] text-white grid place-items-center shrink-0">
          <BookOpen className="w-5 h-5" />
        </span>
        <span>
          <b className="block text-[20px] leading-none tracking-[-0.02em] text-[#1e2a23]">mộc.</b>
          <small className="text-[9px] tracking-[0.14em] text-[#737a72] uppercase font-medium">
            Quản lý nhà sách
          </small>
        </span>
      </Link>

      {/* Nav label */}
      <div className="text-[9.5px] font-semibold tracking-[0.12em] text-[#737a72] px-2 pb-2.5 uppercase">
        Không gian làm việc
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-[#24533a] text-white'
                  : 'text-[#3b453f] hover:bg-[#e9e9e0]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quote box giống UI/assets/shell.js */}
      <div className="mt-5 mb-4 rounded-[12px] bg-[#e3ede4] p-4 text-[#1d4630]">
        <Sprout className="w-4 h-4 text-[#24533a]" />
        <b className="block text-[13px] mt-2.5 mb-1 leading-snug">
          Mỗi cuốn sách, một khởi đầu mới.
        </b>
        <p className="text-[11px] text-[#737a72] leading-relaxed">
          Chăm chút từng trang sách, vững vàng từng ngày bán hàng.
        </p>
      </div>

      {/* Footer links */}
      <div className="pt-2 border-t border-[#e7e6dc] space-y-0.5">
        {currentUser ? (
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-[13px] font-medium text-[#b4472f] hover:bg-[#fae6e0] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất ({currentUser.tenDangNhap})</span>
          </button>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-[13px] font-medium text-[#24533a] hover:bg-[#e3ede4] transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng nhập ca làm việc</span>
          </Link>
        )}
      </div>
    </>
  );

  return (
    <div className="moc-app">
      {/* Desktop Sidebar */}
      <aside className="moc-sidebar hidden lg:flex">{SidebarContent}</aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="w-[248px] bg-[#f2f2eb] border-r border-[#e7e6dc] p-5 flex flex-col h-full overflow-y-auto relative">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1 text-[#737a72]"
            >
              <X className="w-5 h-5" />
            </button>
            {SidebarContent}
          </div>
          <div className="flex-1 bg-black/30" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main Column */}
      <div className="min-w-0 flex flex-col bg-[#f6f6f1]">
        {/* Topbar giống UI/assets/shell.js */}
        <header className="moc-topbar">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-1.5 rounded-lg border border-[#e7e6dc] text-[#3b453f]"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[13px] text-[#737a72] font-medium">
            <Link href="/" className="hover:text-[#24533a]">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#a3a89f]" />
            <b className="text-[#1e2a23] font-semibold">{currentCrumb}</b>
          </div>

          {/* Search */}
          <form onSubmit={handleQuickSearch} className="relative ml-auto hidden md:block w-[280px]">
            <Search className="w-4 h-4 text-[#a3a89f] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Tìm sách, đơn hàng, khách hàng..."
              className="w-full h-9 pl-9 pr-3 text-[13px] bg-[#fafaf6] border border-[#e7e6dc] rounded-[8px] focus:outline-none focus:border-[#3f7a58] focus:ring-2 focus:ring-[#eff4ee]"
            />
          </form>

          {/* Store branch */}
          <div className="hidden xl:flex items-center gap-2 text-[13px] font-medium text-[#3b453f] px-1.5">
            <Store className="w-4 h-4 text-[#737a72]" />
            <span>Nguyễn Văn Cừ</span>
          </div>

          {/* Bell */}
          <Link href="/inventory" className="relative p-1.5 text-[#3b453f] hover:text-[#24533a]" title="Cảnh báo tồn kho">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#b7791f]" />
          </Link>

          {/* User chip */}
          {currentUser ? (
            <div className="flex items-center gap-2.5 pl-1">
              <span className="w-[34px] h-[34px] rounded-full bg-[#e3ede4] text-[#24533a] grid place-items-center font-bold text-xs shrink-0">
                {getInitials(currentUser.hoTen)}
              </span>
              <div className="hidden sm:block leading-tight">
                <b className="block text-[12.5px] text-[#1e2a23]">{currentUser.hoTen}</b>
                <small className="text-[11px] text-[#737a72]">{currentUser.tenVaiTro}</small>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[8px] bg-[#24533a] hover:bg-[#1d4630] text-white text-xs font-semibold transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </Link>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-5 sm:p-7 max-w-[1440px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
