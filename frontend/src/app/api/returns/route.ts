import { NextRequest, NextResponse } from 'next/server';
import { ReturnService } from '@/services/ReturnService';
import { InventoryService } from '@/services/InventoryService';
import { requirePermission } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';

const returnService = new ReturnService();
const inventoryService = new InventoryService();

export async function GET() {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_BAN_HANG);
  if (!auth.ok) return auth.response;

  try {
    const [returns, books] = await Promise.all([
      returnService.getReturns(),
      inventoryService.getInventory(),
    ]);
    return NextResponse.json({ returns, books });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi tải danh sách phiếu đổi trả.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_BAN_HANG);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as {
      orderCode?: string;
      orderDate?: string;
      type?: 'RETURN' | 'EXCHANGE';
      reason?: string;
      items?: Array<{
        bookId: string;
        bookTitle: string;
        quantity: number;
        maxPurchasedQuantity: number;
        unitPrice: number;
      }>;
      exchangeBookId?: string;
    };

    const created = await returnService.createReturn({
      orderCode: body.orderCode ?? '',
      orderDate: body.orderDate,
      type: body.type === 'EXCHANGE' ? 'EXCHANGE' : 'RETURN',
      staffName: auth.user.hoTen,
      reason: body.reason ?? '',
      items: (body.items ?? []).map((i) => ({
        bookId: String(i.bookId),
        bookTitle: String(i.bookTitle),
        quantity: Number(i.quantity),
        maxPurchasedQuantity: Number(i.maxPurchasedQuantity),
        unitPrice: Number(i.unitPrice),
      })),
      exchangeBookId: body.exchangeBookId,
    });

    return NextResponse.json({ record: created }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể xử lý đổi/trả hàng.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
