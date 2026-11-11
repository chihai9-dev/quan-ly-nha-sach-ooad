# HỆ THỐNG QUẢN LÝ NHÀ SÁCH (BOOKSTORE MANAGEMENT SYSTEM)
# AGENTS INSTRUCTIONS & CODING CONVENTIONS

Tài liệu này là **Kim chỉ nam tối cao (Golden Rules)** dành cho tất cả các AI Coding Agents (Antigravity, Cursor, Claude, v.v.) và Developer khi phát triển, bảo trì hoặc refactor mã nguồn trong repository này.

---

## 1. TECH STACK & QUY CHUẨN KỸ THUẬT

### 1.1. Core Stack
- **Framework:** Next.js 14+ (App Router).
- **Ngôn ngữ:** TypeScript 5+ (Strict Mode kích hoạt tối đa).
- **Styling:** TailwindCSS 3+ kết hợp `clsx` & `tailwind-merge`.
- **Database / Backend-as-a-Service:** Supabase PostgreSQL (`@supabase/supabase-js`).
- **Icons:** `lucide-react`.
- **Package Manager:** `npm` (thống nhất dùng `package-lock.json`, nghiêm cấm trộn lẫn `pnpm-lock.yaml` hay `yarn.lock`).

### 1.2. Thư viện Được phép & Bị cấm
| Phân loại | Được phép dùng (Allowed) | Bị cấm / Không khuyến khích (Forbidden) | Lý do |
|---|---|---|---|
| **State Management** | React Context + State, Zustand (nếu mở rộng) | Redux, MobX, Recoil | Cồng kềnh không cần thiết với scope hiện tại |
| **HTTP Client** | `fetch` native hoặc Supabase SDK client | `axios` | Đã có sẵn native fetch & SDK tối ưu hóa cho Next.js |
| **Schema Validation** | `zod` | Joi, Yup | Zod tương thích hoàn hảo với TypeScript type inference |
| **Icons** | `lucide-react` | FontAwesome, Material Icons | Giữ bundle size nhẹ và phong cách thiết kế đồng bộ |
| **Utility Libraries** | Native ES6+ (Array, Object methods), `clsx` | `lodash`, `underscore`, `moment.js` | Tận dụng Date native hoặc Dayjs/date-fns siêu nhẹ nếu cần |

### 1.3. Strict Typing & Code Standards
1. **Tuyệt đối cấm sử dụng `any`:**
   - Mọi biến, tham số hàm, kiểu trả về phải có type/interface tường minh.
   - Nếu chưa rõ kiểu dữ liệu động từ API hoặc bên thứ ba, bắt buộc dùng `unknown` kèm Type Guards hoặc Zod schema parsing.
2. **Strict Null Checks:** Luôn kiểm tra `null` / `undefined` trước khi truy cập thuộc tính.
3. **Immutability & Pure Functions:**
   - Ưu tiên Functional Programming trong tầng UI (React Components) và Utilities.
   - Áp dụng triệt để Object-Oriented Programming (OOP) trong tầng Domain (`models/`).
4. **Không bỏ qua lỗi kiểm tra:** Không dùng `@ts-ignore` hay `@ts-nocheck` trừ khi có lý do bất khả kháng được giải thích bằng comment rõ ràng.

---

## 2. RANH GIỚI KIẾN TRÚC & QUY TẮC PHỤ THUỘC (ARCHITECTURE BOUNDARIES)

Dự án áp dụng mô hình **Layered Architecture (Kiến trúc phân tầng)** kết hợp chặt chẽ với **Domain-Driven Design (DDD)** và **Nguyên lý Hướng đối tượng (OOP & SOLID)**.

### 2.1. Sơ đồ phân tầng và chiều phụ thuộc đơn hướng:
```text
┌─────────────────────────────────────────────────────────────┐
│              1. PRESENTATION LAYER (Giao diện)              │
│       App Router (src/app) + UI Components (src/components)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Phụ thuộc (Chỉ gọi Service & DTOs)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              2. APPLICATION SERVICES LAYER                  │
│       Điều phối nghiệp vụ, xử lý giao dịch (src/services)   │
└──────────────────────┬──────────────────────┬───────────────┘
                       │                      │
       Nhận Interface  │                      │ Thao tác với Entity
                       ▼                      ▼
┌───────────────────────────────────┐  ┌──────────────────────┐
│    3. DATA ACCESS LAYER (Repo)    │  │  4. DOMAIN LAYER     │
│  - Interfaces (src/repositories)  │  │     (src/models)     │
│  - Supabase Impl (src/repositories│  │  - Entities          │
└─────────────────┬─────────────────┘  │  - BaseEntity        │
                  │                    │  - Value Objects     │
                  ▼                    │  (Pure Business)     │
           [Supabase DB]               └──────────────────────┘
```

