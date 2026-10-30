import { Order } from '@/models/Order';
import { Invoice } from '@/models/Invoice';

/**
 * Giao diện IOrderRepository (Dependency Inversion)
 */
export interface IOrderRepository {
  saveOrder(order: Order): Promise<Order>;
  createInvoice(invoice: Invoice): Promise<Invoice>;
  findOrderById(id: string): Promise<Order | null>;
  findOrderByCode(orderCode: string): Promise<Order | null>;
  listRecentOrders(limit?: number): Promise<Order[]>;
}
