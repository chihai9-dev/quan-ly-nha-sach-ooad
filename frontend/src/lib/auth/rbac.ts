import { NextResponse } from 'next/server';
import { getServerSession } from './session';
import type { PermissionCode } from './permissions';
import type { SessionUserDTO } from '@/types/dtos';

export type AuthGuardSuccess = { ok: true; user: SessionUserDTO };
export type AuthGuardFailure = { ok: false; response: NextResponse };
export type AuthGuardResult = AuthGuardSuccess | AuthGuardFailure;

/**
 * Yêu cầu người dùng đã đăng nhập (Actor: Người dùng hệ thống)
 */
export function requireAuth(): AuthGuardResult {
  const user = getServerSession();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: 'Chưa đăng nhập hoặc phiên làm việc đã hết hạn.',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      ),
    };
  }
  return { ok: true, user };
}

/**
 * Yêu cầu người dùng có ít nhất một trong các quyền chỉ định theo Role / Actor
 */
export function requirePermission(
  ...requiredPermissions: PermissionCode[]
): AuthGuardResult {
  const auth = requireAuth();
  if (!auth.ok) return auth;

  const hasPerm = requiredPermissions.some((perm) =>
    auth.user.danhSachQuyen.includes(perm)
  );

  if (!hasPerm) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: `Vai trò "${auth.user.tenVaiTro}" không có quyền thực hiện chức năng này (Yêu cầu: ${requiredPermissions.join(' hoặc ')}).`,
          code: 'FORBIDDEN',
        },
        { status: 403 }
      ),
    };
  }

  return auth;
}
