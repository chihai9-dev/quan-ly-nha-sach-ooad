import { NextRequest, NextResponse } from 'next/server';
import { StaffService } from '@/services/StaffService';
import { requirePermission } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';
import type { CreateStaffDTO, EmploymentStatus, StaffDTO, UpdateStaffDTO } from '@/types/dtos';

const staffService = new StaffService();

export async function GET(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_NHAN_VIEN);
  if (!auth.ok) return auth.response;

  try {
    const q = request.nextUrl.searchParams.get('q') ?? undefined;
    const staff = await staffService.getStaffList(q);
    return NextResponse.json({ staff });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi tải danh sách nhân viên.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_NHAN_VIEN);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Partial<CreateStaffDTO>;
    const roleCode = (body.roleCode ?? 'NHAN_VIEN_BAN_HANG') as StaffDTO['roleCode'];
    const created = await staffService.addStaff({
      fullName: body.fullName ?? '',
      phoneNumber: body.phoneNumber ?? '',
      email: body.email ?? '',
      address: body.address,
      position: body.position ?? '',
      roleCode,
    });
    return NextResponse.json({ staff: created }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể thêm nhân viên.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_NHAN_VIEN);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Partial<UpdateStaffDTO>;
    if (!body.id) return NextResponse.json({ error: 'Thiếu mã nhân viên.' }, { status: 400 });
    const updated = await staffService.updateStaff({
      id: body.id,
      fullName: body.fullName,
      phoneNumber: body.phoneNumber,
      email: body.email,
      address: body.address,
      position: body.position,
      roleCode: body.roleCode,
      status: body.status as EmploymentStatus | undefined,
    });
    return NextResponse.json({ staff: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể cập nhật nhân viên.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
