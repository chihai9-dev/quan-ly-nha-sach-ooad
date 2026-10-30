'use client';

import React, { useState, useEffect } from 'react';
import { Order } from '@/models/Order';
import { OrderService } from '@/services/OrderService';
import { History, Receipt, Calendar, CheckCircle2, Clock } from 'lucide-react';

export default function OrdersPage() {
  const [orderService] = useState(() => new OrderService());
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await orderService.getRecentOrders(20);
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Lịch Sử Đơn Hàng & Giao Dịch
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Theo dõi các giao dịch bán lẻ phát sinh tại các quầy thu ngân.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Đang tải lịch sử đơn hàng...</div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <History className="w-12 h-12 text-slate-200 mx-auto mb-2" />
            <p className="text-sm font-medium">Chưa có giao dịch đơn hàng nào được ghi nhận.</p>
            <p className="text-xs text-slate-400 mt-1">
              Các đơn hàng thanh toán tại trang POS sẽ xuất hiện tại đây.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3 px-4 font-semibold">Mã Đơn</th>
                <th className="py-3 px-4 font-semibold">Thời Gian</th>
                <th className="py-3 px-4 font-semibold">Thu Ngân</th>
                <th className="py-3 px-4 font-semibold">Trạng Thái</th>
                <th className="py-3 px-4 font-semibold text-right">Tổng Tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.getId()} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                    {order.orderCode}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {order.getCreatedAt().toLocaleDateString('vi-VN')} {order.getCreatedAt().toLocaleTimeString('vi-VN')}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {order.cashierName}
                  </td>
                  <td className="py-3 px-4">
                    {order.status === 'COMPLETED' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Hoàn tất
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-semibold">
                        <Clock className="w-3 h-3" /> {order.status}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    {formatCurrency(order.calculateFinalTotal())}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
