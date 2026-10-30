# HỆ THỐNG QUẢN LÝ NHÀ SÁCH (BOOKSTORE MANAGEMENT SYSTEM)
> **Đồ án môn học:** Phân tích & Thiết kế Hướng đối tượng (OOAD - Object-Oriented Analysis and Design)  
> **Kiến trúc:** Layered Architecture (Kiến trúc phân tầng) kết hợp OOP trong Frontend  
> **Công nghệ:** Next.js (App Router), TypeScript, TailwindCSS, Supabase (PostgreSQL)

---

## 👥 THÔNG TIN NHÓM THỰC HIỆN

| STT | Họ và Tên | Mã số sinh viên (MSSV) | Vai trò / Nhiệm vụ phụ trách |
|---|---|---|---|
| 1 | [Họ và tên thành viên 1] | [MSSV 1] | Nhóm trưởng, Thiết kế CSDL, Models & Repositories |
| 2 | [Họ và tên thành viên 2] | [MSSV 2] | Phát triển Nghiệp vụ POS, Order Service, Sơ đồ Sequence |
| 3 | [Họ và tên thành viên 3] | [MSSV 3] | Giao diện UI/UX Quản lý Sách, Danh mục, Sơ đồ Use Case |
| 4 | [Họ và tên thành viên 4] | [MSSV 4] | Tích hợp Supabase, Hóa đơn & Báo cáo, Kiểm thử |

---

## 🎯 MỤC TIÊU VÀ NGHIỆP VỤ HỆ THỐNG

Dự án mô phỏng hoạt động bán lẻ và quản lý kho tại nhà sách hiện đại, giải quyết các bài toán:
1. **Quản lý danh mục & sách:** Quản lý thông tin chi tiết (ISBN, tác giả, giá bán, số lượng tồn kho, danh mục). Cảnh báo sách sắp hết hàng.
2. **Quầy thu ngân (POS - Point of Sale):**
   - Tìm kiếm sách nhanh qua từ khóa hoặc mã barcode.
   - Thêm vào giỏ hàng, cập nhật số lượng, kiểm tra tồn kho theo thời gian thực.
   - Áp dụng giảm giá, chiết khấu theo thành viên khách hàng.
3. **Quản lý Khách hàng:** Quản lý thông tin thành viên, tích lũy điểm thưởng và nâng hạng thẻ.
4. **Xử lý Đơn hàng & Hóa đơn (Order & Invoice):**
   - Tính toán tổng tiền, thuế VAT, giảm giá tự động qua logic nghiệp vụ đóng gói.
   - Hỗ trợ đa dạng phương thức thanh toán (Tiền mặt, Chuyển khoản ngân hàng, Ví điện tử).
   - Xuất hóa đơn chi tiết và tự động trừ số lượng tồn kho.

---

## 🏛️ ÁP DỤNG NGUYÊN LÝ HƯỚNG ĐỐI TƯỢNG (OOP) TRONG DỰ ÁN

Hệ thống được thiết kế theo **Kiến trúc Phân tầng (Layered Architecture)**, kết hợp chặt chẽ các nguyên lý OOP và mẫu thiết kế:

### 1. 4 Tính chất cốt lõi của OOP
- **Tính đóng gói (Encapsulation):**
  - Các Entity (`Book`, `Order`, `OrderItem`, `Customer`, `Invoice`) đóng gói dữ liệu bên trong các thuộc tính `private`/`protected`, chỉ cho phép truy xuất và thay đổi qua các phương thức nghiệp vụ hợp lệ (ví dụ: `order.addItem()`, `book.reduceStock()`).
- **Tính kế thừa (Inheritance):**
  - Các lớp thực thể đều kế thừa từ lớp trừu tượng `BaseEntity` (chứa `id`, `createdAt`, `updatedAt`).
- **Tính đa hình (Polymorphism):**
  - Xử lý các phương thức thanh toán thông qua giao diện `PaymentStrategy` (`CashPaymentStrategy`, `MomoPaymentStrategy`, `BankTransferStrategy`).
- **Tính trừu tượng (Abstraction):**
  - Định nghĩa các interface `IBookRepository`, `IOrderRepository` để phân tách giao tiếp giữa tầng nghiệp vụ và tầng lưu trữ dữ liệu.

### 2. Nguyên lý SOLID
- **S (Single Responsibility):** Mỗi lớp chỉ đảm nhận một trách nhiệm duy nhất (Entity quản lý dữ liệu/logic nghiệp vụ; Repository chịu trách nhiệm truy vấn Supabase; Component chỉ lo việc render UI).
- **O (Open/Closed):** Dễ dàng mở rộng phương thức thanh toán hoặc chính sách giảm giá mới mà không cần chỉnh sửa mã nguồn cốt lõi của `Order`.
- **L (Liskov Substitution):** Mọi chiến lược thanh toán đều có thể thay thế nhau mà không làm phá vỡ logic thanh toán.
- **I (Interface Segregation):** Các interface Repository và DTO được chia nhỏ vừa vặn, không ép lớp phụ thuộc vào phương thức không dùng.
- **D (Dependency Inversion):** Tầng Service phụ thuộc vào Interface Repository trừu tượng thay vì phụ thuộc trực tiếp vào triển khai cụ thể của Supabase.

---

## 📂 CẤU TRÚC THƯ MỤC DỰ ÁN

