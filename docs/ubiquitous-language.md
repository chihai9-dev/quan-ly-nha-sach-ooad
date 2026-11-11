# TỪ ĐIỂN NGHIỆP VỤ THỐNG NHẤT (UBIQUITOUS LANGUAGE)
# DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ SÁCH (BOOKSTORE MANAGEMENT SYSTEM)

Tài liệu này chuẩn hóa toàn bộ ngôn ngữ nghiệp vụ trong toàn bộ dự án nhằm đảm bảo:
- Lập trình viên và AI Coding Agents sử dụng **duy nhất một thuật ngữ chuẩn xác** cho cùng một khái niệm nghiệp vụ.
- Tránh tình trạng mỗi file đặt một kiểu (ví dụ: lúc gọi `Customer`, lúc gọi `Client`, lúc gọi `Buyer` hay `User`).
- Đồng bộ giữa: **Mô tả nghiệp vụ ⟷ UML Diagram ⟷ Tên Class/Interface ⟷ Database Table & Column ⟷ UI Label**.

---

## 1. NGUYÊN TẮC ĐẶT TÊN CHUẨN HÓA

| Phạm vi | Quy ước định dạng (Naming Case) | Ví dụ minh họa |
|---|---|---|
| **Class / Interface / Type / Enum** | `PascalCase` | `Book`, `OrderService`, `IBookRepository`, `PaymentMethod` |
| **Biến / Thuộc tính / Hàm / Method** | `camelCase` | `stockQuantity`, `calculateTotal()`, `findByIsbn()` |
| **Thuộc tính Private trong OOP Entity** | `_camelCase` | `private _price: number`, `private _stockQuantity: number` |
| **Hằng số (Constants)** | `UPPER_SNAKE_CASE` | `MAX_STOCK_THRESHOLD`, `DEFAULT_TAX_RATE` |
| **Database Table & Column (PostgreSQL)** | `snake_case` (số nhiều cho bảng) | `books`, `order_items`, `stock_quantity`, `created_at` |
| **File code TypeScript/TSX** | `PascalCase` cho Classes/Components, `kebab-case` cho utils/configs | `Book.ts`, `BookCard.tsx`, `date-utils.ts` |

---

## 2. BẢNG TỪ ĐIỂN THEO PHÂN HỆ NGHIỆP VỤ (DOMAIN MODULES)

### 2.1. Phân hệ Sách & Danh mục (Book & Catalog Management)

| Thuật ngữ chuẩn | Thuật ngữ Tiếng Việt | Từ KHÔNG dùng / Bị cấm | Tương ứng trong Code / DB | Mô tả nghiệp vụ |
|---|---|---|---|---|
| `Book` | Đầu sách / Sách | `Product`, `Item`, `Goods`, `Article` | Model: `Book`<br>Table: `books` | Thực thể sách bán tại nhà sách. |
| `Category` | Danh mục / Thể loại sách | `Genre`, `Type`, `Group` | Model: `Category`<br>Table: `categories` | Phân loại sách (Văn học, Khoa học, Kỹ năng...). |
| `Author` | Tác giả | `Writer`, `Creator` | Model: `Author`<br>Column: `author` | Tác giả sáng tác cuốn sách. |
| `Publisher` | Nhà xuất bản (NXB) | `Company`, `Press` | Model: `Publisher`<br>Column: `publisher` | Đơn vị phát hành sách. |
| `publishYear` | Năm xuất bản | `year`, `releasedYear` | Column: `publish_year` | Năm ấn hành của cuốn sách. |
| `isbn` | Mã số tiêu chuẩn quốc tế | `bookCode`, `barcode` | Column: `isbn` | Mã định danh duy nhất của sách (ISBN-10 hoặc ISBN-13). |
| `price` | Giá bán lẻ niêm yết | `cost`, `amount`, `sellPrice` | Column: `price` | Đơn giá bán cho khách hàng (VNĐ). |
| `stockQuantity` | Số lượng tồn kho thực tế | `stock`, `inventoryCount`, `amount` | Column: `stock_quantity` | Số cuốn sách hiện còn trong kho để bán. |
| `coverUrl` | Đường dẫn ảnh bìa | `image`, `thumbnail`, `photo` | Column: `cover_url` | URL ảnh bìa cuốn sách. |

