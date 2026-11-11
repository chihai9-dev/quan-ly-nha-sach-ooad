# MODULE: NEXT.JS APP ROUTER (`frontend/src/app`)

Tầng Định tuyến Ứng dụng (Application Routing Layer) chịu trách nhiệm cấu trúc các trang màn hình, layout tổng thể, và điểm vào (entry points) của các tính năng trong hệ thống.

---

## 1. DANH SÁCH CÁC TRANG & ROUTING

| Tuyến đường (Route) | File xử lý | Chức năng nghiệp vụ |
|---|---|---|
| `/` | `src/app/page.tsx` | Dashboard tổng quan: thống kê doanh thu trong ngày, sách bán chạy, cảnh báo hết hàng |
| `/pos` | `src/app/pos/page.tsx` | Màn hình Quầy bán hàng (POS): tìm kiếm sách, quét barcode, giỏ hàng, thanh toán & in hóa đơn |
| `/books` | `src/app/books/page.tsx` | Màn hình Quản lý kho sách: bảng danh sách, bộ lọc thể loại/tồn kho, modal thêm/sửa sách |
| `/orders` | `src/app/orders/page.tsx` | Màn hình Lịch sử đơn hàng & hóa đơn: tra cứu đơn đã hoàn tất, in lại hóa đơn |
| `layout.tsx` | `src/app/layout.tsx` | Root Layout: chứa Sidebar điều hướng, Header thông tin thu ngân, Toast notification container |

---

## 2. QUY TẮC BẮT BUỘC KHI XÂY DỰNG TRANG
1. **Phân tách Server & Client Components:**
   - Dùng `'use client'` ở đầu file khi trang cần tương tác người dùng (forms, buttons, event handlers, client hooks như `useState`, `useEffect`).
   - Giữ các layout tĩnh dạng Server Component để tối ưu hiệu năng render.
2. **Không gọi Database trực tiếp:**
   - Dù là Server Component hay Client Component, luôn gọi dữ liệu qua tầng `Services` (`BookService`, `OrderService`), tuyệt đối không import Supabase client trực tiếp tại `page.tsx`.
3. **Quản lý Tiêu đề & Metadata:**
   - Đặt metadata title rõ ràng (ví dụ: `Quản lý Nhà Sách | Quầy Thu Ngân POS`).
