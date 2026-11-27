# MODULE: DATA ACCESS REPOSITORIES (`frontend/src/repositories`)

Tầng Truy xuất Dữ liệu (Data Access Layer) chịu trách nhiệm tương tác với 22 bảng PostgreSQL trên Supabase (theo `docs/diagrams/Relational data model.drawio` và `supabase/schema.sql`), có cơ chế fallback an toàn sang in-memory mock store khi chưa cấu hình `.env.local`.

---

## 1. TRÁCH NHIỆM CHÍNH (SINGLE RESPONSIBILITY)
- Thực thi các thao tác CRUD trên 22 bảng Supabase (`public.*`) theo chiến lược **Supabase-first + Fallback Mock** thông qua helper `isSupabaseConfigured()`.
- Chuyển đổi (Data Mapping) giữa bản ghi DB (`snake_case`) sang 21 Domain Entities (`src/models/`) và DTOs (`src/types/dtos.ts`).
- Cô lập hoàn toàn cơ sở dữ liệu để tầng nghiệp vụ (`src/services/`) chỉ phụ thuộc vào Interface (`I*Repository`).

---

## 2. DANH SÁCH HỢP ĐỒNG & LỚP TRIỂN KHAI

| Interface | Lớp Triển khai | Bảng Supabase (`supabase/schema.sql`) | Phân hệ (BFD) |
|---|---|---|---|
| `IBookRepository` | `BookRepository` | `sach`, `sach_tac_gia`, `the_loai`, `tac_gia`, `nha_xuat_ban`, `chuong_trinh_khuyen_mai` | Quản lý sách (QLS) |
| `ICatalogRepository` | `CatalogRepository` | `the_loai`, `tac_gia`, `nha_xuat_ban` | Quản lý danh mục sách (QLDMS) |
| `IOrderRepository` | `OrderRepository` | `hoa_don`, `chi_tiet_hoa_don`, `thanh_toan`, `ma_giam_gia`, `khach_hang` | Quản lý bán hàng (QLBH) |
| `IReturnRepository` | `ReturnRepository` | `phieu_doi_tra`, `chi_tiet_doi_tra` | Quản lý đổi trả hàng |
| `IInventoryRepository` | `InventoryRepository` | `sach`, `phieu_kiem_ke`, `chi_tiet_kiem_ke` | Quản lý kho (QLK) |
| `ISupplierRepository` | `SupplierRepository` | `nha_cung_cap`, `phieu_nhap` | Quản lý nhà cung cấp (QLNCC) |
| `IGoodsReceiptRepository` | `GoodsReceiptRepository` | `phieu_nhap`, `chi_tiet_phieu_nhap`, `phieu_thanh_toan_ncc` | Quản lý nhập hàng (QLNH) |
| `ICustomerRepository` | `CustomerRepository` | `khach_hang`, `hoa_don` | Quản lý khách hàng (QLKH) |
| `IPromotionRepository` | `PromotionRepository` | `chuong_trinh_khuyen_mai`, `ma_giam_gia` | Quản lý khuyến mãi (QLKM) |
| `IStaffRepository` | `StaffRepository` | `nhan_vien`, `tai_khoan` | Quản lý nhân viên (QLNV) |
| `ITaiKhoanRepository` / `IVaiTroRepository` | `TaiKhoanRepository` / `VaiTroRepository` | `tai_khoan`, `vai_tro`, `nhan_vien` | Quản lý hệ thống (QLHT) |

---

## 3. CÁC DEPENDENCIES PHỤ THUỘC
- **Được phép phụ thuộc:**
  - `src/lib/supabase/client.ts` (`supabase`, `isSupabaseConfigured`)
  - `src/models/*` (21 thực thể Domain chuẩn OOP)
  - `src/types/dtos.ts`, `src/types/database.types.ts`
- **TUYỆT ĐỐI CẤM:**
  - Không import từ `src/services/`, `src/components/`, `src/app/`.

---

## 4. QUY TẮC HIỆN THỰC HÓA (IMPLEMENTATION RULES)
1. **Tuân thủ Dependency Inversion Principle (DIP):** Mọi Service chỉ gọi thông qua Interface `I*Repository`.
2. **Khởi tạo Entity chuẩn OOP:** Luôn instantiate qua constructor của Domain Entity (`Sach`, `HoaDon`, `KhachHang`, `NhaCungCap`,...):
   ```typescript
   return new Sach({
     maSach: row.ma_sach,
     tenSach: row.ten_sach,
     namXuatBan: row.nam_xuat_ban ?? 2024,
     giaNhap: Number(row.gia_nhap),
     giaBan: Number(row.gia_ban),
     soLuongTon: row.so_luong_ton,
     mucTonToiThieu: row.muc_ton_toi_thieu,
     trangThai: row.trang_thai,
   });
   ```
3. **Bắt lỗi & Xử lý ngoại lệ:** Khi thao tác ghi vào Supabase lỗi, ném `Error` với thông điệp nghiệp vụ rõ ràng, không nuốt lỗi âm thầm.
