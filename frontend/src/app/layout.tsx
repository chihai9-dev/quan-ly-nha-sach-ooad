import './globals.css';
import type { Metadata } from 'next';
import { Header } from '@/components/ui/Header';

export const metadata: Metadata = {
  title: 'Hệ thống Quản lý Nhà sách | OOAD Project',
  description: 'Đồ án môn Phân tích Thiết kế Hướng đối tượng (OOAD) - Quản lý Nhà sách với Next.js & Supabase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <p>© 2026 Hệ thống Quản lý Nhà sách - Đồ án môn Phân tích và Thiết kế Hướng đối tượng (OOAD)</p>
          <p className="mt-1">Xây dựng với Next.js (App Router), TypeScript, TailwindCSS và Supabase (PostgreSQL)</p>
        </footer>
      </body>
    </html>
  );
}
