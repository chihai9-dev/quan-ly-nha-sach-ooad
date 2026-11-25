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
    const body = (await request.json()) as Record<string, unknown>;

    if (body.action === 'writeOff') {
      const record = await inventoryService.writeOffDamaged({
        staffName: auth.user.hoTen,
        bookId: String(body.bookId ?? ''),
        damagedQuantity: Number(body.damagedQuantity ?? 0),
        reason: String(body.reason ?? ''),
      });
      return NextResponse.json({ audit: record }, { status: 201 });
    }

    const items = Array.isArray(body.items)
      ? (body.items as Array<{ bookId: string; actualQuantity: number; reason?: string }>).map((i) => ({
          bookId: String(i.bookId),
          actualQuantity: Number(i.actualQuantity),
          reason: i.reason,
        }))
      : [];

    const audit = await inventoryService.createAudit({
      staffName: auth.user.hoTen,
      note: body.note ? String(body.note) : undefined,
      items,
    });
    return NextResponse.json({ audit }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể xử lý phiếu điều chỉnh kho.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_KHO, PERMISSIONS.QUAN_LY_SACH);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as {
      action?: 'toggleStatus' | 'updatePrice' | 'updateThresholds';
      bookId?: string;
      price?: number;
      minStockThreshold?: number;
      maxStockThreshold?: number;
    };
    if (!body.bookId) return NextResponse.json({ error: 'Thiếu mã sách.' }, { status: 400 });

    if (body.action === 'toggleStatus') {
      const updated = await inventoryService.toggleBusinessStatus(body.bookId);
      return NextResponse.json({ item: updated });
    }

    if (body.action === 'updatePrice') {
      const updated = await inventoryService.updateBookPrice(body.bookId, Number(body.price ?? -1));
      return NextResponse.json({ item: updated });
    }

    const updated = await inventoryService.updateThresholds(
      body.bookId,
      Number(body.minStockThreshold ?? 0),
      Number(body.maxStockThreshold ?? 100)
    );
    return NextResponse.json({ item: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể cập nhật thông tin kho.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
