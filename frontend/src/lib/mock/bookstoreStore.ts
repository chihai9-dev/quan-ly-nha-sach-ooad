import type {
  AuthorDTO,
  CategoryDTO,
  CustomerDTO,
  CustomerTier,
  DiscountCouponDTO,
  GoodsReceiptDTO,
  InventoryItemDTO,
  PromotionCampaignDTO,
  PublisherDTO,
  ReturnExchangeDTO,
  StaffDTO,
  StockAuditDTO,
  SupplierDTO,
  SupplierPaymentDTO,
} from '@/types/dtos';

export interface MockBookRecord {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  categoryName: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  minStockThreshold: number;
  maxStockThreshold: number;
  soldQuantity: number;
}

export function calculateTier(points: number): CustomerTier {
  if (points >= 1000) return 'PLATINUM';
  if (points >= 500) return 'GOLD';
  if (points >= 100) return 'SILVER';
  return 'STANDARD';
}

export function computeAlertStatus(
  stock: number,
  min: number,
  max: number
): InventoryItemDTO['alertStatus'] {
  if (stock <= min) return 'LOW';
  if (stock >= max) return 'OVERSTOCK';
  return 'NORMAL';
}

class BookstoreMockStore {
  public categories: CategoryDTO[] = [
    { id: 'cat-1', code: 'CNTT', name: 'Công nghệ thông tin', description: 'Sách lập trình, kiến trúc phần mềm, AI', isActive: true },
    { id: 'cat-2', code: 'KTE', name: 'Kinh tế - Quản trị', description: 'Kinh doanh, khởi nghiệp, tài chính', isActive: true },
    { id: 'cat-3', code: 'VHC', name: 'Văn học', description: 'Tiểu thuyết, truyện ngắn trong và ngoài nước', isActive: true },
    { id: 'cat-4', code: 'KNS', name: 'Kỹ năng sống', description: 'Phát triển bản thân, tư duy, thói quen', isActive: true },
  ];

  public authors: AuthorDTO[] = [
    { id: 'aut-1', name: 'Robert C. Martin', penName: 'Uncle Bob', nationality: 'Mỹ', biography: 'Chuyên gia kỹ nghệ phần mềm, tác giả Clean Code & Clean Architecture.' },
    { id: 'aut-2', name: 'Nguyễn Nhật Ánh', penName: 'Nguyễn Nhật Ánh', nationality: 'Việt Nam', biography: 'Nhà văn nổi tiếng với các tác phẩm văn học tuổi mới lớn.' },
    { id: 'aut-3', name: 'James Clear', penName: 'James Clear', nationality: 'Mỹ', biography: 'Tác giả cuốn sách bán chạy Atomic Habits (Thói quen nguyên tử).' },
    { id: 'aut-4', name: 'Eric Evans', penName: 'Eric Evans', nationality: 'Mỹ', biography: 'Cha đẻ của phương pháp luận Domain-Driven Design.' },
  ];

  public publishers: PublisherDTO[] = [
    { id: 'pub-1', name: 'NXB Trẻ', address: '161B Lý Chính Thắng, Q.3, TP.HCM', phoneNumber: '02839316289', contactPerson: 'Nguyễn Minh Tuấn' },
    { id: 'pub-2', name: 'NXB Kim Đồng', address: '55 Quang Trung, Hai Bà Trưng, Hà Nội', phoneNumber: '02439434730', contactPerson: 'Trần Thu Hà' },
    { id: 'pub-3', name: 'NXB Thế Giới', address: '46 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội', phoneNumber: '02438253841', contactPerson: 'Lê Hoàng Nam' },
    { id: 'pub-4', name: 'NXB Dân Trí', address: 'Số 9, Ngõ 26, Hoàng Cầu, Hà Nội', phoneNumber: '02466860751', contactPerson: 'Phạm Bảo Ngọc' },
  ];