### 2.2. Quy tắc ranh giới bất biến (Golden Architectural Rules):
1. **Quy tắc phụ thuộc một chiều (Dependency Rule):**
   - Tầng cao phụ thuộc tầng thấp: `Presentation -> Services -> Repositories -> Models`.
   - **Tầng Domain (`src/models`):** Là vùng lõi thuần khiết (Pure Core). **Tuyệt đối KHÔNG import** bất kỳ thứ gì từ `services`, `repositories`, `components`, `app`, hoặc `@supabase/supabase-js`.
   - **Tầng UI (`src/components`, `src/app`):** **Tuyệt đối KHÔNG gọi trực tiếp Supabase Client** hay query database tại Component. Mọi thao tác phải thông qua `Services`.
2. **Dependency Inversion Principle (DIP):**
   - Tầng `Services` chỉ giao tiếp với Repository thông qua Interface (ví dụ: `IBookRepository`, `IOrderRepository`).
   - Repository Implementation (`BookRepository`) hiện thực hóa Interface và được tiêm (Dependency Injection) qua constructor của Service.
3. **Cấm Circular Dependencies (Vòng lặp phụ thuộc):**
   - Không import chéo giữa các Service (ví dụ: `BookService` import `OrderService` và ngược lại). Nếu có nghiệp vụ chung, hãy tách ra Domain Service riêng hoặc dùng Mediator/Event.