---

### 2.2. Phân hệ Bán hàng & Thu ngân (POS & Sales Management)

| Thuật ngữ chuẩn | Thuật ngữ Tiếng Việt | Từ KHÔNG dùng / Bị cấm | Tương ứng trong Code / DB | Mô tả nghiệp vụ |
|---|---|---|---|---|
| `POS` | Quầy bán hàng / Điểm bán lẻ | `CheckoutArea`, `Shop` | Module: `pos`<br>Route: `/pos` | Quầy thu ngân phục vụ bán lẻ và quét barcode. |
| `Order` | Đơn hàng bán lẻ | `Sale`, `Purchase`, `Transaction` | Model: `Order`<br>Table: `orders` | Đơn bán sách được khởi tạo tại quầy POS. |
| `orderCode` | Mã đơn hàng | `id`, `orderNumber` | Column: `order_code` | Mã hiển thị thân thiện (ví dụ: `ORD-1730000000-A1B2`). |
| `OrderItem` | Chi tiết mục sách trong đơn | `OrderLine`, `CartDetail` | Model: `OrderItem`<br>Table: `order_items` | Một dòng trong đơn hàng (gồm Sách, số lượng, đơn giá). |
| `Invoice` | Hóa đơn thanh toán | `Bill`, `Receipt`, `Check` | Model: `Invoice`<br>Table: `invoices` | Chứng từ xác nhận thanh toán in ra giao cho khách. |
| `invoiceCode` | Mã hóa đơn | `billCode`, `receiptNo` | Column: `invoice_code` | Mã hóa đơn (ví dụ: `INV-1730000000-C3D4`). |
| `subtotal` | Tổng tiền hàng tạm tính | `rawTotal`, `itemSum` | Column: `subtotal` | Tổng giá trị sách trước thuế và trước giảm giá. |
| `discountAmount` | Số tiền được chiết khấu/giảm | `discount`, `couponCut` | Column: `discount_amount` | Tổng tiền được trừ từ mã voucher hoặc khuyến mãi. |
| `taxAmount` | Tiền thuế VAT | `vat`, `taxVal` | Column: `tax_amount` | Thuế giá trị gia tăng được tính trên đơn hàng. |
| `totalAmount` | Tổng tiền thanh toán cuối cùng | `grandTotal`, `finalPrice` | Column: `total_amount` | Số tiền thực tế khách cần trả (`subtotal - discount + tax`). |
| `cashierName` | Tên nhân viên thu ngân | `staffName`, `seller` | Column: `cashier_name` | Thu ngân phụ trách xuất đơn/hóa đơn. |
| `CartItem` | Mục sách trong giỏ hàng tạm | `SelectedBook`, `TempItem` | Interface: `CartItem` | Đối tượng lưu trên client state trước khi bấm Đặt hàng. |
| `OrderStatus` | Trạng thái đơn hàng | `State` | Enum/Type: `OrderStatus` | `PENDING`, `COMPLETED`, `CANCELLED`. |

---

### 2.3. Phân hệ Khách hàng & Tích điểm (Customer & Membership)

| Thuật ngữ chuẩn | Thuật ngữ Tiếng Việt | Từ KHÔNG dùng / Bị cấm | Tương ứng trong Code / DB | Mô tả nghiệp vụ |
|---|---|---|---|---|
| `Customer` | Khách hàng | `Client`, `Buyer`, `User` | Model: `Customer`<br>Table: `customers` | Người mua sách (vãng lai hoặc thành viên). |
| `loyaltyPoints` | Điểm tích lũy thành viên | `score`, `points`, `bonus` | Column: `loyalty_points` | Điểm thưởng tích từ các hóa đơn đã mua thành công. |
| `tier` / `MembershipTier` | Hạng thẻ thành viên | `rank`, `level`, `grade` | Column: `tier`<br>Type: `MembershipTier` | Hạng khách: `STANDARD` (Chuẩn), `SILVER` (Bạc), `GOLD` (Vàng), `PLATINUM` (Bạch kim). |
| `phoneNumber` | Số điện thoại khách hàng | `phone`, `mobile`, `tel` | Column: `phone_number` | Mã định danh tra cứu khách tại quầy POS. |