  public books: MockBookRecord[] = [
    { id: 'b1', isbn: '978-0132350884', title: 'Clean Code', author: 'Robert C. Martin', publisher: 'NXB Dân Trí', categoryName: 'Công nghệ thông tin', price: 320000, costPrice: 220000, stockQuantity: 25, minStockThreshold: 10, maxStockThreshold: 100, soldQuantity: 42 },
    { id: 'b2', isbn: '978-0134494166', title: 'Clean Architecture', author: 'Robert C. Martin', publisher: 'NXB Dân Trí', categoryName: 'Công nghệ thông tin', price: 350000, costPrice: 240000, stockQuantity: 6, minStockThreshold: 10, maxStockThreshold: 80, soldQuantity: 28 },
    { id: 'b3', isbn: '978-0321125217', title: 'Domain-Driven Design', author: 'Eric Evans', publisher: 'NXB Thế Giới', categoryName: 'Công nghệ thông tin', price: 450000, costPrice: 310000, stockQuantity: 4, minStockThreshold: 8, maxStockThreshold: 60, soldQuantity: 19 },
    { id: 'b4', isbn: '978-6041145678', title: 'Mắt Biếc', author: 'Nguyễn Nhật Ánh', publisher: 'NXB Trẻ', categoryName: 'Văn học', price: 110000, costPrice: 70000, stockQuantity: 85, minStockThreshold: 15, maxStockThreshold: 80, soldQuantity: 65 },
    { id: 'b5', isbn: '978-0735211292', title: 'Thói Quen Nguyên Tử (Atomic Habits)', author: 'James Clear', publisher: 'NXB Thế Giới', categoryName: 'Kỹ năng sống', price: 185000, costPrice: 120000, stockQuantity: 32, minStockThreshold: 10, maxStockThreshold: 90, soldQuantity: 54 },
    { id: 'b6', isbn: '978-6041098765', title: 'Cho Tôi Xin Một Vé Đi Tuổi Thơ', author: 'Nguyễn Nhật Ánh', publisher: 'NXB Trẻ', categoryName: 'Văn học', price: 95000, costPrice: 60000, stockQuantity: 18, minStockThreshold: 10, maxStockThreshold: 70, soldQuantity: 37 },
  ];

  public customers: CustomerDTO[] = [
    { id: 'kh-1', fullName: 'Nguyễn Văn An', phoneNumber: '0901234567', email: 'an.nguyen@gmail.com', address: 'Q.1, TP.HCM', loyaltyPoints: 250, tier: 'SILVER', totalSpent: 2500000, orderCount: 7, createdAt: '2026-01-12' },
    { id: 'kh-2', fullName: 'Trần Thị Mai', phoneNumber: '0987654321', email: 'mai.tran@gmail.com', address: 'Q.3, TP.HCM', loyaltyPoints: 750, tier: 'GOLD', totalSpent: 7500000, orderCount: 18, createdAt: '2025-11-05' },
    { id: 'kh-3', fullName: 'Lê Hoàng Phúc', phoneNumber: '0912345678', email: 'phuc.le@gmail.com', address: 'Q.Bình Thạnh, TP.HCM', loyaltyPoints: 1250, tier: 'PLATINUM', totalSpent: 12500000, orderCount: 31, createdAt: '2025-08-20' },
    { id: 'kh-4', fullName: 'Phạm Quỳnh Anh', phoneNumber: '0933445566', email: 'quynhanh@gmail.com', address: 'TP. Thủ Đức, TP.HCM', loyaltyPoints: 40, tier: 'STANDARD', totalSpent: 400000, orderCount: 2, createdAt: '2026-03-01' },
  ];

