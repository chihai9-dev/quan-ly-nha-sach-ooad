# MODULE: DOMAIN MODELS (`frontend/src/models`)

Tầng Mô hình Thực thể Nghiệp vụ (Core Domain Layer) hiện thực hóa toàn bộ các lớp từ `docs/diagrams/Class diagram.drawio` theo nguyên lý Phân tích & Thiết kế Hướng đối tượng (OOAD).

---

## 1. TRÁCH NHIỆM CHÍNH (SINGLE RESPONSIBILITY)
- Đóng gói dữ liệu (`private _field` + `getter` / `setter`) và các quy tắc ràng buộc nghiệp vụ (Business Invariants).
- Thể hiện đầy đủ các mối quan hệ trong Class Diagram:
  - **Kế thừa (Inheritance):** `BaseEntity` -> `NguoiDung` -> `NhanVien`, `KhachHang`.
  - **Hợp thành (Composition ◆):** `HoaDon` ◆— `ChiTietHoaDon`, `PhieuNhap` ◆— `ChiTietPhieuNhap`, `PhieuKiemKe` ◆— `ChiTietKiemKe`, `PhieuDoiTra` ◆— `ChiTietDoiTra`.
  - **Kết tập (Aggregation ◇) & Liên kết (Association):** `Sach` liên kết `TheLoai`, `NhaXuatBan`, `TacGia[]`, `ChuongTrinhKhuyenMai`; `TaiKhoan` liên kết `VaiTro`, `NhanVien`.

---

## 2. DANH SÁCH CÁC LỚP THEO CLASS DIAGRAM

| File / Class | Kế thừa | Bảng SQL (`supabase/schema.sql`) | Phương thức nghiệp vụ cốt lõi |
|---|---|---|---|
| `BaseEntity.ts` | *(Abstract)* | — | `getId()`, `getCreatedAt()`, `getUpdatedAt()`, `touch()` |
| `NguoiDung.ts` | `BaseEntity` | *(Abstract)* | Quản lý `hoTen`, `soDienThoai`, `email` cho `NhanVien` & `KhachHang` |
| `VaiTro.ts` | `BaseEntity` | `vai_tro` | `phanQuyen()`, `coQuyen()` |
| `TaiKhoan.ts` | `BaseEntity` | `tai_khoan` | `dangNhap()`, `dangXuat()`, `quenMatKhau()`, `doiMatKhau()` |
| `NhanVien.ts` | `NguoiDung` | `nhan_vien` | `capNhatThongTin()`, `traCuuNhanVien()` |
| `TheLoai.ts` | `BaseEntity` | `the_loai` | `quanLyTheLoai()` |
| `TacGia.ts` | `BaseEntity` | `tac_gia` | `quanLyTacGia()` |
| `NhaXuatBan.ts` | `BaseEntity` | `nha_xuat_ban` | `quanLyNXB()` |
| `Sach.ts` | `BaseEntity` | `sach`, `sach_tac_gia` | `capNhatThongTinSach()`, `traCuuSach()`, `kiemTraCanhBaoTonKho()`, `capNhatSoLuongTon()` |
| `PhieuKiemKe.ts` | `BaseEntity` | `phieu_kiem_ke` | `taoPhieuKiemKe()`, `canBangKho()`, `layDanhSachCanhBaoTon()` |
| `ChiTietKiemKe.ts` | — | `chi_tiet_kiem_ke` | `tinhChenhLech()` |
| `NhaCungCap.ts` | `BaseEntity` | `nha_cung_cap` | `capNhatThongTinNCC()`, `traCuuNCC()`, `traCuuLichSuNhapHang()`, `capNhatCongNo()` |
| `PhieuNhap.ts` | `BaseEntity` | `phieu_nhap` | `lapPhieuNhap()`, `traCuuPhieuNhap()`, `tinhTongTien()`, `calculateTotal()` |
| `ChiTietPhieuNhap.ts` | — | `chi_tiet_phieu_nhap` | `tinhThanhTien()` |
| `PhieuThanhToanNCC.ts` | `BaseEntity` | `phieu_thanh_toan_ncc` | `ghiNhanThanhToanNCC()` |
| `KhachHang.ts` | `NguoiDung` | `khach_hang` | `capNhatThongTinKH()`, `traCuuKH()`, `traCuuLichSuMuaHang()` |
| `ChuongTrinhKhuyenMai.ts` | `BaseEntity` | `chuong_trinh_khuyen_mai` | `thietLapChuongTrinhKM()`, `dangHieuLuc()` |
| `MaGiamGia.ts` | `BaseEntity` | `ma_giam_gia` | `quanLyMaGiamGia()`, `kiemTraHopLe()` |
| `HoaDon.ts` | `BaseEntity` | `hoa_don` | `lapHoaDon()`, `traCuuHoaDon()`, `tinhTongThanhToan()`, `calculateTotal()`, `applyDiscount()` |
| `ChiTietHoaDon.ts` | — | `chi_tiet_hoa_don` | `tinhThanhTien()` |
| `ThanhToan.ts` | `BaseEntity` | `thanh_toan` | `ghiNhanThanhToan()` |
| `PhieuDoiTra.ts` | `BaseEntity` | `phieu_doi_tra` | `lapPhieuDoiTra()`, `quanLyDoiTraHang()` |
| `ChiTietDoiTra.ts` | — | `chi_tiet_doi_tra` | `tinhTienHoan()` |

---

## 3. CÁC DEPENDENCIES PHỤ THUỘC (DEPENDENCY RESTRICTIONS)
- **Được phép phụ thuộc:** Các Entity nội bộ trong `src/models/` và type thuần trong `src/types/`.
- **TUYỆT ĐỐI CẤM:** Không import từ `src/services/`, `src/repositories/`, `@supabase/supabase-js`, hoặc React/Next.js.
