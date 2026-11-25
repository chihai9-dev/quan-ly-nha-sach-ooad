import { NextRequest, NextResponse } from 'next/server';
import { GoodsReceiptService } from '@/services/GoodsReceiptService';
import { SupplierService } from '@/services/SupplierService';
import { InventoryService } from '@/services/InventoryService';
import { requirePermission } from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';
import type { CreateGoodsReceiptDTO, CreateSupplierPaymentDTO, PaymentMethod } from '@/types/dtos';

const receiptService = new GoodsReceiptService();
const supplierService = new SupplierService();
const inventoryService = new InventoryService();

export async function GET(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_NHAP_HANG, PERMISSIONS.QUAN_LY_NHA_CUNG_CAP);
  if (!auth.ok) return auth.response;

  try {
    const supplierId = request.nextUrl.searchParams.get('supplierId') ?? undefined;
    const [receipts, payments, suppliers, books] = await Promise.all([
      receiptService.getReceipts(supplierId),
      receiptService.getPayments(supplierId),
      supplierService.getSuppliers(),
      inventoryService.getInventory(),
    ]);
    return NextResponse.json({ receipts, payments, suppliers, books });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi tải dữ liệu nhập hàng.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.QUAN_LY_NHAP_HANG);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (body.action === 'payment') {
      const dto: CreateSupplierPaymentDTO = {
        supplierId: String(body.supplierId ?? ''),
        receiptId: body.receiptId ? String(body.receiptId) : undefined,
        amount: Number(body.amount ?? 0),
        paymentMethod: (body.paymentMethod as PaymentMethod) ?? 'BANK_TRANSFER',
        staffName: auth.user.hoTen,
        note: body.note ? String(body.note) : undefined,
      };
      const payment = await receiptService.recordPayment(dto);
      return NextResponse.json({ payment }, { status: 201 });
    }

    const dto: CreateGoodsReceiptDTO = {
      supplierId: String(body.supplierId ?? ''),
      staffName: auth.user.hoTen,
      items: Array.isArray(body.items)
        ? (body.items as Array<{ bookId: string; quantity: number; unitCost: number }>).map((i) => ({
            bookId: String(i.bookId),
            quantity: Number(i.quantity),
            unitCost: Number(i.unitCost),
          }))
        : [],
      discountAmount: Number(body.discountAmount ?? 0),
      paidAmount: Number(body.paidAmount ?? 0),
      note: body.note ? String(body.note) : undefined,
    };

    const receipt = await receiptService.createReceipt(dto);
    return NextResponse.json({ receipt }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể xử lý yêu cầu nhập hàng.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