---

### 2.4. Phân hệ Thanh toán (Payment)

| Thuật ngữ chuẩn | Thuật ngữ Tiếng Việt | Từ KHÔNG dùng / Bị cấm | Tương ứng trong Code / DB | Mô tả nghiệp vụ |
|---|---|---|---|---|
| `PaymentMethod` | Hình thức thanh toán | `PayType`, `PaymentWay` | Type: `PaymentMethod` | `CASH` (Tiền mặt), `BANK_TRANSFER` (Chuyển khoản), `MOMO` (Ví điện tử), `CARD` (Quẹt thẻ). |
| `PaymentStatus` | Trạng thái thanh toán | `PayState` | Type: `PaymentStatus` | `PAID` (Đã thanh toán), `REFUNDED` (Đã hoàn tiền). |
| `paidAmount` | Số tiền khách đưa | `givenAmount`, `customerPay` | Column: `paid_amount` | Tiền mặt hoặc tiền chuyển khoản thực tế thu từ khách. |
| `changeAmount` | Tiền thừa trả lại khách | `refundAmount`, `balance` | Column: `change_amount` | Tiền trả lại khách (`paidAmount - totalAmount`). |
| `PaymentStrategy` | Mẫu chiến lược thanh toán | `PaymentHandler` | Interface: `PaymentStrategy` | Áp dụng OOP Polymorphism cho các cổng thanh toán. |

---

### 2.5. Phân hệ Nhập hàng & Nhà cung cấp (Goods Receipt & Supplier)

| Thuật ngữ chuẩn | Thuật ngữ Tiếng Việt | Từ KHÔNG dùng / Bị cấm | Tương ứng trong Code / DB | Mô tả nghiệp vụ |
|---|---|---|---|---|
| `Supplier` | Nhà cung cấp | `Vendor`, `Provider`, `Partner` | Model: `Supplier`<br>Table: `suppliers` | Đơn vị xuất bản hoặc đối tác phân phối sách. |
| `GoodsReceipt` / `GoodsReceiptNote` | Phiếu nhập kho | `Order`, `ImportBill`, `Purchase` | Model: `GoodsReceipt`<br>Table: `goods_receipts` | Phiếu ghi nhận đợt nhập sách từ nhà cung cấp (KHÔNG dùng từ `Order` để tránh nhầm với đơn bán lẻ). |
| `GoodsReceiptItem` | Chi tiết sách nhập | `ImportDetail` | Model: `GoodsReceiptItem`<br>Table: `goods_receipt_items` | Từng đầu sách, số lượng nhập, giá nhập. |
| `importPrice` | Đơn giá nhập hàng | `costPrice`, `buyPrice` | Column: `import_price` | Giá mua từ nhà cung cấp. |
| `SupplierDebt` | Công nợ nhà cung cấp | `AccountsPayable`, `Loan` | Model: `SupplierDebt` | Theo dõi tổng tiền đã mua, đã thanh toán và còn nợ NCC. |
| `SupplierPayment` | Phiếu chi trả tiền NCC | `PaySlip`, `ExpenseNote` | Model: `SupplierPayment` | Ghi nhận lần trả tiền cho nhà cung cấp. |

---

### 2.6. Phân hệ Khuyến mãi (Promotion & Discounts)

