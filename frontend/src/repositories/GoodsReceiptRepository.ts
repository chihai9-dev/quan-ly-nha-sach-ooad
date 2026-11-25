import { bookstoreStore } from '@/lib/mock/bookstoreStore';
import type {
  CreateGoodsReceiptDTO,
  CreateSupplierPaymentDTO,
  GoodsReceiptDTO,
  GoodsReceiptItemDTO,
  SupplierPaymentDTO,
} from '@/types/dtos';

export interface IGoodsReceiptRepository {
  findAllReceipts(supplierId?: string): Promise<GoodsReceiptDTO[]>;
  createReceipt(dto: CreateGoodsReceiptDTO): Promise<GoodsReceiptDTO>;
  findAllPayments(supplierId?: string): Promise<SupplierPaymentDTO[]>;
  createPayment(dto: CreateSupplierPaymentDTO): Promise<SupplierPaymentDTO>;
}

export class GoodsReceiptRepository implements IGoodsReceiptRepository {
  async findAllReceipts(supplierId?: string): Promise<GoodsReceiptDTO[]> {
    const list = [...bookstoreStore.goodsReceipts];
    if (!supplierId) return list;
    return list.filter((r) => r.supplierId === supplierId);
  }

  async createReceipt(dto: CreateGoodsReceiptDTO): Promise<GoodsReceiptDTO> {
    const supplier = bookstoreStore.suppliers.find((s) => s.id === dto.supplierId);
    if (!supplier) throw new Error('Nhà cung cấp không tồn tại.');
    if (!dto.items.length) throw new Error('Phiếu nhập phải có ít nhất 1 đầu sách.');

    const items: GoodsReceiptItemDTO[] = dto.items.map((item) => {
      const book = bookstoreStore.books.find((b) => b.id === item.bookId);
      if (!book) throw new Error(`Không tìm thấy sách với mã ${item.bookId}.`);
      if (item.quantity <= 0) throw new Error('Số lượng nhập phải lớn hơn 0.');
      if (item.unitCost < 0) throw new Error('Đơn giá nhập không được âm.');
      book.stockQuantity += item.quantity;
      book.costPrice = item.unitCost;
      return {
        bookId: book.id,
        bookTitle: book.title,
        quantity: item.quantity,
        unitCost: item.unitCost,
        subtotal: item.quantity * item.unitCost,
      };
    });

    const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
    const discountAmount = Math.max(0, dto.discountAmount ?? 0);
    const totalAmount = Math.max(0, subtotal - discountAmount);
    const paidAmount = Math.min(totalAmount, Math.max(0, dto.paidAmount ?? 0));
    const remainingDebt = totalAmount - paidAmount;

    const receipt: GoodsReceiptDTO = {
      id: `pn-${Date.now()}`,
      receiptCode: `PN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(bookstoreStore.goodsReceipts.length + 1).padStart(2, '0')}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      staffName: dto.staffName,
      createdAt: new Date().toISOString(),
      items,
      discountAmount,
      totalAmount,
      paidAmount,
      remainingDebt,
      paymentStatus: remainingDebt === 0 ? 'PAID' : paidAmount > 0 ? 'PARTIAL' : 'UNPAID',
      note: dto.note,
    };

    bookstoreStore.goodsReceipts.unshift(receipt);
    supplier.totalImported += totalAmount;
    supplier.totalPaid += paidAmount;
    supplier.currentDebt += remainingDebt;

    return receipt;
  }

  async findAllPayments(supplierId?: string): Promise<SupplierPaymentDTO[]> {
    const list = [...bookstoreStore.supplierPayments];
    if (!supplierId) return list;
    return list.filter((p) => p.supplierId === supplierId);
  }

  async createPayment(dto: CreateSupplierPaymentDTO): Promise<SupplierPaymentDTO> {
    const supplier = bookstoreStore.suppliers.find((s) => s.id === dto.supplierId);
    if (!supplier) throw new Error('Không tìm thấy nhà cung cấp.');
    if (dto.amount <= 0) throw new Error('Số tiền thanh toán phải lớn hơn 0.');
    if (dto.amount > supplier.currentDebt) {
      throw new Error(`Số tiền thanh toán vượt quá công nợ hiện tại (${supplier.currentDebt.toLocaleString('vi-VN')} đ).`);
    }

    let receiptCode: string | undefined;
    if (dto.receiptId) {
      const receipt = bookstoreStore.goodsReceipts.find((r) => r.id === dto.receiptId);
      if (receipt) {
        if (dto.amount > receipt.remainingDebt) {
          throw new Error(`Số tiền vượt quá dư nợ còn lại của phiếu ${receipt.receiptCode}.`);
        }
        receipt.paidAmount += dto.amount;
        receipt.remainingDebt -= dto.amount;
        receipt.paymentStatus = receipt.remainingDebt === 0 ? 'PAID' : 'PARTIAL';
        receiptCode = receipt.receiptCode;
      }
    }

    supplier.totalPaid += dto.amount;
    supplier.currentDebt = Math.max(0, supplier.currentDebt - dto.amount);

    const payment: SupplierPaymentDTO = {
      id: `pt-${Date.now()}`,
      paymentCode: `PC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(bookstoreStore.supplierPayments.length + 1).padStart(2, '0')}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      receiptId: dto.receiptId,
      receiptCode,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      staffName: dto.staffName,
      paidAt: new Date().toISOString(),
      note: dto.note,
    };
    bookstoreStore.supplierPayments.unshift(payment);
    return payment;
  }
}
