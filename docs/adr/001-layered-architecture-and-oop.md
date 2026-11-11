# [ADR-001] Áp dụng Layered Architecture kết hợp Hướng đối tượng (OOP) trong Next.js Frontend

- **Trạng thái:** Được chấp nhận (Accepted)
- **Ngày quyết định:** 2026-10-30
- **Tác giả:** Đội ngũ phát triển Hệ thống Nhà Sách
- **Môn học:** Phân tích & Thiết kế Hướng đối tượng (OOAD)

---

## 1. Bối cảnh (Context)
Dự án là đồ án môn học Phân tích & Thiết kế Hướng đối tượng (OOAD). Thông thường trong các ứng dụng web Next.js hiện đại, lập trình viên thường thiên về lập trình hàm (Functional Programming) và gọi API/Database trực tiếp trong Server Actions hoặc React Hooks. Tuy nhiên:
- Dự án bắt buộc phải thể hiện rõ các nguyên lý OOP cốt lõi (4 tính chất: Đóng gói, Kế thừa, Đa hình, Trừu tượng) và các nguyên lý SOLID.
- Cần có sự phân tách rõ ràng giữa giao diện hiển thị, logic điều phối nghiệp vụ, và tầng truy vấn dữ liệu Supabase để phục vụ chấm điểm và bảo vệ đồ án.

---

## 2. Quyết định (Decision)
Chúng tôi quyết định áp dụng mô hình **Layered Architecture (Kiến trúc phân tầng)** kết hợp OOP:
1. **Tầng Domain (`src/models/`):**
   - Xây dựng lớp trừu tượng `BaseEntity` làm nền móng kế thừa cho mọi thực thể (`Book`, `Order`, `Customer`, `Invoice`).
   - Đóng gói dữ liệu bằng thuộc tính `private` / `protected` và cung cấp getters cùng các phương thức kiểm tra nghiệp vụ (Invariants).
   - Tầng Domain hoàn toàn thuần khiết (Pure TypeScript), không phụ thuộc vào framework bên ngoài.
2. **Tầng Data Access (`src/repositories/`):**
   - Áp dụng nguyên lý Dependency Inversion (DIP) bằng cách định nghĩa các Interface trừu tượng (`IBookRepository`, `IOrderRepository`).
   - Lớp triển khai cụ thể (`BookRepository`, `OrderRepository`) chịu trách nhiệm giao tiếp với Supabase Client.
3. **Tầng Application Services (`src/services/`):**
   - Đóng vai trò điều phối nghiệp vụ giữa Presentation và Data Access.
   - Nhận Interface Repository thông qua Dependency Injection tại constructor.
4. **Tầng Presentation (`src/app/`, `src/components/`):**
   - Xây dựng giao diện Next.js App Router, sử dụng Functional Components và TailwindCSS.
   - Tuyệt đối chỉ tương tác với hệ thống thông qua `Services`.

---

## 3. Hậu quả & Đánh đổi (Consequences)

### 3.1. Lợi ích:
- Thể hiện xuất sắc các yêu cầu học thuật của môn học OOAD (Class Diagram, Sequence Diagram ánh xạ 1:1 với mã nguồn).
- Dễ dàng viết Unit Test độc lập cho tầng Models và Services bằng cách giả lập (Mock) Repositories.
- Tầng giao diện UI hoàn toàn tách biệt khỏi cấu trúc database.

### 3.2. Đánh đổi:
- Cần viết nhiều file và lớp chuyển đổi (DTOs, Repository Interfaces, Entity instantiation) so với cách viết trực tiếp.
- Các AI coding agents nếu không được cấu hình luật sẽ có xu hướng viết tắt (gọi thẳng DB từ Component), do đó bắt buộc phải có `AGENTS.md` và `docs/architecture-boundaries.md` làm chốt chặn.
