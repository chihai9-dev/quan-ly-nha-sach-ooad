# MODULE: DOMAIN MODELS (`frontend/src/models`)

Tầng Mô hình Thực thể Nghiệp vụ (Core Domain Layer) là hạt nhân chứa logic nghiệp vụ và dữ liệu thuần khiết của hệ thống theo nguyên lý Phân tích & Thiết kế Hướng đối tượng (OOAD).

---

## 1. TRÁCH NHIỆM CHÍNH (SINGLE RESPONSIBILITY)
- Đóng gói dữ liệu và các quy tắc ràng buộc nghiệp vụ (Business Invariants).
- Cung cấp các phương thức tính toán nội tại (ví dụ: tính tổng tiền đơn hàng, giảm trừ tồn kho, tính điểm thưởng).
- Đảm bảo thực thể luôn ở trạng thái hợp lệ ngay từ khi khởi tạo (Constructor Invariants).

---

## 2. CÁC THỰC THỂ CUNG CẤP RA NGOÀI (PUBLIC ENTITIES)

| File / Class | Kế thừa | Trách nhiệm chính | Phương thức nghiệp vụ cốt lõi |
|---|---|---|---|
| `BaseEntity.ts` | *(Abstract)* | Cung cấp ID (`UUID`), thời gian tạo (`createdAt`), cập nhật (`updatedAt`) | `getId()`, `getCreatedAt()`, `getUpdatedAt()`, `touch()` |
| `Book.ts` | `BaseEntity` | Quản lý thông tin sách, kiểm tra tồn kho, điều chỉnh giá | `reduceStock(qty)`, `increaseStock(qty)`, `hasEnoughStock(qty)` |
| `Category.ts` | `BaseEntity` | Quản lý thể loại / danh mục phân loại sách | `updateInfo(name, description)` |
| `Customer.ts` | `BaseEntity` | Quản lý thông tin khách, tích điểm và tự động nâng hạng thẻ | `addLoyaltyPoints(amount)`, `calculateDiscountPercentage()` |
| `Order.ts` | `BaseEntity` | Quản lý đơn hàng bán lẻ, tính toán tổng tiền, thuế, chiết khấu | `addItem(item)`, `removeItem(bookId)`, `calculateTotals()`, `complete()` |
| `OrderItem.ts` | `BaseEntity` | Chi tiết một đầu sách trong đơn hàng | `updateQuantity(qty)`, `getSubtotal()` |
| `Invoice.ts` | `BaseEntity` | Hóa đơn thanh toán, ghi nhận tiền khách đưa và tiền thừa | `markAsPaid()`, `getChangeAmount()` |

---

## 3. CÁC DEPENDENCIES PHỤ THUỘC (DEPENDENCY RESTRICTIONS)
- **Được phép phụ thuộc:**
  - `src/types/database.types.ts` (chỉ dùng để type check nếu cần)
  - Các Entity nội bộ khác trong thư mục `src/models/`
- **TUYỆT ĐỐI CẤM:**
  - Không import bất kỳ file nào từ `src/services/`
  - Không import bất kỳ file nào từ `src/repositories/`
  - Không import Supabase Client (`@supabase/supabase-js`)
  - Không import React hoặc Next.js components/hooks

---

## 4. QUY TẮC THIẾT KẾ OOP BẮT BUỘC
1. Mọi thuộc tính dữ liệu phải khai báo `private` hoặc `protected` với tiền tố gạch dưới `_`.
2. Truy xuất dữ liệu ra ngoài thông qua `getter`. Chỉ tạo `setter` khi thực sự cần thiết kèm validation hợp lệ.
3. Không để Entity trở thành Anemic Model (chỉ chứa data mà không có hành vi).
