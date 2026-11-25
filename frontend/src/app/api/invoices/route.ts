import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/services/OrderService';
import { BookService } from '@/services/BookService';
import { requirePermission } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';
import type { PaymentMethod } from '@/types/dtos';

const orderService = new OrderService();
const bookService = new BookService();

interface InvoiceItemRequest {
  bookId: string;
  quantity: number;
}

interface CreateInvoiceRequest {
  items: InvoiceItemRequest[];
  paymentMethod: PaymentMethod;
  paidAmount: number;
  customerId?: string;
}

/**
 * GET /api/invoices: Xem danh sách hóa đơn — Yêu cầu quyền QUAN_LY_BAN_HANG (Nhân viên bán hàng / Quản lý)
 */
export async function GET() {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_BAN_HANG);
  if (!auth.ok) return auth.response;

  try {
    const orders = await orderService.getRecentOrders(20);
    return NextResponse.json({
      invoices: orders.map((o) => ({
        id: o.getId(),
        maHoaDon: o.orderCode,
        nhanVienLap: o.cashierName,
        trangThai: o.status,
        tongTien: o.calculateFinalTotal(),
        ngayLap: o.getCreatedAt().toISOString(),
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi tải danh sách hóa đơn.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/invoices: Lập hóa đơn & thanh toán — Yêu cầu quyền QUAN_LY_BAN_HANG (Nhân viên bán hàng / Quản lý)
 */
export async function POST(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_BAN_HANG);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Partial<CreateInvoiceRequest>;
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Hóa đơn phải có ít nhất 1 sản phẩm.' },
        { status: 400 }
      );
    }

    const order = orderService.createNewOrder(auth.user.hoTen);

    for (const reqItem of body.items) {
      const book = await bookService.getBookDetails(reqItem.bookId);
      order.addItem(book, reqItem.quantity);
    }

    const result = await orderService.checkout(
      order,
      body.paymentMethod ?? 'CASH',
      Number(body.paidAmount ?? order.calculateFinalTotal())
    );

    return NextResponse.json(
      {
        maHoaDon: result.invoice.invoiceCode,
        maDon: result.order.orderCode,
        tongThanhToan: result.order.calculateFinalTotal(),
        tienThoi: result.invoice.changeAmount,
        nguoiLap: auth.user.hoTen,
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể lập hóa đơn.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