Chi tiết xem tại: [`docs/architecture-boundaries.md`](file:///c:/Users/Admin/Downloads/OneDrive%20-%20Saigon%20University/Desktop/bookstore-management-system/docs/architecture-boundaries.md).

---

## 3. TỪ ĐIỂN NGHIỆP VỤ (UBIQUITOUS LANGUAGE)

Để đảm bảo tính nhất quán tuyệt đối trong mã nguồn, tên biến, hàm, models, DTOs và tài liệu, toàn bộ đội ngũ và AI phải tuân thủ chuẩn từ vựng:

| Khái niệm nghiệp vụ | Thuật ngữ thống nhất | Từ BỊ CẤM / Tránh dùng | Ghi chú & Phạm vi |
|---|---|---|---|
| Sách | `Book` | `Product`, `Item`, `Goods` | Thực thể sách bán trong kho |
| Danh mục thể loại sách | `Category` | `Genre`, `Classification` | Danh mục sách (Văn học, Kỹ năng,...) |
| Khách hàng | `Customer` | `Client`, `Buyer`, `User` | Khách mua hàng, thành viên tích điểm |
| Đơn hàng bán lẻ | `Order` | `Sale`, `Purchase` | Đơn hàng tạo tại quầy POS |
| Chi tiết đơn hàng | `OrderItem` | `OrderLine`, `CartDetail` | Từng đầu sách và số lượng trong đơn |
| Hóa đơn thanh toán | `Invoice` | `Bill`, `Receipt` | Chứng từ xuất cho khách kèm thanh toán |
| Quầy thu ngân | `POS` (Point of Sale) | `CheckoutCounter` | Module bán hàng tại quầy |
| Phiếu nhập sách từ NCC | `GoodsReceipt` / `PurchaseOrder` | `ImportNote`, `Order` | Tránh nhầm lẫn với `Order` bán lẻ |
| Nhà cung cấp | `Supplier` | `Vendor`, `Provider` | Đơn vị cung cấp sách cho nhà sách |
| Công nợ nhà cung cấp | `SupplierDebt` | `Payable`, `Credit` | Theo dõi tiền nợ nhập sách |
| Kiểm kê kho | `StockAudit` / `InventoryAdjustment` | `CheckWarehouse` | Nghiệp vụ kiểm đếm và cân bằng kho |
| Chương trình khuyến mãi | `PromotionCampaign` | `DiscountEvent`, `SaleEvent` | Chiến dịch giảm giá, combo |
| Mã giảm giá | `DiscountCoupon` / `Voucher` | `PromoCode` | Mã coupon có điều kiện áp dụng |
| Nhân viên / Thu ngân | `Staff` / `Employee` / `Cashier` | `User` | Tránh dùng `User` chung chung |
| Hạng thành viên | `MembershipTier` | `CustomerLevel`, `Rank` | `STANDARD`, `SILVER`, `GOLD`, `PLATINUM` |
| Phương thức thanh toán | `PaymentMethod` | `PayType` | `CASH`, `BANK_TRANSFER`, `MOMO`, `CARD` |

Chi tiết toàn bộ từ điển xem tại: [`docs/ubiquitous-language.md`](file:///c:/Users/Admin/Downloads/OneDrive%20-%20Saigon%20University/Desktop/bookstore-management-system/docs/ubiquitous-language.md).

---

## 4. QUY TRÌNH PHÁT TRIỂN TIÊU CHUẨN CỦA AGENT

Mọi yêu cầu tính năng, sửa lỗi hoặc tái cấu trúc phải tuân theo 4 bước bắt buộc sau:

### Bước 1: Viết Plan / Spec trước khi sinh code (Plan First)
- **Cấm:** Không lập tức sinh mã nguồn khi nhận một yêu cầu chung chung (ví dụ: "Làm trang nhập hàng").
- **Hành động bắt buộc:**
  1. Đọc kỹ module liên quan, schema database và các use-case doc trong `docs/`.
  2. Lập bản kế hoạch (Implementation Plan):
     - Danh sách file cần tạo mới / chỉnh sửa.
     - Flow dữ liệu (Data flow từ UI -> Service -> Repository -> DB).
     - Ranh giới kiến trúc & Contracts (DTOs, Interfaces).
     - Các trường hợp biên & ngoại lệ (Edge cases, Error handling).
  3. Trình bày Plan cho Developer duyệt. Chỉ bắt tay vào code khi đã thống nhất kế hoạch.

### Bước 2: Type-Driven Development (Hợp đồng dữ liệu trước)
- Luôn định nghĩa DTOs, schemas, và interfaces trước khi hiện thực hóa logic.
- Vị trí:
  - Data transfer & params: `src/types/dtos.ts`.
  - Database schema models: `src/types/database.types.ts`.
  - Repository contracts: `src/repositories/I[Name]Repository.ts`.

### Bước 3: Khoanh vùng ngữ cảnh (Context Isolation)
- Khi thực hiện task, chỉ nạp và tham chiếu các file trực tiếp liên quan đến module đó.
- Không đọc bừa bãi hàng chục file không cần thiết làm tràn context window hoặc gây ảo giác (hallucination).

### Bước 4: Test-Driven & Chốt chặn kiểm thử (TDD & Verification)
- Viết Unit Tests song song cho các Domain Entities và Service methods có nghiệp vụ trọng yếu.
- Đảm bảo các logic tính toán (tính VAT, chiết khấu hạng thẻ, trừ tồn kho, validation giá âm) luôn được kiểm thử tự động.

---

## 5. CHIẾN LƯỢC DOCS-AS-CODE & ADR

1. **Module-Level README.md:**
   - Mỗi package/thư mục tầng cốt lõi (`models/`, `repositories/`, `services/`, `components/`, `app/`) bắt buộc có 1 file `README.md` tự tài liệu hóa (Self-documenting):
     - Trách nhiệm chính của module (Single Responsibility).
     - Danh sách Public APIs/Interfaces cung cấp.
     - Danh sách dependencies phụ thuộc.
2. **Architecture Decision Records (ADR):**
   - Mọi quyết định thay đổi thư viện, đổi cấu trúc schema DB, hoặc refactor kiến trúc phải được ghi lại thành file Markdown tại: `docs/adr/00X-ten-quyet-dinh.md` (Context, Decision, Consequences).

---

## 6. QUY TRÌNH REVIEW PHẢN BIỆN (PRINCIPAL ENGINEER REVIEW)

Trước khi đóng bất kỳ task nào hoặc báo hoàn thành công việc, Agent phải tự phản biện và review lại code bằng cách đóng vai **Principal Engineer khắt khe**:
- [ ] Code có vi phạm ranh giới tầng nào không? (UI có query DB trực tiếp không?)
- [ ] Có xuất hiện kiểu `any` hoặc bypass type check không?
- [ ] Các thuộc tính Entity có được đóng gói (Encapsulated) an toàn không?
- [ ] Có xử lý các edge case: số lượng tồn kho âm, chia cho 0, chuỗi rỗng, SQL Injection, Null Pointer không?
- [ ] Naming có đúng chuẩn với `docs/ubiquitous-language.md` không?
- [ ] Đã cập nhật docs hoặc module README tương ứng chưa?
