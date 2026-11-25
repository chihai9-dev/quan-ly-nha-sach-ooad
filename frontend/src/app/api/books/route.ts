import { NextRequest, NextResponse } from 'next/server';
import { BookService } from '@/services/BookService';
import { requireAuth, requirePermission } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';
import type { CreateBookDTO } from '@/types/dtos';

const bookService = new BookService();

/**
 * GET /api/books: Mọi người dùng đã đăng nhập đều có thể tra cứu sách
 */
export async function GET(request: NextRequest) {
  const auth = requireAuth();
  if (!auth.ok) return auth.response;

  try {
    const searchTerm = request.nextUrl.searchParams.get('q') ?? undefined;
    const books = await bookService.getAllBooks({ searchTerm });
    return NextResponse.json({
      books: books.map((b) => ({
        id: b.getId(),
        isbn: b.isbn,
        title: b.title,
        author: b.author,
        publisher: b.publisher,
        publishYear: b.publishYear,
        price: b.price,
        stockQuantity: b.stockQuantity,
        coverUrl: b.coverUrl,
        categoryId: b.categoryId,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi tải danh sách sách.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/books: Chỉ Actor "Nhân viên kho" (QUAN_LY_SACH) mới được thêm sách mới
 */
export async function POST(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_SACH);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Partial<CreateBookDTO>;
    const created = await bookService.addNewBook({
      isbn: body.isbn ?? '',
      title: body.title ?? '',
      author: body.author ?? '',
      publisher: body.publisher,
      publishYear: body.publishYear,
      price: Number(body.price ?? 0),
      stockQuantity: Number(body.stockQuantity ?? 0),
      coverUrl: body.coverUrl,
      categoryId: body.categoryId,
    });

    return NextResponse.json(
      {
        book: {
          id: created.getId(),
          isbn: created.isbn,
          title: created.title,
          price: created.price,
          stockQuantity: created.stockQuantity,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể tạo sách.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
