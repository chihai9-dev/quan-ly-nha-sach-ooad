import { supabase } from '@/lib/supabase/client';
import { Order } from '@/models/Order';
import { OrderItem } from '@/models/OrderItem';
import { Invoice } from '@/models/Invoice';
import { IOrderRepository } from './IOrderRepository';
import type { OrderStatus } from '@/types/dtos';

export class OrderRepository implements IOrderRepository {
  async saveOrder(order: Order): Promise<Order> {
    try {
      // 1. Chèn bản ghi đơn hàng chính
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert(order.toDatabase())
        .select()
        .single();

      if (orderError) {
        console.warn('Supabase saveOrder error (fallback mock):', orderError.message);
        return order;
      }

      // 2. Chèn danh sách chi tiết đơn hàng (order_items)
      const orderItemsData = order.items.map(item => item.toDatabase(orderData.id));

      if (orderItemsData.length > 0) {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItemsData);

        if (itemsError) {
          console.warn('Supabase saveOrderItems error:', itemsError.message);
        }
      }

      return order;
    } catch (err) {
      console.warn('Lỗi kết nối Supabase khi lưu đơn hàng:', err);
      return order;
    }
  }

  async createInvoice(invoice: Invoice): Promise<Invoice> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoice.toDatabase())
        .select()
        .single();

      if (error) {
        console.warn('Supabase createInvoice error (fallback mock):', error.message);
        return invoice;
      }

      return invoice;
    } catch (err) {
      console.warn('Lỗi kết nối Supabase khi tạo hóa đơn:', err);
      return invoice;
    }
  }

  async findOrderById(id: string): Promise<Order | null> {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*, books(*))')
      .eq('id', id)
      .single();

    if (orderError || !orderData) return null;

    const items = (orderData.order_items || []).map((row: any) => new OrderItem({
      id: row.id,
      bookId: row.book_id,
      bookTitle: row.books?.title || 'Sách',
      bookIsbn: row.books?.isbn || '',
      unitPrice: Number(row.unit_price),
      quantity: row.quantity,
      coverUrl: row.books?.cover_url,
    }));

    return new Order({
      id: orderData.id,
      orderCode: orderData.order_code,
      customerId: orderData.customer_id,
      status: orderData.status as OrderStatus,
      discountAmount: Number(orderData.discount_amount),
      cashierName: orderData.cashier_name,
      note: orderData.note,
      items: items,
      createdAt: orderData.created_at,
      updatedAt: orderData.updated_at,
    });
  }

  async findOrderByCode(orderCode: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('id')
      .eq('order_code', orderCode)
      .single();

    if (error || !data) return null;
    return this.findOrderById(data.id);
  }

  async listRecentOrders(limit: number = 10): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return data.map(o => new Order({
      id: o.id,
      orderCode: o.order_code,
      customerId: o.customer_id,
      status: o.status as OrderStatus,
      discountAmount: Number(o.discount_amount),
      cashierName: o.cashier_name,
      note: o.note,
      createdAt: o.created_at,
      updatedAt: o.updated_at,
    }));
  }
}
