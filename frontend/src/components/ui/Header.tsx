'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  ShoppingCart,
  Library,
  History,
  User,
  LogIn,
  LogOut,
  FolderTree,
  Users,
  Briefcase,
  Truck,
  PackagePlus,
  Warehouse,
  Tag,
  BarChart3,
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
  { href: '/', label: 'Tổng quan', icon: Library },
  { href: '/pos', label: 'POS', icon: ShoppingCart, requiredAny: [PERMISSIONS.QUAN_LY_BAN_HANG] },
  { href: '/orders', label: 'Hóa đơn & Đổi trả', icon: History, requiredAny: [PERMISSIONS.QUAN_LY_BAN_HANG] },
  { href: '/books', label: 'Sách', icon: BookOpen, requiredAny: [PERMISSIONS.QUAN_LY_SACH, PERMISSIONS.QUAN_LY_BAN_HANG] },
  { href: '/categories', label: 'Danh mục', icon: FolderTree, requiredAny: [PERMISSIONS.QUAN_LY_DANH_MUC_SACH] },
  { href: '/inventory', label: 'Kho', icon: Warehouse, requiredAny: [PERMISSIONS.QUAN_LY_KHO] },
  { href: '/imports', label: 'Nhập hàng', icon: PackagePlus, requiredAny: [PERMISSIONS.QUAN_LY_NHAP_HANG] },
  { href: '/suppliers', label: 'NCC', icon: Truck, requiredAny: [PERMISSIONS.QUAN_LY_NHA_CUNG_CAP, PERMISSIONS.QUAN_LY_NHAP_HANG] },
  { href: '/customers', label: 'Khách hàng', icon: Users, requiredAny: [PERMISSIONS.QUAN_LY_KHACH_HANG, PERMISSIONS.QUAN_LY_BAN_HANG] },
  { href: '/promotions', label: 'Khuyến mãi', icon: Tag, requiredAny: [PERMISSIONS.QUAN_LY_KHUYEN_MAI] },
  { href: '/staff', label: 'Nhân viên', icon: Briefcase, requiredAny: [PERMISSIONS.QUAN_LY_NHAN_VIEN] },
  { href: '/reports', label: 'Báo cáo', icon: BarChart3, requiredAny: [PERMISSIONS.THONG_KE_BAO_CAO] },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<SessionUserDTO | null>(null);

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
    router.push('/login');
    router.refresh();
  };

  const navItems = ALL_NAV_ITEMS.filter((item) => {
    if (!item.requiredAny) return true;
    if (!currentUser) return item.href === '/' || item.href === '/pos' || item.href === '/books' || item.href === '/orders';
    return item.requiredAny.some((p) => currentUser.danhSachQuyen.includes(p));
  });

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-3">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-800 tracking-tight">BookStore</span>
              <span className="hidden xl:inline-block text-[10px] font-semibold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 ml-1.5 rounded-full border border-indigo-200">
                OOAD
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-0.5 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User / Actor Badge */}
          <div className="flex items-center space-x-2.5 shrink-0">
            {currentUser ? (
              <>
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-semibold text-slate-800">{currentUser.hoTen}</p>
                  <p className="text-[11px] font-semibold text-indigo-600">
                    {currentUser.tenVaiTro}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <User className="w-4 h-4" />
                </div>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  title="Đăng xuất"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-600"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Thoát</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