| Thuật ngữ chuẩn | Thuật ngữ Tiếng Việt | Từ KHÔNG dùng / Bị cấm | Tương ứng trong Code / DB | Mô tả nghiệp vụ |
|---|---|---|---|---|
| `PromotionCampaign` | Chương trình khuyến mãi | `DiscountEvent`, `SaleCampaign` | Model: `PromotionCampaign` | Chiến dịch giảm giá có thời hạn (giảm theo % hoặc số tiền). |
| `DiscountCoupon` / `Voucher` | Mã giảm giá | `PromoCode`, `GiftCode` | Model: `DiscountCoupon` | Mã ký tự nhập tại POS để nhận ưu đãi (ví dụ: `CHAOHEXIN20`). |
| `minOrderAmount` | Giá trị đơn hàng tối thiểu | `minTotal`, `threshold` | Column: `min_order_amount` | Điều kiện giá trị tối thiểu của đơn để áp dụng mã. |

---

### 2.7. Phân hệ Quản lý Kho & Kiểm kê (Inventory & Warehouse)

| Thuật ngữ chuẩn | Thuật ngữ Tiếng Việt | Từ KHÔNG dùng / Bị cấm | Tương ứng trong Code / DB | Mô tả nghiệp vụ |
|---|---|---|---|---|
| `minStockThreshold` | Ngưỡng tồn kho tối thiểu | `minStock`, `lowLimit` | Column: `min_stock_threshold` | Khi số lượng tồn <= ngưỡng này, kích hoạt cảnh báo hết hàng. |
| `maxStockThreshold` | Ngưỡng tồn kho tối đa | `maxStock`, `highLimit` | Column: `max_stock_threshold` | Khi số lượng tồn >= ngưỡng này, cảnh báo tồn kho quá mức. |
| `StockAudit` / `InventoryAdjustment` | Phiếu kiểm kê kho | `StockCheck`, `InventoryAudit` | Model: `InventoryAdjustment` | Phiếu kiểm đếm chênh lệch giữa số liệu phần mềm và thực tế. |
| `discrepancyQuantity` | Số lượng chênh lệch | `difference`, `gap` | Column: `discrepancy_quantity` | Số lượng thừa hoặc thiếu sau khi kiểm kê. |

---

### 2.8. Phân hệ Nhân viên & Quản trị Hệ thống (Staff & System Admin)

| Thuật ngữ chuẩn | Thuật ngữ Tiếng Việt | Từ KHÔNG dùng / Bị cấm | Tương ứng trong Code / DB | Mô tả nghiệp vụ |
|---|---|---|---|---|
| `Staff` / `Employee` | Nhân viên nhà sách | `User` (chung chung), `Account` | Model: `Staff`<br>Table: `staff` | Nhân viên làm việc tại nhà sách. |
| `Role` | Vai trò hệ thống | `UserGroup`, `PermissionGroup` | Type: `Role` | `ADMIN` (Quản trị viên), `WAREHOUSE_MANAGER` (Quản lý kho), `CASHIER` (Thu ngân), `SALES_STAFF` (Nhân viên bán hàng). |
| `EmploymentStatus` | Trạng thái làm việc | `WorkState` | Type: `EmploymentStatus` | `ACTIVE` (Đang làm việc), `ON_LEAVE` (Nghỉ phép), `TERMINATED` (Đã thôi việc). |

---

## 3. CHECKLIST KIỂM SOÁT TỪ NGỮ CHO AI AGENTS

Trước khi viết hàm, tạo class hoặc sinh DTO, hãy tự vấn:
1. Có đang dùng `Product` thay vì `Book` không? -> **Phải đổi thành `Book`**.
2. Có đang dùng `User` cho khách mua hàng không? -> **Phải đổi thành `Customer`**.
3. Có đang dùng `Order` cho việc nhập kho không? -> **Phải đổi thành `GoodsReceipt`**.
4. Có đang dùng `Receipt` cho hóa đơn xuất cho khách không? -> **Phải đổi thành `Invoice`**.
5. Các giá trị trạng thái hoặc phân loại có đúng Type/Enum quy định không?
