import { NextRequest, NextResponse } from 'next/server';
import { CustomerService } from '@/services/CustomerService';
import { requireAuth, requirePermission } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';
import type { CreateCustomerDTO, UpdateCustomerDTO } from '@/types/dtos';

const customerService = new CustomerService();

export async function GET(request: NextRequest) {
  const auth = requireAuth();
  if (!auth.ok) return auth.response;

  try {
    const q = request.nextUrl.searchParams.get('q') ?? undefined;
    const customers = await customerService.getCustomers(q);
    return NextResponse.json({ customers });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi tải danh sách khách hàng.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_KHACH_HANG, PERMISSIONS.QUAN_LY_BAN_HANG);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Partial<CreateCustomerDTO>;
    const created = await customerService.addCustomer({
      fullName: body.fullName ?? '',
      phoneNumber: body.phoneNumber ?? '',
      email: body.email,
      address: body.address,
    });
    return NextResponse.json({ customer: created }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể thêm khách hàng.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_KHACH_HANG, PERMISSIONS.QUAN_LY_BAN_HANG);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Partial<UpdateCustomerDTO>;
    if (!body.id) return NextResponse.json({ error: 'Thiếu ID khách hàng.' }, { status: 400 });
    const updated = await customerService.updateCustomer({
      id: body.id,
      fullName: body.fullName,
      phoneNumber: body.phoneNumber,
      email: body.email,
      address: body.address,
      loyaltyPoints: body.loyaltyPoints !== undefined ? Number(body.loyaltyPoints) : undefined,
    });
    return NextResponse.json({ customer: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể cập nhật khách hàng.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
