# MODULE: DATA ACCESS REPOSITORIES (`frontend/src/repositories`)

Tầng Truy xuất Dữ liệu (Data Access Layer) chịu trách nhiệm tương tác với cơ sở dữ liệu PostgreSQL thông qua Supabase Client.

---

## 1. TRÁCH NHIỆM CHÍNH (SINGLE RESPONSIBILITY)
- Thực thi các thao tác CRUD (Create, Read, Update, Delete) với cơ sở dữ liệu Supabase.
- Chuyển đổi (Data Mapping) giữa các bản ghi Database thô (`snake_case`) sang các Đối tượng Hướng đối tượng Domain Entities (`camelCase`).
- Cô lập hoàn toàn cơ sở dữ liệu để tầng nghiệp vụ (`services`) không phụ thuộc vào công nghệ DB cụ thể.

---

## 2. CÁC HỢP ĐỒNG & LỚP TRIỂN KHAI (INTERFACES & IMPLEMENTATIONS)

| Interface | Lớp Triển khai | Trách nhiệm chính |
|---|---|---|
| `IBookRepository.ts` | `BookRepository.ts` | Truy vấn danh sách sách, tìm kiếm ISBN, cập nhật tồn kho |
| `IOrderRepository.ts` | `OrderRepository.ts` | Lưu đơn hàng, chi tiết đơn hàng, xuất hóa đơn vào Supabase |

---

## 3. CÁC DEPENDENCIES PHỤ THUỘC
- **Được phép phụ thuộc:**
  - `src/lib/supabase/client.ts` (kết nối Supabase)
  - `src/models/*` (khởi tạo thực thể từ dữ liệu query)
  - `src/types/dtos.ts` (tham số đầu vào)
  - `src/types/database.types.ts` (kiểu dữ liệu bảng của Supabase)
- **TUYỆT ĐỐI CẤM:**
  - Không import bất kỳ file nào từ `src/services/`
  - Không import bất kỳ file nào từ `src/components/` hoặc `src/app/`

---

## 4. QUY TẮC HIỆN THỰC HÓA (IMPLEMENTATION RULES)
1. **Tuân thủ Dependency Inversion Principle (DIP):** Mọi Service chỉ gọi thông qua Interface `I*Repository`.
2. **Khởi tạo Entity chuẩn OOP:** Khi truy vấn dữ liệu từ Supabase về, luôn instantiate qua constructor của Entity:
   ```typescript
   // ĐÚNG:
   return new Book({
     id: data.id,
     isbn: data.isbn,
     title: data.title,
     price: Number(data.price),
     stockQuantity: data.stock_quantity,
     ...
   });
   ```
3. **Bắt lỗi & Xử lý ngoại lệ:** Khi Supabase trả về `error`, cần log và ném ra Error với thông điệp nghiệp vụ rõ ràng, không nuốt lỗi âm thầm.