  public staff: StaffDTO[] = [
    { id: 'NV002', fullName: 'Lê Thị Quản Lý', phoneNumber: '0901000002', email: 'quanly@bookstore.vn', address: 'Q.3, TP.HCM', position: 'Cửa hàng trưởng', roleCode: 'QUAN_LY', roleName: 'Quản lý', status: 'ACTIVE', hireDate: '2024-02-15' },
    { id: 'NV003', fullName: 'Nguyễn Văn Bán Hàng', phoneNumber: '0901000003', email: 'banhang@bookstore.vn', address: 'Q.5, TP.HCM', position: 'Thu ngân ca sáng', roleCode: 'NHAN_VIEN_BAN_HANG', roleName: 'Nhân viên bán hàng', status: 'ACTIVE', hireDate: '2024-05-20' },
    { id: 'NV004', fullName: 'Phạm Minh Thủ Kho', phoneNumber: '0901000004', email: 'thukho@bookstore.vn', address: 'Q.10, TP.HCM', position: 'Nhân viên quản kho', roleCode: 'NHAN_VIEN_KHO', roleName: 'Nhân viên kho', status: 'ACTIVE', hireDate: '2024-06-01' },
    { id: 'NV005', fullName: 'Võ Thảo Vy', phoneNumber: '0901000005', email: 'vy.vo@bookstore.vn', address: 'Q.7, TP.HCM', position: 'Nhân viên bán hàng', roleCode: 'NHAN_VIEN_BAN_HANG', roleName: 'Nhân viên bán hàng', status: 'ON_LEAVE', hireDate: '2025-01-10' },
  ];

  public suppliers: SupplierDTO[] = [
    { id: 'ncc-1', code: 'NCC-FAHASA', name: 'Công ty Phát hành Sách TP.HCM (FAHASA)', phoneNumber: '02838225798', email: 'nhaphang@fahasa.com.vn', address: '60-62 Lê Lợi, Q.1, TP.HCM', bankAccount: 'VCB - 0071001234567', isActive: true, totalImported: 18500000, totalPaid: 12000000, currentDebt: 6500000 },
    { id: 'ncc-2', code: 'NCC-NHANAM', name: 'Công ty Văn hóa & Truyền thông Nhã Nam', phoneNumber: '02435146876', email: 'kinhdoanh@nhanam.vn', address: '59 Đỗ Quang, Cầu Giấy, Hà Nội', bankAccount: 'ACB - 192837465', isActive: true, totalImported: 9200000, totalPaid: 9200000, currentDebt: 0 },
    { id: 'ncc-3', code: 'NCC-FIRSTNEWS', name: 'First News - Trí Việt', phoneNumber: '02838227979', email: 'order@firstnews.com.vn', address: '11H Nguyễn Thị Minh Khai, Q.1, TP.HCM', bankAccount: 'TCB - 19033445566', isActive: true, totalImported: 12400000, totalPaid: 8000000, currentDebt: 4400000 },
  ];

  public goodsReceipts: GoodsReceiptDTO[] = [
    {
      id: 'pn-1',
      receiptCode: 'PN-20261101-01',
      supplierId: 'ncc-1',
      supplierName: 'Công ty Phát hành Sách TP.HCM (FAHASA)',
      staffName: 'Phạm Minh Thủ Kho',
      createdAt: '2026-11-01T09:30:00Z',
      items: [
        { bookId: 'b1', bookTitle: 'Clean Code', quantity: 30, unitCost: 220000, subtotal: 6600000 },
        { bookId: 'b2', bookTitle: 'Clean Architecture', quantity: 20, unitCost: 240000, subtotal: 4800000 },
      ],
      discountAmount: 400000,
      totalAmount: 11000000,
      paidAmount: 6000000,
      remainingDebt: 5000000,
      paymentStatus: 'PARTIAL',
      note: 'Nhập bổ sung sách CNTT tháng 11',
    },
    {
      id: 'pn-2',
      receiptCode: 'PN-20261115-02',
      supplierId: 'ncc-3',
      supplierName: 'First News - Trí Việt',
      staffName: 'Phạm Minh Thủ Kho',
      createdAt: '2026-11-15T14:15:00Z',
      items: [
        { bookId: 'b5', bookTitle: 'Thói Quen Nguyên Tử (Atomic Habits)', quantity: 40, unitCost: 120000, subtotal: 4800000 },
      ],
      discountAmount: 400000,
      totalAmount: 4400000,
      paidAmount: 0,
      remainingDebt: 4400000,
      paymentStatus: 'UNPAID',
      note: 'Công nợ 30 ngày',
    },
  ];

