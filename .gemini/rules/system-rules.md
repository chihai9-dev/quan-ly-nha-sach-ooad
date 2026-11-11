# RULES FOR ANTIGRAVITY (GEMINI AI ASSISTANT)
# PROJECT: BOOKSTORE MANAGEMENT SYSTEM (OOAD)

Mọi hành động sinh mã, phân tích hoặc đề xuất giải pháp của Antigravity trong dự án này phải tuân thủ nghiêm ngặt các điều khoản sau:

## 1. QUY TẮC BẮT BUỘC (MANDATORY RULES)
1. **Phân tích trước - Lập Plan trước khi code (Plan First):**
   - Tuyệt đối không sinh mã code ngay khi nhận yêu cầu chung chung.
   - Luôn phân tích use-case, vạch ra checklist các file cần tạo/chỉnh sửa, flow dữ liệu, và các edge cases.
   - Yêu cầu xác nhận từ lập trình viên trước khi bắt đầu ghi file lớn.
2. **Strict Typing (Không `any`):**
   - Dự án bật `strict: true` trong `tsconfig.json`.
   - Mọi biến, tham số, interface, return type đều phải có kiểu dữ liệu rõ ràng. Cấm triệt để `any`.
3. **Tuân thủ ranh giới phân tầng (Architecture Boundary):**
   - Presentation (React UI) -> Services -> Repositories (Interfaces) -> Models (Core OOP).
   - Tuyệt đối không để Component gọi thẳng Supabase Client.
   - Tuyệt đối không để Model phụ thuộc vào Service hoặc Database.
4. **Từ điển nghiệp vụ đồng nhất (Ubiquitous Language):**
   - Tham khảo và dùng chính xác các thuật ngữ trong `docs/ubiquitous-language.md`.
   - Ví dụ: `Book` (không dùng `Product`), `Customer` (không dùng `User`), `Order` (bán hàng tại POS), `GoodsReceipt` (nhập hàng từ NCC), `Invoice` (hóa đơn thanh toán).
5. **Đóng gói OOP chặt chẽ:**
   - Trong `src/models/`, mọi Entity phải kế thừa `BaseEntity`.
   - Thuộc tính phải là `private` hoặc `protected`, chỉ cho phép đọc/ghi qua getters và các business methods có kiểm tra hợp lệ (validation invariants).

## 2. QUY TRÌNH REVIEW PHẢN BIỆN (SELF-AUDIT)
Trước khi thông báo hoàn thành task, hãy tự kiểm tra theo checklist của một Principal Engineer:
- Không có circular dependencies.
- Không có hardcoded strings bừa bãi.
- Xử lý đầy đủ trường hợp lỗi (try/catch, graceful error states).
- Đảm bảo đúng chuẩn thiết kế hướng đối tượng (OOAD).
