import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/AuthService';
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
} from '@/lib/auth/session';
import type { LoginDTO } from '@/types/dtos';

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<LoginDTO>;
    const sessionUser = await authService.dangNhap({
      tenDangNhap: body.tenDangNhap ?? '',
      matKhau: body.matKhau ?? '',
    });

    const token = createSessionToken(sessionUser);
    const response = NextResponse.json({
      user: sessionUser,
      message: `Đăng nhập thành công với vai trò ${sessionUser.tenVaiTro}.`,
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Đăng nhập thất bại.';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
