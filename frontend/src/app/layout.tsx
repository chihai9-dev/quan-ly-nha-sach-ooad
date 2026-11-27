import './globals.css';
import type { Metadata } from 'next';
import { Header } from '@/components/ui/Header';

export const metadata: Metadata = {
  title: 'mộc. — Hệ thống Quản lý Nhà sách',
  description: 'Hệ thống Quản lý Nhà sách mộc. — Chuẩn hóa theo Class Diagram, Relational Data Model & BFD',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-[#f6f6f1] text-[#1e2a23] antialiased">
        <Header>{children}</Header>
      </body>
    </html>
  );
}