```text
bookstore-management-system/
├── docs/                                  # Tài liệu phân tích thiết kế OOAD
│   ├── diagrams/                          # Sơ đồ UML (Use Case, Class, Sequence)
│   │   ├── use-case-diagram.drawio        # File Draw.io thiết kế Use Case
│   │   ├── class-diagram.drawio           # File Draw.io thiết kế Class Diagram
│   │   └── README.md                      # Giải thích chi tiết các sơ đồ UML
│   └── database/                          # Kịch bản cơ sở dữ liệu
│       └── schema.sql                     # Script DDL PostgreSQL chạy trên Supabase
├── frontend/                              # Ứng dụng Next.js (Client + Presentation)
│   ├── public/                            # Static assets (logo, icons, images)
│   ├── src/
│   │   ├── app/                           # Next.js App Router (Pages & Layouts)
│   │   │   ├── books/page.tsx             # Trang quản lý sách & tồn kho
│   │   │   ├── pos/page.tsx               # Trang quầy bán hàng POS
│   │   │   ├── orders/page.tsx            # Trang lịch sử đơn hàng
│   │   │   ├── layout.tsx                 # Root layout
│   │   │   └── page.tsx                   # Trang chủ Dashboard
│   │   ├── components/                    # UI Components phân theo module
│   │   │   ├── books/                     # BookCard, BookList, BookForm
│   │   │   ├── cart/                      # CartDrawer, CartItemRow
│   │   │   ├── invoice/                   # InvoiceModal, PrintInvoiceView
│   │   │   ├── pos/                       # POSCheckout, BarcodeScannerSimulator
│   │   │   └── ui/                        # Header, Sidebar, Button, Modal
│   │   ├── models/                        # Domain Entities (OOP Core)
│   │   │   ├── BaseEntity.ts              # Abstract base class cho mọi Entity
│   │   │   ├── Book.ts                    # Thực thể Sách (logic tồn kho, chiết khấu)
│   │   │   ├── Category.ts                # Thực thể Danh mục sách
│   │   │   ├── Customer.ts                # Thực thể Khách hàng (logic tích điểm)
│   │   │   ├── OrderItem.ts               # Thực thể Chi tiết đơn hàng
│   │   │   ├── Order.ts                   # Thực thể Đơn hàng (tính tiền, thuế, trạng thái)
│   │   │   ├── Invoice.ts                 # Thực thể Hóa đơn thanh toán
│   │   │   └── index.ts                   # Export tập trung
│   │   ├── repositories/                  # Data Access Layer (Truy vấn Supabase)
│   │   │   ├── IBookRepository.ts         # Interface chuẩn hóa repo sách
│   │   │   ├── BookRepository.ts          # Triển khai tương tác Supabase
│   │   │   ├── IOrderRepository.ts        # Interface chuẩn hóa repo đơn hàng
│   │   │   ├── OrderRepository.ts         # Triển khai tương tác Supabase
│   │   │   └── index.ts
│   │   ├── services/                      # Application Business Logic Layer
│   │   │   ├── BookService.ts             # Service điều phối nghiệp vụ sách
│   │   │   ├── OrderService.ts            # Service xử lý tạo đơn, thanh toán, trừ kho
│   │   │   └── index.ts
│   │   ├── lib/
│   │   │   └── supabase/                  # Khởi tạo Supabase Browser Client
│   │   │       └── client.ts
│   │   └── types/                         # Interfaces, DTOs, Database Types
│   │       ├── database.types.ts          # Schema Types khớp với Supabase Tables
│   │       └── dtos.ts                    # Data Transfer Objects
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── .env.example
├── .gitignore
├── .env.example
└── README.md
```

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN

### 1. Chuẩn bị môi trường
- Cài đặt **Node.js** (khuyến nghị phiên bản 18 LTS trở lên hoặc 20 LTS).
- Tài khoản [Supabase](https://supabase.com) (miễn phí).

### 2. Thiết lập Cơ sở dữ liệu Supabase
1. Đăng nhập vào Supabase và tạo mới một Project (ví dụ: `bookstore-db`).
2. Mở mục **SQL Editor** trong Supabase Dashboard.
3. Sao chép toàn bộ nội dung file [schema.sql](file:///C:/Users/Admin/.gemini/antigravity/scratch/bookstore-management-system/docs/database/schema.sql) và chạy (Run) để tạo cấu trúc bảng, khóa ngoại và dữ liệu mẫu (Seed Data).
4. Vào **Project Settings -> API**, sao chép:
   - `Project URL`
   - `Project API anon key`

### 3. Cấu hình biến môi trường
Tạo file `.env.local` bên trong thư mục `frontend/` (hoặc copy từ `.env.example`):
```bash
cp frontend/.env.example frontend/.env.local
```
Điền thông tin API lấy từ Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
```

### 4. Cài đặt thư viện & Khởi chạy ứng dụng
Di chuyển vào thư mục `frontend`:
```bash
cd frontend
npm install
npm run dev
```
Mở trình duyệt tại địa chỉ: `http://localhost:3000`

---

## 📊 KẾ HOẠCH BẢO VỆ ĐỒ ÁN OOAD

- [x] **Bước 1: Phân tích & Mô hình hóa (UML):**
  - Sơ đồ Use Case (Actor: Quản lý, Nhân viên bán hàng/Thu ngân).
  - Sơ đồ Lớp (Class Diagram với quan hệ Association, Aggregation, Composition, Generalization).
  - Sơ đồ Tuần tự (Sequence Diagram cho ca sử dụng "Bán hàng và Xuất hóa đơn tại quầy").
- [x] **Bước 2: Thiết kế Kiến trúc:**
  - Thiết kế Domain Entities với các nghiệp vụ độc lập.
  - Xây dựng tầng Repository và Service kết nối Supabase.
- [x] **Bước 3: Hiện thực hóa Giao diện (Next.js):**
  - Trang POS: Chọn sách, giỏ hàng trực quan, tính toán tự động.
  - Quản lý sách: Tìm kiếm, lọc theo thể loại, xem tồn kho.
  - Modal xem và in hóa đơn bán hàng.
