import { BaseEntity } from './BaseEntity';
import { OrderItem } from './OrderItem';
import { Book } from './Book';
import { Customer } from './Customer';
import type { OrderStatus } from '@/types/dtos';
import type { Database } from '@/types/database.types';

export interface OrderProps {
  id: string;
  orderCode: string;
  customerId?: string | null;
  cashierName?: string | null;
  items?: OrderItem[];
  status?: OrderStatus;
  discountAmount?: number;
  taxRate?: number; // Ví dụ: 0.08 cho 8% VAT
  note?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp Thực thể Đơn hàng (Order Entity)
 * Là Aggregate Root quản lý danh sách OrderItem và toàn bộ logic tính toán tài chính.
 */
export class Order extends BaseEntity {
  private readonly _orderCode: string;
  private _customerId: string | null;
  private _cashierName: string;
  private _items: OrderItem[];
  private _status: OrderStatus;
  private _discountAmount: number;
  private _taxRate: number;
  private _note: string;

  constructor(props: OrderProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._orderCode = props.orderCode;
    this._customerId = props.customerId || null;
    this._cashierName = props.cashierName || 'Thu ngân 01';
    this._items = props.items ? [...props.items] : [];
    this._status = props.status || 'PENDING';
    this._discountAmount = props.discountAmount ?? 0;
    this._taxRate = props.taxRate ?? 0.08; // 8% VAT mặc định
    this._note = props.note || '';
  }

  // --- Getters ---
  public get orderCode(): string {
    return this._orderCode;
  }

  public get customerId(): string | null {
    return this._customerId;
  }

  public get cashierName(): string {
    return this._cashierName;
  }

  public get items(): ReadonlyArray<OrderItem> {
    return [...this._items];
  }

  public get status(): OrderStatus {
    return this._status;
  }

  public get discountAmount(): number {
    return this._discountAmount;
  }

  public get taxRate(): number {
    return this._taxRate;
  }

  public get note(): string {
    return this._note;
  }

  // --- Nghiệp vụ quản lý giỏ hàng & sản phẩm ---

  /**
   * Thêm sách vào đơn hàng. Nếu sách đã có thì cộng dồn số lượng.
   */
  public addItem(book: Book, quantity: number = 1): void {
    if (this._status !== 'PENDING') {
      throw new Error('Không thể sửa đổi đơn hàng đã hoàn tất hoặc đã hủy.');
    }
    if (quantity <= 0) {
      throw new Error('Số lượng thêm phải lớn hơn 0.');
    }

    const existingIndex = this._items.findIndex(item => item.bookId === book.getId());

    if (existingIndex > -1) {
      const existingItem = this._items[existingIndex];
      const newTotalQty = existingItem.quantity + quantity;
      if (!book.isAvailable(newTotalQty)) {
        throw new Error(`Kho chỉ còn ${book.stockQuantity} cuốn sách "${book.title}".`);
      }
      existingItem.increaseQuantity(quantity);
    } else {
      if (!book.isAvailable(quantity)) {
        throw new Error(`Kho chỉ còn ${book.stockQuantity} cuốn sách "${book.title}".`);
      }
      const newItem = new OrderItem({
        bookId: book.getId(),
        bookTitle: book.title,
        bookIsbn: book.isbn,
        unitPrice: book.price,
        quantity: quantity,
        coverUrl: book.coverUrl,
      });
      this._items.push(newItem);
    }
    this.touch();
  }

  /**
   * Xóa một sản phẩm khỏi đơn hàng
   */
  public removeItem(bookId: string): void {
    if (this._status !== 'PENDING') {
      throw new Error('Không thể chỉnh sửa đơn hàng không ở trạng thái chờ.');
    }
    this._items = this._items.filter(item => item.bookId !== bookId);
    this.touch();
  }

  /**
   * Cập nhật số lượng của một sản phẩm trong đơn hàng
   */
  public updateItemQuantity(bookId: string, quantity: number, availableStock?: number): void {
    if (this._status !== 'PENDING') {
      throw new Error('Đơn hàng không ở trạng thái chỉnh sửa.');
    }
    if (quantity <= 0) {
      this.removeItem(bookId);
      return;
    }
    if (availableStock !== undefined && quantity > availableStock) {
      throw new Error(`Số lượng yêu cầu vượt quá tồn kho hiện tại (${availableStock}).`);
    }

    const item = this._items.find(i => i.bookId === bookId);
    if (item) {
      item.setQuantity(quantity);
      this.touch();
    }
  }

  /**
   * Xóa toàn bộ sản phẩm trong giỏ hàng
   */
  public clear(): void {
    this._items = [];
    this.touch();
  }

  // --- Nghiệp vụ tính toán tài chính (Financial Calculations) ---

  /**
   * Tính tổng tiền hàng trước thuế và giảm giá
   */
  public calculateSubtotal(): number {
    return this._items.reduce((sum, item) => sum + item.getSubtotal(), 0);
  }

  /**
   * Áp dụng chiết khấu theo thành viên khách hàng
   */
  public applyCustomerDiscount(customer: Customer): void {
    const subtotal = this.calculateSubtotal();
    const discountRate = customer.getDiscountRate();
    this._discountAmount = Math.round(subtotal * discountRate);
    this._customerId = customer.getId();
    this.touch();
  }

  /**
   * Thiết lập giá trị giảm giá thủ công
   */
  public setDiscountAmount(amount: number): void {
    const subtotal = this.calculateSubtotal();
    if (amount < 0 || amount > subtotal) {
      throw new Error('Số tiền giảm giá không hợp lệ.');
    }
    this._discountAmount = amount;
    this.touch();
  }

  /**
   * Tính thuế VAT
   */
  public calculateTax(): number {
    const amountAfterDiscount = Math.max(0, this.calculateSubtotal() - this._discountAmount);
    return Math.round(amountAfterDiscount * this._taxRate);
  }

  /**
   * Tính tổng số tiền cuối cùng phải thanh toán
   */
  public calculateFinalTotal(): number {
    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax();
    return Math.max(0, subtotal - this._discountAmount + tax);
  }

  /**
   * Tổng số lượng sách trong đơn hàng
   */
  public getTotalItemQuantity(): number {
    return this._items.reduce((count, item) => count + item.quantity, 0);
  }

  // --- Quản lý trạng thái vòng đời đơn hàng ---

  public complete(): void {
    if (this._items.length === 0) {
      throw new Error('Không thể hoàn tất đơn hàng rỗng.');
    }
    this._status = 'COMPLETED';
    this.touch();
  }

  public cancel(reason?: string): void {
    this._status = 'CANCELLED';
    if (reason) {
      this._note = (this._note ? this._note + ' | ' : '') + `Lý do hủy: ${reason}`;
    }
    this.touch();
  }

  /**
   * Chuyển đổi dữ liệu sang dạng chèn vào Supabase
   */
  public toDatabase(): Database['public']['Tables']['orders']['Insert'] {
    return {
      id: this.id,
      order_code: this._orderCode,
      customer_id: this._customerId,
      status: this._status,
      subtotal: this.calculateSubtotal(),
      discount_amount: this._discountAmount,
      tax_amount: this.calculateTax(),
      total_amount: this.calculateFinalTotal(),
      cashier_name: this._cashierName,
      note: this._note || null,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }
}
