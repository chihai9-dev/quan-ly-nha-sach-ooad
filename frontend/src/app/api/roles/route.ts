import { NextResponse } from 'next/server';
import { AuthService } from '@/services/AuthService';
import { requirePermission } from '@/lib/auth/rbac';
import { PERMISSIONS, ALL_PERMISSIONS_LIST } from '@/lib/auth/permissions';

const authService = new AuthService();

export async function GET() {
  const auth = requirePermission(
    PERMISSIONS.QUAN_LY_HE_THONG,
    PERMISSIONS.PHAN_QUYEN
  );
  if (!auth.ok) return auth.response;

  try {
    const roles = await authService.layDanhSachVaiTro();
    return NextResponse.json({
      roles: roles.map((r) => ({
        maVaiTro: r.maVaiTro,
        tenVaiTro: r.tenVaiTro,
        danhSachQuyen: [...r.danhSachQuyen],
      })),
      availablePermissions: ALL_PERMISSIONS_LIST,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi tải danh sách vai trò.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
