# GHI CHÉP QUYẾT ĐỊNH KIẾN TRÚC (ARCHITECTURE DECISION RECORDS - ADR)

Thư mục này lưu trữ các **Architecture Decision Records (ADRs)** của dự án Hệ Thống Quản Lý Nhà Sách. 

## 1. ADR là gì?
ADR là một văn bản tài liệu ngắn gọn ghi lại các quyết định kiến trúc quan trọng, bao gồm:
- **Bối cảnh (Context):** Tại sao cần đưa ra quyết định này?
- **Quyết định (Decision):** Chúng ta đã chọn giải pháp gì?
- **Hậu quả & Đánh đổi (Consequences):** Lợi ích đạt được và những thách thức/hạn chế phải chấp nhận.

## 2. Khi nào cần tạo ADR mới?
Bất cứ khi nào lập trình viên hoặc AI Agent:
- Đổi hoặc bổ sung một thư viện quan trọng (ví dụ: thay đổi State Manager, đổi thư viện Validation).
- Thay đổi cấu trúc cơ sở dữ liệu lớn (DDL, quan hệ giữa các bảng).
- Refactor hoặc thay đổi luồng xử lý kiến trúc cốt lõi.

## 3. Quy ước đặt tên file ADR
`docs/adr/XXX-ten-quyet-dinh-ngan-gon.md` (ví dụ: `docs/adr/001-layered-architecture-and-oop.md`).

## 4. Danh sách các ADR hiện tại:
- [ADR 001: Lựa chọn Layered Architecture kết hợp OOP trong Next.js](file:///c:/Users/Admin/Downloads/OneDrive%20-%20Saigon%20University/Desktop/bookstore-management-system/docs/adr/001-layered-architecture-and-oop.md) (Trạng thái: **Accepted**)
