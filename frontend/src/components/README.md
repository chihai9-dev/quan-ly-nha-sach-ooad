# MODULE: UI COMPONENTS (`frontend/src/components`)

Tầng Thành phần Giao diện (Presentation UI Components) chịu trách nhiệm hiển thị dữ liệu và tương tác trực quan với người dùng.

---

## 1. TRÁCH NHIỆM CHÍNH (SINGLE RESPONSIBILITY)
- Render giao diện người dùng theo thiết kế Responsive & Accessible (TailwindCSS, Lucide Icons).
- Quản lý trạng thái cục bộ của giao diện (ví dụ: mở/đóng modal, ô tìm kiếm đang gõ, giỏ hàng tạm thời).
- Bắt sự kiện người dùng và chuyển tiếp đến Tầng Services tương ứng để xử lý nghiệp vụ.

---

## 2. CẤU TRÚC PHÂN CHIA THEO PHÂN HỆ

| Thư mục | Trách nhiệm | Các Component chính |
|---|---|---|
| `components/books/` | Giao diện hiển thị, tìm kiếm và thêm mới sách | `BookCard`, `BookList`, `BookForm`, `BookFilter` |
| `components/cart/` | Giỏ hàng tạm thời tại quầy POS | `CartDrawer`, `CartItemRow`, `CartSummary` |
| `components/pos/` | Giao diện quầy thu ngân & máy quét mã vạch | `POSCheckout`, `BarcodeScannerSimulator`, `QuickProductGrid` |
| `components/invoice/` | Hiển thị và in hóa đơn thanh toán | `InvoiceModal`, `PrintInvoiceView` |
| `components/ui/` | Các thành phần giao diện dùng chung (Design System) | `Header`, `Sidebar`, `Button`, `Modal`, `Input`, `Badge` |

---

## 3. CÁC DEPENDENCIES PHỤ THUỘC
- **Được phép phụ thuộc:**
  - `src/services/*` (gọi các phương thức nghiệp vụ)
  - `src/models/*` (đọc dữ liệu hiển thị thông qua getters của Entity)
  - `src/types/dtos.ts` (truyền nhận dữ liệu dạng DTO)
  - `lucide-react`, `clsx`, `tailwind-merge`
- **TUYỆT ĐỐI CẤM:**
  - **CẤM** import trực tiếp Supabase Client (`@supabase/supabase-js` hoặc `src/lib/supabase/client.ts`)
  - **CẤM** import trực tiếp các file `Repository.ts`
  - **CẤM** thực hiện các tính toán nghiệp vụ cốt lõi tại UI (ví dụ: tự ý tính tiền VAT, tự trừ tồn kho - việc này phải do Model hoặc Service đảm nhận)

---

## 4. QUY TẮC PHÁT TRIỂN UI
1. **Ưu tiên Functional Components & Hooks:** Khai báo bằng `export const ComponentName: React.FC<Props> = (...)`.
2. **Strict Props Typing:** Mọi Component đều phải định nghĩa `interface ComponentProps` tường minh, cấm dùng `any`.
3. **Trải nghiệm người dùng:** Luôn hiển thị trạng thái Loading (Skeleton / Spinner) và Error Alert rõ ràng khi gọi async service.
