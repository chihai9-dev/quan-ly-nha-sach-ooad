# MODULE: APPLICATION SERVICES (`frontend/src/services`)

Tầng Dịch vụ Nghiệp vụ (Application Service Layer) chịu trách nhiệm điều phối luồng nghiệp vụ giữa Presentation Layer (UI) và Data Access Layer (Repository).

---

## 1. TRÁCH NHIỆM CHÍNH (SINGLE RESPONSIBILITY)
- Điều phối các ca sử dụng (Use Cases) của hệ thống: Tạo đơn hàng, thanh toán quầy POS, trừ kho tự động, tích điểm thành viên, tra cứu sách.
- Quản lý giao dịch và kiểm tra tính toàn vẹn nghiệp vụ trước khi ghi dữ liệu.
- Đóng vai trò là cổng giao tiếp duy nhất giữa Giao diện người dùng và Tầng Dữ liệu.

---

## 2. CÁC DỊCH VỤ CUNG CẤP RA NGOÀI (PUBLIC SERVICES)

| Service | Dependencies tiêm vào | Các nghiệp vụ phụ trách |
|---|---|---|
| `BookService.ts` | `IBookRepository` | - Lấy danh mục sách kèm bộ lọc & tìm kiếm<br>- Tra cứu ISBN khi nhân viên quét barcode<br>- Thêm mới, cập nhật thông tin sách<br>- Kiểm tra cảnh báo hết hàng |
| `OrderService.ts` | `IOrderRepository`, `IBookRepository` | - Khởi tạo đơn hàng từ giỏ hàng POS<br>- Kiểm tra tồn kho thời gian thực<br>- Xử lý thanh toán đa kênh (Tiền mặt, MoMo, Chuyển khoản)<br>- Tự động trừ tồn kho sách sau khi thanh toán<br>- Xuất hóa đơn bán lẻ |

---

## 3. CÁC DEPENDENCIES PHỤ THUỘC
- **Được phép phụ thuộc:**
  - `src/repositories/I*Repository.ts` (Interface trừu tượng)
  - `src/repositories/*Repository.ts` (chỉ dùng làm default parameter trong constructor)
  - `src/models/*` (thực thể Domain)
  - `src/types/dtos.ts` (các DTO đầu vào/đầu ra)
- **TUYỆT ĐỐI CẤM:**
  - Không import Supabase Client trực tiếp (phải thông qua Repository)
  - Không import các components từ `src/components/` hoặc routes từ `src/app/`
  - Không gọi vòng lặp giữa các Services (`Service A` gọi `Service B` và ngược lại)

---

## 4. QUY TẮC HIỆN THỰC HÓA (IMPLEMENTATION RULES)
1. **Dependency Injection:** Luôn nhận Repository qua constructor để phục vụ việc Mock khi viết Unit Test:
   ```typescript
   constructor(
     private readonly orderRepo: IOrderRepository = new OrderRepository(),
     private readonly bookRepo: IBookRepository = new BookRepository()
   ) {}
   ```
2. **Atomic / Consistency:** Khi hoàn tất đơn hàng, phải đảm bảo tính nhất quán (tạo đơn hàng -> tạo chi tiết đơn -> tạo hóa đơn -> trừ số lượng tồn kho).
