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
  Shield,
  LogIn,
  LogOut,
} from 'lucide-react';
import type { SessionUserDTO } from '@/types/dtos';

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

  const canManageRoles = currentUser?.danhSachQuyen.includes('PHAN_QUYEN') ?? false;

  const navItems = [
    { href: '/', label: 'Tổng quan', icon: Library },
    { href: '/pos', label: 'Quầy POS', icon: ShoppingCart },
    { href: '/books', label: 'Quản lý Sách', icon: BookOpen },
    { href: '/orders', label: 'Lịch sử Đơn', icon: History },
    ...(canManageRoles ? [{ href: '/admin/roles', label: 'Phân quyền', icon: Shield }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">BookStore</span>
              <span className="text-xs font-semibold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 ml-2 rounded-full border border-indigo-200">
                OOAD System
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User / Actor Badge */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-800">{currentUser.hoTen}</p>
                  <p className="text-xs font-semibold text-indigo-600">
                    {currentUser.tenVaiTro} ({currentUser.tenDangNhap})
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <User className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  title="Đăng xuất"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-600"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
