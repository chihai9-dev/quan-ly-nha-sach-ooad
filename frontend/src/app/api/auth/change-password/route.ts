import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/AuthService';
import { requireAuth } from '@/lib/auth/rbac';
import type { ChangePasswordDTO } from '@/types/dtos';

const authService = new AuthService();

export async function POST(request: NextRequest) {
  const auth = requireAuth();
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Partial<ChangePasswordDTO>;
    await authService.doiMatKhau(auth.user.tenDangNhap, {
      matKhauCu: body.matKhauCu ?? '',
      matKhauMoi: body.matKhauMoi ?? '',
    });

    return NextResponse.json({ message: 'Đổi mật khẩu thành công.' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể đổi mật khẩu.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
