import { NextRequest, NextResponse } from 'next/server';
import { BookService } from '@/services/BookService';
import { requireAuth, requirePermission } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';
import type { CreateBookDTO, UpdateBookDTO } from '@/types/dtos';
import type { Sach } from '@/models/Sach';

const bookService = new BookService();

function serializeSach(s: Sach) {
  return {
    maSach: s.maSach,
    tenSach: s.tenSach,
    namXuatBan: s.namXuatBan,
    giaNhap: s.giaNhap,
    giaBan: s.giaBan,
    giaSauKhuyenMai: s.tinhGiaBanSauKhuyenMai(),
    soLuongTon: s.soLuongTon,
    mucTonToiThieu: s.mucTonToiThieu,
    trangThai: s.trangThai,
    trangThaiTonKho: s.layTrangThaiTonKho(),
    theLoai: s.theLoai ? { maTheLoai: s.theLoai.maTheLoai, tenTheLoai: s.theLoai.tenTheLoai } : null,
    nhaXuatBan: s.nhaXuatBan ? { maNXB: s.nhaXuatBan.maNXB, tenNXB: s.nhaXuatBan.tenNXB } : null,
    danhSachTacGia: s.danhSachTacGia.map((tg) => ({ maTacGia: tg.maTacGia, tenTacGia: tg.tenTacGia })),
    chuongTrinhKhuyenMai: s.chuongTrinhKhuyenMai
      ? {
          maCTKM: s.chuongTrinhKhuyenMai.maCTKM,
          tenCTKM: s.chuongTrinhKhuyenMai.tenCTKM,
          phanTramGiam: s.chuongTrinhKhuyenMai.phanTramGiam,
        }
      : null,
  };
}

export async function GET(request: NextRequest) {
  const auth = requireAuth();
  if (!auth.ok) return auth.response;

  try {
    const searchTerm = request.nextUrl.searchParams.get('q') ?? undefined;
    const categoryId = request.nextUrl.searchParams.get('categoryId') ?? undefined;
    const books = await bookService.getAllBooks({ searchTerm, categoryId });
    return NextResponse.json({ books: books.map(serializeSach) });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi tải danh sách sách.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_SACH);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Partial<CreateBookDTO>;
    const created = await bookService.addNewBook({
      isbn: body.isbn ?? '',
      title: body.title ?? '',
      author: body.author ?? '',
      authorIds: body.authorIds,
      publisher: body.publisher,
      publisherId: body.publisherId,
      publishYear: body.publishYear ? Number(body.publishYear) : undefined,
      costPrice: body.costPrice !== undefined ? Number(body.costPrice) : undefined,
      price: Number(body.price ?? 0),
      stockQuantity: Number(body.stockQuantity ?? 0),
      minStockThreshold: body.minStockThreshold !== undefined ? Number(body.minStockThreshold) : 5,
      categoryId: body.categoryId,
      promotionId: body.promotionId ?? null,
    });
    return NextResponse.json({ book: serializeSach(created) }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể tạo sách.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_SACH);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Partial<UpdateBookDTO>;
    if (!body.id) return NextResponse.json({ error: 'Thiếu mã sách cần cập nhật.' }, { status: 400 });
    const updated = await bookService.updateBookInfo({
      ...body,
      id: body.id,
      price: body.price !== undefined ? Number(body.price) : undefined,
      costPrice: body.costPrice !== undefined ? Number(body.costPrice) : undefined,
      stockQuantity: body.stockQuantity !== undefined ? Number(body.stockQuantity) : undefined,
      minStockThreshold: body.minStockThreshold !== undefined ? Number(body.minStockThreshold) : undefined,
      publishYear: body.publishYear !== undefined ? Number(body.publishYear) : undefined,
    });
    return NextResponse.json({ book: serializeSach(updated) });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể cập nhật sách.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_SACH);
  if (!auth.ok) return auth.response;

  try {
    const id = request.nextUrl.searchParams.get('id') ?? '';
    if (!id) return NextResponse.json({ error: 'Thiếu mã sách cần xóa.' }, { status: 400 });
    const result = await bookService.deleteBook(id);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể xóa sách.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
