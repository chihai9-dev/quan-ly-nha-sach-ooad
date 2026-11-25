import { NextRequest, NextResponse } from 'next/server';
import { SupplierService } from '@/services/SupplierService';
import { requirePermission } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';
import type { CreateSupplierDTO, UpdateSupplierDTO } from '@/types/dtos';

const supplierService = new SupplierService();

export async function GET(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_NHA_CUNG_CAP, PERMISSIONS.QUAN_LY_NHAP_HANG);
  if (!auth.ok) return auth.response;

  try {
    const q = request.nextUrl.searchParams.get('q') ?? undefined;
    const suppliers = await supplierService.getSuppliers(q);
    return NextResponse.json({ suppliers });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi tải danh sách nhà cung cấp.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_NHA_CUNG_CAP, PERMISSIONS.QUAN_LY_NHAP_HANG);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Partial<CreateSupplierDTO>;
    const created = await supplierService.addSupplier({
      code: body.code,
      name: body.name ?? '',
      phoneNumber: body.phoneNumber ?? '',
      email: body.email,
      address: body.address ?? '',
      bankAccount: body.bankAccount,
    });
    return NextResponse.json({ supplier: created }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể thêm nhà cung cấp.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_NHA_CUNG_CAP);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Partial<UpdateSupplierDTO>;
    if (!body.id) return NextResponse.json({ error: 'Thiếu ID nhà cung cấp.' }, { status: 400 });
    const updated = await supplierService.updateSupplier({
      id: body.id,
      name: body.name,
      phoneNumber: body.phoneNumber,
      email: body.email,
      address: body.address,
      bankAccount: body.bankAccount,
      isActive: body.isActive,
    });
    return NextResponse.json({ supplier: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể cập nhật nhà cung cấp.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
