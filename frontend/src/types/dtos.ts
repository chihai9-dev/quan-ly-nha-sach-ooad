export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'MOMO' | 'CARD';
export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';
export type CustomerTier = 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM';
export type PaymentStatus = 'PAID' | 'REFUNDED';

export interface CreateBookDTO {
  isbn: string;
  title: string;
  author: string;
  publisher?: string;
  publishYear?: number;
  price: number;
  stockQuantity: number;
  coverUrl?: string;
  categoryId?: string;
}

export interface UpdateBookDTO extends Partial<CreateBookDTO> {
  id: string;
}

export interface BookFilterParams {
  searchTerm?: string;
  categoryId?: string;
  inStockOnly?: boolean;
}

export interface OrderItemDTO {
  bookId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderDTO {
  customerId?: string;
  cashierName?: string;
  items: OrderItemDTO[];
  discountAmount?: number;
  note?: string;
}

export interface CheckoutDTO {
  orderId: string;
  paymentMethod: PaymentMethod;
  paidAmount: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
