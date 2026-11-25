import { NextRequest, NextResponse } from 'next/server';
import { PromotionService } from '@/services/PromotionService';
import { requireAuth, requirePermission } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';

const promotionService = new PromotionService();

export async function GET(request: NextRequest) {
  const auth = requireAuth();
  if (!auth.ok) return auth.response;

  try {
    const validateCode = request.nextUrl.searchParams.get('validateCode');
    if (validateCode) {
      const subtotal = Number(request.nextUrl.searchParams.get('subtotal') ?? 0);
      const result = await promotionService.validateCoupon(validateCode, subtotal);
      return NextResponse.json(result);
    }

    const data = await promotionService.getAll();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi tải khuyến mãi.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_KHUYEN_MAI);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (body.type === 'coupon') {
      const coupon = await promotionService.createCoupon({
        code: String(body.code ?? ''),
        discountAmount: Number(body.discountAmount ?? 0),
        minOrderAmount: Number(body.minOrderAmount ?? 0),
        maxUses: Number(body.maxUses ?? 1),
        expiryDate: String(body.expiryDate ?? ''),
      });
      return NextResponse.json({ coupon }, { status: 201 });
    }

    const promotion = await promotionService.createPromotion({
      code: body.code ? String(body.code) : undefined,
      name: String(body.name ?? ''),
      discountType: body.discountType === 'FIXED' ? 'FIXED' : 'PERCENT',
      discountValue: Number(body.discountValue ?? 0),
      scope: body.scope === 'CATEGORY' || body.scope === 'BOOK' ? body.scope : 'ALL',
      startDate: String(body.startDate ?? ''),
      endDate: String(body.endDate ?? ''),
      description: body.description ? String(body.description) : undefined,
    });
    return NextResponse.json({ promotion }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể tạo khuyến mãi / mã giảm giá.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_KHUYEN_MAI);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as { id?: string };
    if (!body.id) return NextResponse.json({ error: 'Thiếu ID chương trình khuyến mãi.' }, { status: 400 });
    const updated = await promotionService.stopPromotion(body.id);
    return NextResponse.json({ promotion: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể ngừng chương trình.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
