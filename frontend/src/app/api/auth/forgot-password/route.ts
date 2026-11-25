import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/AuthService';
import type { ForgotPasswordDTO } from '@/types/dtos';

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<ForgotPasswordDTO>;
    const result = await authService.quenMatKhau({
      tenDangNhap: body.tenDangNhap ?? '',
      emailKhoiPhuc: body.emailKhoiPhuc ?? '',
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể xử lý yêu cầu quên mật khẩu.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
