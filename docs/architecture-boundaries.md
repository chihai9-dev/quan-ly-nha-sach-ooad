# ĐẶC TẢ RANH GIỚI KIẾN TRÚC & QUY TẮC PHỤ THUỘC (ARCHITECTURE BOUNDARIES)
# DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ SÁCH (BOOKSTORE MANAGEMENT SYSTEM)

Tài liệu này xác định rõ ranh giới các module và các tầng kiến trúc trong hệ thống nhằm ngăn chặn triệt để:
- **Vòng lặp phụ thuộc (Circular Dependencies)**
- **Xâm lấn logic giữa các tầng (Layer Boundary Leaks)**
- **Tình trạng UI gọi trực tiếp Database hoặc Domain Model chứa logic truy vấn**

---

## 1. MÔ HÌNH KIẾN TRÚC TỔNG THỂ

Hệ thống tuân theo mô hình **Layered Architecture (Kiến trúc phân tầng)** với 4 tầng phân tách rành mạch:

```mermaid
flowchart TD
    subgraph L1["1. Presentation Layer (Giao diện người dùng)"]
        Pages["Next.js App Router (src/app/*)"]
        UIComp["React UI Components (src/components/*)"]
    end

    subgraph L2["2. Application Service Layer (Điều phối nghiệp vụ)"]
        BookService["BookService (src/services/BookService.ts)"]
        OrderService["OrderService (src/services/OrderService.ts)"]
        OtherServices["CustomerService, InventoryService..."]
    end

    subgraph L3["3. Data Access Layer (Truy xuất dữ liệu)"]
        Interfaces["Repository Interfaces (IBookRepository, IOrderRepository)"]
        Implementations["Supabase Implementations (BookRepository, OrderRepository)"]
        SupabaseClient["Supabase Client (src/lib/supabase/client.ts)"]
    end

    subgraph L4["4. Domain Core Layer (Thực thể OOP cốt lõi)"]
        BaseEntity["BaseEntity (Abstract Core)"]
        Entities["Book, Category, Order, OrderItem, Customer, Invoice"]
        DTOs["DTOs & Parameter Interfaces (src/types/dtos.ts)"]
    end

    Pages --> UIComp
    UIComp --> BookService
    UIComp --> OrderService
    UIComp --> DTOs

    BookService --> Interfaces
    BookService --> Entities
    BookService --> DTOs

    OrderService --> Interfaces
    OrderService --> Entities
    OrderService --> DTOs

    Implementations -.->|Implements| Interfaces
    Implementations --> SupabaseClient
    Implementations --> Entities
    Implementations --> DTOs

    Entities --|> BaseEntity
```

---

## 2. QUY TẮC PHỤ THUỘC ĐƠN HƯỚNG (UNIDIRECTIONAL DEPENDENCY RULE)

### 2.1. Ma trận phụ thuộc được phép (Allowed Dependencies Matrix)

| Tầng gọi tới (Caller) | Được phép gọi (Allowed) | TUYỆT ĐỐI CẤM (Forbidden) |
|---|---|---|
| **Presentation Layer** (`src/app`, `src/components`) | - `src/services/*`<br>- `src/types/dtos.ts`<br>- `src/models/*` (chỉ đọc thuộc tính qua getters) | - **CẤM** gọi `src/lib/supabase/*`<br>- **CẤM** gọi trực tiếp các file `Repository.ts`<br>- **CẤM** import SQL query |
| **Application Service Layer** (`src/services`) | - `src/repositories/I*Repository.ts` (Interface)<br>- `src/models/*` (Domain Entities)<br>- `src/types/dtos.ts` | - **CẤM** import trực tiếp Repository Implementation khác khi chưa qua DI<br>- **CẤM** import ngược lên Presentation Layer (`src/app`, `src/components`)<br>- **CẤM** circular call giữa các Service |
| **Data Access Layer** (`src/repositories`) | - `src/lib/supabase/*`<br>- `src/models/*` (Khởi tạo Entity từ DB Record)<br>- `src/types/database.types.ts`<br>- `src/types/dtos.ts` | - **CẤM** import `src/services/*`<br>- **CẤM** import `src/components/*` hoặc `src/app/*` |
| **Domain Core Layer** (`src/models`) | - `BaseEntity.ts`<br>- Các Entity nội bộ (`Book.ts`, `OrderItem.ts`)<br>- `src/types/*` thuần kiểu dữ liệu | - **CẤM IMPORT BẤT KỲ THỨ GÌ TỪ BÊN NGOÀI:** Không import Service, Repository, Supabase, Next.js, React, UI. Đây là tầng hoàn toàn độc lập (Pure TypeScript). |

---

## 3. CÁC ANTI-PATTERNS KIẾN TRÚC PHẢI TRÁNH

### ❌ Anti-pattern 1: UI Component query trực tiếp Database
- **Sai:** Trong `src/app/books/page.tsx` gọi `createClient().from('books').select('*')`.
- **Đúng:** Component khởi tạo hoặc nhận `BookService`, sau đó gọi `await bookService.getAllBooks()`.

### ❌ Anti-pattern 2: Anemic Domain Model (Mô hình thực thể suy dinh dưỡng)
- **Sai:** Tạo class `Book` chỉ toàn getter/setter rỗng, rồi đẩy toàn bộ logic kiểm tra tồn kho, giảm giá, đổi trạng thái ra ngoài component hoặc file script tùy tiện.
- **Đúng:** Logic nghiệp vụ gắn liền với dữ liệu phải nằm bên trong Entity (Encapsulation):
  ```typescript
  // ĐÚNG:
  book.reduceStock(quantity); // Bên trong kiểm tra tồn kho, ném Exception nếu âm
  order.calculateTotals();   // Tự động tính subtotal, VAT, chiết khấu
  ```

### ❌ Anti-pattern 3: Circular Dependencies (Vòng lặp phụ thuộc)
- **Sai:** `OrderService` import `CustomerService`, và `CustomerService` lại import `OrderService` để tra cứu lịch sử mua hàng.
- **Giải pháp:** Tách phần nghiệp vụ dùng chung xuống tầng Repository Interface hoặc Domain Service chuyên biệt, hoặc truyền DTO kết quả.

### ❌ Anti-pattern 4: Rò rỉ kiểu Database lên Presentation (Database Schema Leakage)
- **Sai:** Component UI nhận trực tiếp `Row<'books'>` từ Supabase với các trường `snake_case` (`publish_year`, `category_id`).
- **Đúng:** Tầng Repository map dữ liệu bảng sang Domain Entity `Book` (OOP) hoặc `BookDTO` (`camelCase`), giúp UI hoàn toàn không bị ảnh hưởng khi cấu trúc bảng database thay đổi.

---

## 4. CHIẾN LƯỢC QUẢN LÝ DEPENDENCY INJECTION (DI)

Để tuân thủ nguyên lý **Dependency Inversion (DIP)** mà không cần cấu hình framework DI cồng kềnh:
- Mọi Service nhận Interface Repository qua constructor, có gán giá trị mặc định (Default Parameter) để thuận tiện cho production, đồng thời dễ dàng truyền Mock Repository khi chạy Unit Test:

```typescript
export class BookService {
  private readonly bookRepo: IBookRepository;

  // Hỗ trợ cả khởi tạo mặc định và tiêm mock repository khi kiểm thử
  constructor(bookRepo: IBookRepository = new BookRepository()) {
    this.bookRepo = bookRepo;
  }
}
```