  public supplierPayments: SupplierPaymentDTO[] = [
    {
      id: 'pt-1',
      paymentCode: 'PC-20261102-01',
      supplierId: 'ncc-1',
      supplierName: 'Công ty Phát hành Sách TP.HCM (FAHASA)',
      receiptId: 'pn-1',
      receiptCode: 'PN-20261101-01',
      amount: 6000000,
      paymentMethod: 'BANK_TRANSFER',
      staffName: 'Lê Thị Quản Lý',
      paidAt: '2026-11-02T10:00:00Z',
      note: 'Thanh toán đợt 1 phiếu nhập PN-20261101-01',
    },
  ];

  public stockAudits: StockAuditDTO[] = [
    {
      id: 'kk-1',
      auditCode: 'KK-20261110-01',
      staffName: 'Phạm Minh Thủ Kho',
      auditDate: '2026-11-10T17:00:00Z',
      status: 'ADJUSTED',
      totalDiscrepancy: -1,
      note: 'Kiểm kê định kỳ giữa tháng 11',
      items: [
        { bookId: 'b1', bookTitle: 'Clean Code', systemQuantity: 26, actualQuantity: 25, discrepancyQuantity: -1, reason: '1 cuốn rách bìa xuất hủy' },
        { bookId: 'b4', bookTitle: 'Mắt Biếc', systemQuantity: 85, actualQuantity: 85, discrepancyQuantity: 0, reason: 'Khớp tồn kho' },
      ],
    },
  ];

  public promotions: PromotionCampaignDTO[] = [
    {
      id: 'km-1',
      code: 'KM-THANG11',
      name: 'Tuần lễ Sách Công nghệ 2026',
      discountType: 'PERCENT',
      discountValue: 15,
      scope: 'CATEGORY',
      startDate: '2026-11-01',
      endDate: '2026-11-30',
      status: 'ACTIVE',
      description: 'Giảm 15% toàn bộ đầu sách Công nghệ thông tin.',
    },
    {
      id: 'km-2',
      code: 'KM-BLACKFRIDAY',
      name: 'Siêu Sale Cuối Năm',
      discountType: 'FIXED',
      discountValue: 50000,
      scope: 'ALL',
      startDate: '2026-11-27',
      endDate: '2026-12-05',
      status: 'UPCOMING',
      description: 'Giảm ngay 50.000đ cho đơn hàng từ 300.000đ.',
    },
  ];

  public coupons: DiscountCouponDTO[] = [
    { id: 'cp-1', code: 'BOOK10', discountAmount: 20000, minOrderAmount: 150000, maxUses: 100, usedCount: 14, expiryDate: '2026-12-31', isActive: true },
    { id: 'cp-2', code: 'VIP50K', discountAmount: 50000, minOrderAmount: 350000, maxUses: 50, usedCount: 8, expiryDate: '2026-12-31', isActive: true },
    { id: 'cp-3', code: 'OLD2025', discountAmount: 30000, minOrderAmount: 100000, maxUses: 20, usedCount: 20, expiryDate: '2025-12-31', isActive: false },
  ];

  public returns: ReturnExchangeDTO[] = [
    {
      id: 'dt-1',
      returnCode: 'DT-20261120-01',
      orderCode: 'ORD-20261119-001',
      type: 'RETURN',
      staffName: 'Nguyễn Văn Bán Hàng',
      reason: 'Khách mua nhầm tập, sách còn nguyên seal',
      createdAt: '2026-11-20T11:20:00Z',
      items: [
        { bookId: 'b4', bookTitle: 'Mắt Biếc', quantity: 1, unitPrice: 110000, refundSubtotal: 110000 },
      ],
      refundAmount: 110000,
      status: 'COMPLETED',
    },
  ];
}

const globalForStore = globalThis as unknown as { __bookstoreMockStore?: BookstoreMockStore };
export const bookstoreStore: BookstoreMockStore =
  globalForStore.__bookstoreMockStore ??
  (globalForStore.__bookstoreMockStore = new BookstoreMockStore());
