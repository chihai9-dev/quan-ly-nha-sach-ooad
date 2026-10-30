'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, ShoppingCart, Library, History, User } from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Tổng quan', icon: Library },
    { href: '/pos', label: 'Quầy POS', icon: ShoppingCart },
    { href: '/books', label: 'Quản lý Sách', icon: BookOpen },
    { href: '/orders', label: 'Lịch sử Đơn', icon: History },
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

          {/* Cashier / User Badge */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-800">Nguyễn Văn Thu Ngân</p>
              <p className="text-xs text-slate-500">Ca sáng - Quầy 01</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
