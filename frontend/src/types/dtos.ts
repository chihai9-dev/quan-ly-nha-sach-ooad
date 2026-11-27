export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'MOMO' | 'CARD';
export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';
export type CustomerTier = 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM';
export type PaymentStatus = 'PAID' | 'REFUNDED';

export interface CreateBookDTO {
  isbn: string;
  title: string;
  author: string;
  authorIds?: string[];
  publisher?: string;
  publisherId?: string;
  publishYear?: number;
  costPrice?: number;
  price: number;
  stockQuantity: number;
  minStockThreshold?: number;
  coverUrl?: string;
  categoryId?: string;
  promotionId?: string | null;
  status?: string;
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

// --- Auth & RBAC DTOs (Theo 5 Actor trong Sơ đồ Use Case) ---
export interface SessionUserDTO {
  tenDangNhap: string;
  maNV: string;
  hoTen: string;
  email: string;
  maVaiTro: string;
  tenVaiTro: string;
  danhSachQuyen: string[];
}

export interface LoginDTO {
  tenDangNhap: string;
  matKhau: string;
}

export interface ChangePasswordDTO {
  matKhauCu: string;
  matKhauMoi: string;
}

export interface ForgotPasswordDTO {
  tenDangNhap: string;
  emailKhoiPhuc: string;
}

export interface CreateAccountDTO {
  tenDangNhap: string;
  matKhau: string;
  emailKhoiPhuc: string;
  maVaiTro: string;
  maNV: string;
  hoTen: string;
  soDienThoai?: string;
  diaChi?: string;
}

export interface UpdatePermissionsDTO {
  danhSachQuyen: string[];
}

// --- 1. Danh mục sách (Catalog) ---
export interface CategoryDTO {
  id: string;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface AuthorDTO {
  id: string;
  name: string;
  penName?: string;
  nationality?: string;
  biography: string;
}

export interface PublisherDTO {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  contactPerson?: string;
}

// --- 2. Khách hàng (Customer) ---
export interface CustomerDTO {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  loyaltyPoints: number;
  tier: CustomerTier;
  totalSpent: number;
  orderCount: number;
  createdAt: string;
}

export interface CreateCustomerDTO {
  fullName: string;
  phoneNumber: string;
  email?: string;
  address?: string;
}

export interface UpdateCustomerDTO extends Partial<CreateCustomerDTO> {
  id: string;
  loyaltyPoints?: number;
}

// --- 3. Nhân viên (Staff) ---
export type EmploymentStatus = 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';

export interface StaffDTO {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  position: string;
  roleCode: 'QUAN_LY' | 'NHAN_VIEN_BAN_HANG' | 'NHAN_VIEN_KHO';
  roleName: string;
  status: EmploymentStatus;
  hireDate: string;
}

export interface CreateStaffDTO {
  fullName: string;
  phoneNumber: string;
  email: string;
  address?: string;
  position: string;
  roleCode: 'QUAN_LY' | 'NHAN_VIEN_BAN_HANG' | 'NHAN_VIEN_KHO';
}

export interface UpdateStaffDTO extends Partial<CreateStaffDTO> {
  id: string;
  status?: EmploymentStatus;
}

// --- 4. Nhà cung cấp (Supplier) ---
export interface SupplierDTO {
  id: string;
  code: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  bankAccount: string;
  isActive: boolean;
  totalImported: number;
  totalPaid: number;
  currentDebt: number;
}

export interface CreateSupplierDTO {
  code?: string;
  name: string;
  phoneNumber: string;
  email?: string;
  address: string;
  bankAccount?: string;
}

export interface UpdateSupplierDTO extends Partial<CreateSupplierDTO> {
  id: string;
  isActive?: boolean;
}

// --- 5. Nhập hàng & Công nợ NCC (GoodsReceipt & SupplierPayment) ---
export interface GoodsReceiptItemDTO {
  bookId: string;
  bookTitle: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
}

export interface GoodsReceiptDTO {
  id: string;
  receiptCode: string;
  supplierId: string;
  supplierName: string;
  staffName: string;
  createdAt: string;
  items: GoodsReceiptItemDTO[];
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  remainingDebt: number;
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID';
  note?: string;
}

export interface CreateGoodsReceiptDTO {
  supplierId: string;
  staffName: string;
  items: Array<{
    bookId: string;
    quantity: number;
    unitCost: number;
  }>;
  discountAmount?: number;
  paidAmount?: number;
  note?: string;
}

export interface SupplierPaymentDTO {
  id: string;
  paymentCode: string;
  supplierId: string;
  supplierName: string;
  receiptId?: string;
  receiptCode?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  staffName: string;
  paidAt: string;
  note?: string;
}

export interface CreateSupplierPaymentDTO {
  supplierId: string;
  receiptId?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  staffName: string;
  note?: string;
}

// --- 6. Kho & Kiểm kê (Inventory & StockAudit) ---
export type BookBusinessStatus = 'SELLING' | 'DISCONTINUED';

export interface InventoryItemDTO {
  bookId: string;
  isbn: string;
  title: string;
  categoryName: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  minStockThreshold: number;
  maxStockThreshold: number;
  soldQuantity: number;
  businessStatus: BookBusinessStatus;
  alertStatus: 'LOW' | 'OVERSTOCK' | 'NORMAL';
}

export interface StockAuditItemDTO {
  bookId: string;
  bookTitle: string;
  systemQuantity: number;
  actualQuantity: number;
  discrepancyQuantity: number;
  reason: string;
}

export interface StockAuditDTO {
  id: string;
  auditCode: string;
  adjustmentType: 'AUDIT' | 'DAMAGED_WRITE_OFF';
  staffName: string;
  auditDate: string;
  status: 'BALANCED' | 'ADJUSTED';
  totalDiscrepancy: number;
  lossValue: number;
  note?: string;
  items: StockAuditItemDTO[];
}

export interface CreateStockAuditDTO {
  staffName: string;
  note?: string;
  items: Array<{
    bookId: string;
    actualQuantity: number;
    reason?: string;
  }>;
}

export interface CreateDamagedWriteOffDTO {
  staffName: string;
  bookId: string;
  damagedQuantity: number;
  reason: string;
}

// --- 7. Khuyến mãi & Mã giảm giá (Promotion & DiscountCoupon) ---
export interface PromotionCampaignDTO {
  id: string;
  code: string;
  name: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  scope: 'ALL' | 'CATEGORY' | 'BOOK';
  startDate: string;
  endDate: string;
  status: 'UPCOMING' | 'ACTIVE' | 'ENDED' | 'STOPPED';
  description?: string;
}

export interface CreatePromotionDTO {
  code?: string;
  name: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  scope: 'ALL' | 'CATEGORY' | 'BOOK';
  startDate: string;
  endDate: string;
  description?: string;
}

export interface DiscountCouponDTO {
  id: string;
  code: string;
  discountAmount: number;
  minOrderAmount: number;
  maxUses: number;
  usedCount: number;
  expiryDate: string;
  isActive: boolean;
}

export interface CreateCouponDTO {
  code: string;
  discountAmount: number;
  minOrderAmount: number;
  maxUses: number;
  expiryDate: string;
}

export interface ValidateCouponResultDTO {
  valid: boolean;
  discountAmount: number;
  message: string;
  coupon?: DiscountCouponDTO;
}

// --- 8. Đổi / Trả hàng (ReturnExchange) ---
export interface ReturnItemDTO {
  bookId: string;
  bookTitle: string;
  quantity: number;
  unitPrice: number;
  refundSubtotal: number;
}

export interface ReturnExchangeDTO {
  id: string;
  returnCode: string;
  orderCode: string;
  type: 'RETURN' | 'EXCHANGE';
  staffName: string;
  reason: string;
  createdAt: string;
  items: ReturnItemDTO[];
  exchangeBookTitle?: string;
  exchangeBookPrice?: number;
  refundAmount: number;
  status: 'COMPLETED';
}

export interface CreateReturnDTO {
  orderCode: string;
  orderDate?: string;
  type: 'RETURN' | 'EXCHANGE';
  staffName: string;
  reason: string;
  items: Array<{
    bookId: string;
    bookTitle: string;
    quantity: number;
    maxPurchasedQuantity: number;
    unitPrice: number;
  }>;
  exchangeBookId?: string;
}

// --- 9. Thống kê – Báo cáo (Reports) ---
export interface RevenueByMethodDTO {
  method: PaymentMethod;
  label: string;
  orderCount: number;
  revenue: number;
}

export interface BestsellerDTO {
  bookId: string;
  title: string;
  categoryName: string;
  soldQuantity: number;
  revenue: number;
  stockQuantity: number;
}

export interface InventoryReportSummaryDTO {
  totalTitles: number;
  totalUnits: number;
  totalInventoryValue: number;
  lowStockCount: number;
  overstockCount: number;
  items: InventoryItemDTO[];
}

export interface SupplierDebtReportDTO {
  totalSuppliers: number;
  totalImported: number;
  totalPaid: number;
  totalRemainingDebt: number;
  suppliers: SupplierDTO[];
}

export interface FullReportDTO {
  generatedAt: string;
  totalRevenue: number;
  totalOrders: number;
  totalRefunds: number;
  netRevenue: number;
  revenueByMethod: RevenueByMethodDTO[];
  bestsellers: BestsellerDTO[];
  inventory: InventoryReportSummaryDTO;
  supplierDebt: SupplierDebtReportDTO;
}
