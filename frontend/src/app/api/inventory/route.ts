import { NextRequest, NextResponse } from 'next/server';
import { InventoryService } from '@/services/InventoryService';
import { requirePermission } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';

const inventoryService = new InventoryService();

export async function GET() {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_KHO, PERMISSIONS.QUAN_LY_SACH);
  if (!auth.ok) return auth.response;

  try {
    const [items, audits] = await Promise.all([
      inventoryService.getInventory(),
      inventoryService.getAudits(),
    ]);
    return NextResponse.json({ items, audits });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi tải dữ liệu tồn kho.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_KHO);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as {
      note?: string;
      items?: Array<{ bookId: string; actualQuantity: number; reason?: string }>;
    };
    const audit = await inventoryService.createAudit({
      staffName: auth.user.hoTen,
      note: body.note,
      items: (body.items ?? []).map((i) => ({
        bookId: String(i.bookId),
        actualQuantity: Number(i.actualQuantity),
        reason: i.reason,
      })),
    });
    return NextResponse.json({ audit }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể lập phiếu kiểm kê.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_KHO);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as {
      bookId?: string;
      minStockThreshold?: number;
      maxStockThreshold?: number;
    };
    if (!body.bookId) return NextResponse.json({ error: 'Thiếu mã sách.' }, { status: 400 });
    const updated = await inventoryService.updateThresholds(
      body.bookId,
      Number(body.minStockThreshold ?? 0),
      Number(body.maxStockThreshold ?? 100)
    );
    return NextResponse.json({ item: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể cập nhật ngưỡng cảnh báo.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
