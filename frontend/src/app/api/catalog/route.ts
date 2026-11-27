import { NextRequest, NextResponse } from 'next/server';
import { CatalogService } from '@/services/CatalogService';
import { requireAuth, requirePermission } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';

const catalogService = new CatalogService();

export async function GET(request: NextRequest) {
  const auth = requireAuth();
  if (!auth.ok) return auth.response;

  try {
    const q = request.nextUrl.searchParams.get('q') ?? undefined;
    const data = await catalogService.getAllCatalog(q);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi tải danh mục sách.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_DANH_MUC_SACH);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const type = String(body.type ?? '');

    if (type === 'category') {
      const created = await catalogService.addCategory(
        String(body.code ?? ''),
        String(body.name ?? ''),
        String(body.description ?? '')
      );
      return NextResponse.json({ item: created }, { status: 201 });
    }
    if (type === 'author') {
      const created = await catalogService.addAuthor(
        String(body.name ?? ''),
        String(body.penName ?? ''),
        String(body.nationality ?? ''),
        String(body.biography ?? '')
      );
      return NextResponse.json({ item: created }, { status: 201 });
    }
    if (type === 'publisher') {
      const created = await catalogService.addPublisher(
        String(body.name ?? ''),
        String(body.address ?? ''),
        String(body.phoneNumber ?? ''),
        String(body.contactPerson ?? '')
      );
      return NextResponse.json({ item: created }, { status: 201 });
    }

    return NextResponse.json({ error: 'Loại danh mục không hợp lệ.' }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể tạo danh mục.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_DANH_MUC_SACH);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = String(body.id ?? '');
    if (!id) return NextResponse.json({ error: 'Thiếu mã danh mục.' }, { status: 400 });

    const type = String(body.type ?? '');
    if (type === 'category') {
      const updated = await catalogService.updateCategory(
        id,
        String(body.name ?? ''),
        String(body.description ?? '')
      );
      return NextResponse.json({ item: updated });
    }
    if (type === 'author') {
      const updated = await catalogService.updateAuthor(
        id,
        String(body.name ?? ''),
        String(body.penName ?? ''),
        String(body.nationality ?? ''),
        String(body.biography ?? '')
      );
      return NextResponse.json({ item: updated });
    }
    if (type === 'publisher') {
      const updated = await catalogService.updatePublisher(
        id,
        String(body.name ?? ''),
        String(body.address ?? ''),
        String(body.phoneNumber ?? ''),
        String(body.contactPerson ?? '')
      );
      return NextResponse.json({ item: updated });
    }

    const updated = await catalogService.toggleCategoryStatus(id);
    return NextResponse.json({ item: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể cập nhật danh mục.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_DANH_MUC_SACH);
  if (!auth.ok) return auth.response;

  try {
    const type = request.nextUrl.searchParams.get('type') ?? '';
    const id = request.nextUrl.searchParams.get('id') ?? '';
    if (!id) return NextResponse.json({ error: 'Thiếu mã đối tượng cần xóa.' }, { status: 400 });

    if (type === 'category') {
      await catalogService.deleteCategory(id);
      return NextResponse.json({ ok: true });
    }
    if (type === 'author') {
      await catalogService.deleteAuthor(id);
      return NextResponse.json({ ok: true });
    }
    if (type === 'publisher') {
      await catalogService.deletePublisher(id);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Loại danh mục không hợp lệ.' }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể xóa danh mục.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
