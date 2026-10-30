import { Order } from '@/models/Order';
import { Invoice } from '@/models/Invoice';
import { IOrderRepository } from '@/repositories/IOrderRepository';
import { OrderRepository } from '@/repositories/OrderRepository';
import { IBookRepository } from '@/repositories/IBookRepository';
import { BookRepository } from '@/repositories/BookRepository';
import type { PaymentMethod } from '@/types/dtos';

export interface CheckoutResult {
  order: Order;
  invoice: Invoice;
}

/**
 * Lớp OrderService (Tầng Dịch vụ Nghiệp vụ Bán hàng & Đơn hàng)
 * Chịu trách nhiệm thực thi giao dịch thanh toán quầy thu ngân (POS) và trừ tồn kho.
 */
export class OrderService {
  private readonly orderRepository: IOrderRepository;
  private readonly bookRepository: IBookRepository;

  constructor(
    orderRepo: IOrderRepository = new OrderRepository(),
    bookRepo: IBookRepository = new BookRepository()
  ) {
    this.orderRepository = orderRepo;
    this.bookRepository = bookRepo;
  }

  /**
   * Khởi tạo một đối tượng Đơn hàng mới
   */
  createNewOrder(cashierName: string = 'Thu ngân 01'): Order {
    const timestamp = Date.now().toString().slice(-6);
    const orderCode = `ORD-${timestamp}`;
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `order-${Date.now()}`;

    return new Order({
      id: id,
      orderCode: orderCode,
      cashierName: cashierName,
      status: 'PENDING',
    });
  }

  /**
   * Thực hiện thanh toán và lập hóa đơn cho đơn hàng
   * @param order Đơn hàng cần thanh toán
   * @param paymentMethod Phương thức thanh toán (Tiền mặt, Chuyển khoản, Momo, Thẻ)
   * @param paidAmount Số tiền khách hàng đưa
   */
  async checkout(
    order: Order,
    paymentMethod: PaymentMethod,
    paidAmount: number
  ): Promise<CheckoutResult> {
    // 1. Kiểm tra đơn hàng hợp lệ
    if (order.items.length === 0) {
      throw new Error('Đơn hàng không có sản phẩm nào để thanh toán.');
    }

    const totalDue = order.calculateFinalTotal();

    // 2. Kiểm tra số tiền thanh toán
    if (paidAmount < totalDue) {
      throw new Error(
        `Số tiền nhận (${paidAmount.toLocaleString()} đ) ít hơn tổng cần trả (${totalDue.toLocaleString()} đ).`
      );
    }

    // 3. Kiểm tra số lượng tồn kho và chuẩn bị trừ kho
    for (const item of order.items) {
      const book = await this.bookRepository.findById(item.bookId);
      if (book) {
        if (!book.isAvailable(item.quantity)) {
          throw new Error(
            `Sách "${book.title}" không đủ số lượng tồn kho (Còn lại: ${book.stockQuantity}, Cần mua: ${item.quantity}).`
          );
        }
      }
    }

    // 4. Trừ tồn kho thực tế
    for (const item of order.items) {
      const book = await this.bookRepository.findById(item.bookId);
      if (book) {
        book.reduceStock(item.quantity);
        await this.bookRepository.updateStock(book.getId(), book.stockQuantity);
      }
    }

    // 5. Đánh dấu hoàn tất đơn hàng
    order.complete();
    await this.orderRepository.saveOrder(order);

    // 6. Lập thực thể Hóa đơn
    const invoiceId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `inv-${Date.now()}`;
    const invoiceCode = `INV-${order.orderCode.replace('ORD-', '')}`;
    const invoice = new Invoice({
      id: invoiceId,
      invoiceCode: invoiceCode,
      orderId: order.getId(),
      paymentMethod: paymentMethod,
      paidAmount: paidAmount,
      changeAmount: paidAmount - totalDue,
      paymentStatus: 'PAID',
    });

    invoice.processPayment(totalDue);
    await this.orderRepository.createInvoice(invoice);

    return {
      order,
      invoice,
    };
  }

  /**
   * Xem danh sách các đơn hàng gần đây
   */
  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    return this.orderRepository.listRecentOrders(limit);
  }
}
