import type { Database } from '@/types/database.types';

export interface OrderItemProps {
  id?: string;
  bookId: string;
  bookTitle: string;
  bookIsbn: string;
  unitPrice: number;
  quantity: number;
  coverUrl?: string;
}

/**
 * Lớp đại diện cho một dòng sản phẩm trong đơn hàng (OrderItem).
 * Thể hiện quan hệ Composition (Chứa đựng phụ thuộc) với Order.
 */
export class OrderItem {
  private readonly _id?: string;
  private readonly _bookId: string;
  private readonly _bookTitle: string;
  private readonly _bookIsbn: string;
  private _unitPrice: number;
  private _quantity: number;
  private readonly _coverUrl?: string;

  constructor(props: OrderItemProps) {
    if (props.quantity <= 0) {
      throw new Error('Số lượng sản phẩm trong đơn hàng phải lớn hơn 0.');
    }
    if (props.unitPrice < 0) {
      throw new Error('Đơn giá không được âm.');
    }

    this._id = props.id;
    this._bookId = props.bookId;
    this._bookTitle = props.bookTitle;
    this._bookIsbn = props.bookIsbn;
    this._unitPrice = props.unitPrice;
    this._quantity = props.quantity;
    this._coverUrl = props.coverUrl;
  }

  public get id(): string | undefined {
    return this._id;
  }

  public get bookId(): string {
    return this._bookId;
  }

  public get bookTitle(): string {
    return this._bookTitle;
  }

  public get bookIsbn(): string {
    return this._bookIsbn;
  }

  public get unitPrice(): number {
    return this._unitPrice;
  }

  public get quantity(): number {
    return this._quantity;
  }

  public get coverUrl(): string | undefined {
    return this._coverUrl;
  }

  /**
   * Tính thành tiền của dòng sản phẩm (Số lượng * Đơn giá)
   */
  public getSubtotal(): number {
    return this._quantity * this._unitPrice;
  }

  public increaseQuantity(amount: number = 1): void {
    if (amount <= 0) return;
    this._quantity += amount;
  }

  public decreaseQuantity(amount: number = 1): void {
    if (amount <= 0) return;
    if (this._quantity - amount <= 0) {
      throw new Error('Số lượng không thể nhỏ hơn hoặc bằng 0.');
    }
    this._quantity -= amount;
  }

  public setQuantity(newQty: number): void {
    if (newQty <= 0) {
      throw new Error('Số lượng phải lớn hơn 0.');
    }
    this._quantity = newQty;
  }

  public toDatabase(orderId: string): Database['public']['Tables']['order_items']['Insert'] {
    return {
      order_id: orderId,
      book_id: this._bookId,
      quantity: this._quantity,
      unit_price: this._unitPrice,
      subtotal: this.getSubtotal(),
    };
  }
}
