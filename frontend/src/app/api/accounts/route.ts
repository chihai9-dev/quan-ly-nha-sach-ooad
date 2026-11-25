import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/AuthService';
import { requirePermission } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';
import type { CreateAccountDTO } from '@/types/dtos';

const authService = new AuthService();

export async function GET() {
  const auth = requirePermission(
    PERMISSIONS.QUAN_LY_HE_THONG,
    PERMISSIONS.QUAN_LY_TAI_KHOAN,
    PERMISSIONS.QUAN_LY_NHAN_VIEN
  );
  if (!auth.ok) return auth.response;

  try {
    const accounts = await authService.layDanhSachTaiKhoan();
    return NextResponse.json({ accounts });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi tải danh sách tài khoản.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requirePermission(
    PERMISSIONS.QUAN_LY_HE_THONG,
    PERMISSIONS.QUAN_LY_TAI_KHOAN
  );
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Partial<CreateAccountDTO>;
    const created = await authService.taoTaiKhoan({
      tenDangNhap: body.tenDangNhap ?? '',
      matKhau: body.matKhau ?? '',
      emailKhoiPhuc: body.emailKhoiPhuc ?? '',
      maVaiTro: body.maVaiTro ?? 'NHAN_VIEN_BAN_HANG',
      maNV: body.maNV ?? '',
      hoTen: body.hoTen ?? '',
      soDienThoai: body.soDienThoai,
      diaChi: body.diaChi,
    });

    return NextResponse.json(
      { account: created, message: 'Tạo tài khoản nhân viên thành công.' },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể tạo tài khoản.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
