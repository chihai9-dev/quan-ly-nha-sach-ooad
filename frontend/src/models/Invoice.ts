import { BaseEntity } from './BaseEntity';
import type { PaymentMethod, PaymentStatus } from '@/types/dtos';
import type { Database } from '@/types/database.types';

export interface InvoiceProps {
  id: string;
  invoiceCode: string;
  orderId: string;
  paymentMethod: PaymentMethod;
  paidAmount: number;
  changeAmount?: number;
  paymentStatus?: PaymentStatus;
  issuedAt?: Date | string;
}

/**
 * Lớp Thực thể Hóa đơn (Invoice Entity)
 * Quản lý giao dịch thanh toán, tính tiền thối và lập biên lai bán lẻ.
 */
export class Invoice extends BaseEntity {
  private readonly _invoiceCode: string;
  private readonly _orderId: string;
  private _paymentMethod: PaymentMethod;
  private _paidAmount: number;
  private _changeAmount: number;
  private _paymentStatus: PaymentStatus;
  private readonly _issuedAt: Date;

  constructor(props: InvoiceProps) {
    super(props.id, props.issuedAt, props.issuedAt);
    this._invoiceCode = props.invoiceCode;
    this._orderId = props.orderId;
    this._paymentMethod = props.paymentMethod;
    this._paidAmount = props.paidAmount;
    this._changeAmount = props.changeAmount ?? 0;
    this._paymentStatus = props.paymentStatus || 'PAID';
    this._issuedAt = props.issuedAt ? new Date(props.issuedAt) : new Date();
  }

  public get invoiceCode(): string {
    return this._invoiceCode;
  }

  public get orderId(): string {
    return this._orderId;
  }

  public get paymentMethod(): PaymentMethod {
    return this._paymentMethod;
  }

  public get paidAmount(): number {
    return this._paidAmount;
  }

  public get changeAmount(): number {
    return this._changeAmount;
  }

  public get paymentStatus(): PaymentStatus {
    return this._paymentStatus;
  }

  public get issuedAt(): Date {
    return this._issuedAt;
  }

  /**
   * Xác thực và tính toán tiền thối dựa trên tổng tiền cần thanh toán
   */
  public processPayment(totalDue: number): void {
    if (this._paidAmount < totalDue) {
      throw new Error(
        `Số tiền khách trả (${this._paidAmount.toLocaleString()} đ) không đủ để thanh toán đơn hàng (${totalDue.toLocaleString()} đ).`
      );
    }
    this._changeAmount = this._paidAmount - totalDue;
    this._paymentStatus = 'PAID';
    this.touch();
  }

  public toDatabase(): Database['public']['Tables']['invoices']['Insert'] {
    return {
      id: this.id,
      invoice_code: this._invoiceCode,
      order_id: this._orderId,
      payment_method: this._paymentMethod,
      paid_amount: this._paidAmount,
      change_amount: this._changeAmount,
      payment_status: this._paymentStatus,
      issued_at: this._issuedAt.toISOString(),
    };
  }
}
