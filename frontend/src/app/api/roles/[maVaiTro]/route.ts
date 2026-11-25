import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/AuthService';
import { requirePermission } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';
import type { UpdatePermissionsDTO } from '@/types/dtos';

const authService = new AuthService();

export async function PUT(
  request: NextRequest,
  context: { params: { maVaiTro: string } }
) {
  const auth = requirePermission(PERMISSIONS.PHAN_QUYEN);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Partial<UpdatePermissionsDTO>;
    if (!Array.isArray(body.danhSachQuyen)) {
      return NextResponse.json(
        { error: 'danhSachQuyen phải là một mảng chuỗi.' },
        { status: 400 }
      );
    }

    const updated = await authService.phanQuyen(
      context.params.maVaiTro,
      body.danhSachQuyen
    );

    return NextResponse.json({
      role: {
        maVaiTro: updated.maVaiTro,
        tenVaiTro: updated.tenVaiTro,
        danhSachQuyen: [...updated.danhSachQuyen],
      },
      message: `Đã cập nhật phân quyền cho vai trò "${updated.tenVaiTro}".`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi cập nhật phân quyền.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
