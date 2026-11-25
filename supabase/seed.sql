-- =============================================================================
-- DỮ LIỆU MẪU (SEED DATA) — 5 ACTOR THEO SƠ ĐỒ USE CASE TỔNG QUÁT
-- Nguồn: docs/diagrams/Sơ đồ usecase/usecase Tổng quát.drawio
-- Chạy file này trên Supabase SQL Editor SAU KHI chạy supabase/schema.sql
-- Mật khẩu mặc định của tất cả tài khoản mẫu là: 123456
-- =============================================================================

-- 1. VAI TRÒ (5 Actor khớp chính xác tên trong Sơ đồ Use Case)
insert into public.vai_tro (ma_vai_tro, ten_vai_tro, danh_sach_quyen)
values
  (
    'NGUOI_DUNG_HE_THONG',
    'Người dùng hệ thống',
    array['DANG_NHAP', 'DANG_XUAT', 'QUEN_MAT_KHAU', 'DOI_MAT_KHAU']
  ),
  (
    'QUAN_TRI_VIEN',
    'Quản trị viên',
    array[
      'DANG_NHAP', 'DANG_XUAT', 'QUEN_MAT_KHAU', 'DOI_MAT_KHAU',
      'QUAN_LY_HE_THONG', 'PHAN_QUYEN', 'QUAN_LY_TAI_KHOAN'
    ]
  ),
  (
    'QUAN_LY',
    'Quản lý',
    array[
      'DANG_NHAP', 'DANG_XUAT', 'QUEN_MAT_KHAU', 'DOI_MAT_KHAU',
      'QUAN_LY_BAN_HANG', 'QUAN_LY_KHO', 'QUAN_LY_NHAP_HANG',
      'QUAN_LY_NHA_CUNG_CAP', 'QUAN_LY_KHUYEN_MAI', 'QUAN_LY_NHAN_VIEN',
      'THONG_KE_BAO_CAO'
    ]
  ),
  (
    'NHAN_VIEN_BAN_HANG',
    'Nhân viên bán hàng',
    array[
      'DANG_NHAP', 'DANG_XUAT', 'QUEN_MAT_KHAU', 'DOI_MAT_KHAU',
      'QUAN_LY_BAN_HANG', 'QUAN_LY_KHACH_HANG'
    ]
  ),
  (
    'NHAN_VIEN_KHO',
    'Nhân viên kho',
    array[
      'DANG_NHAP', 'DANG_XUAT', 'QUEN_MAT_KHAU', 'DOI_MAT_KHAU',
      'QUAN_LY_SACH', 'QUAN_LY_DANH_MUC_SACH', 'QUAN_LY_KHO', 'QUAN_LY_NHAP_HANG'
    ]
  )
on conflict (ma_vai_tro) do update
set ten_vai_tro = excluded.ten_vai_tro,
    danh_sach_quyen = excluded.danh_sach_quyen;

-- 2. NHÂN VIÊN ĐẠI DIỆN CHO CÁC ACTOR
insert into public.nhan_vien (ma_nv, ho_ten, so_dien_thoai, email, dia_chi, ngay_vao_lam)
values
  ('NV001', 'Trần Quản Trị',     '0901000001', 'admin@bookstore.vn',   'Q.1, TP.HCM', '2024-01-10'),
  ('NV002', 'Lê Thị Quản Lý',    '0901000002', 'quanly@bookstore.vn',  'Q.3, TP.HCM', '2024-02-15'),
  ('NV003', 'Nguyễn Văn Bán Hàng','0901000003','banhang@bookstore.vn', 'Q.5, TP.HCM', '2024-05-20'),
  ('NV004', 'Phạm Minh Thủ Kho', '0901000004', 'thukho@bookstore.vn',  'Q.10, TP.HCM','2024-06-01')
on conflict (ma_nv) do update
set ho_ten = excluded.ho_ten,
    email = excluded.email;

-- 3. TÀI KHOẢN MẪU (Mật khẩu: 123456)
insert into public.tai_khoan (ten_dang_nhap, mat_khau_hash, email_khoi_phuc, trang_thai, ma_vai_tro, ma_nv)
values
  (
    'admin',
    'seed_salt_2026:c1f7ae0fcc0acc157bdd3c1a6a82acd46a15e4882b67d49311921217de791b675cd4ec3bb6bb8c3ba0eb9ca6410da1b7c2cb1ebf9744641ae09855996de2802e',
    'admin@bookstore.vn',
    true,
    'QUAN_TRI_VIEN',
    'NV001'
  ),
  (
    'quanly',
    'seed_salt_2026:c1f7ae0fcc0acc157bdd3c1a6a82acd46a15e4882b67d49311921217de791b675cd4ec3bb6bb8c3ba0eb9ca6410da1b7c2cb1ebf9744641ae09855996de2802e',
    'quanly@bookstore.vn',
    true,
    'QUAN_LY',
    'NV002'
  ),
  (
    'banhang',
    'seed_salt_2026:c1f7ae0fcc0acc157bdd3c1a6a82acd46a15e4882b67d49311921217de791b675cd4ec3bb6bb8c3ba0eb9ca6410da1b7c2cb1ebf9744641ae09855996de2802e',
    'banhang@bookstore.vn',
    true,
    'NHAN_VIEN_BAN_HANG',
    'NV003'
  ),
  (
    'thukho',
    'seed_salt_2026:c1f7ae0fcc0acc157bdd3c1a6a82acd46a15e4882b67d49311921217de791b675cd4ec3bb6bb8c3ba0eb9ca6410da1b7c2cb1ebf9744641ae09855996de2802e',
    'thukho@bookstore.vn',
    true,
    'NHAN_VIEN_KHO',
    'NV004'
  )
on conflict (ten_dang_nhap) do update
set ma_vai_tro = excluded.ma_vai_tro,
    trang_thai = excluded.trang_thai;

-- 4. DỮ LIỆU DANH MỤC SÁCH CƠ BẢN (Phục vụ API /api/books & /api/invoices)
insert into public.the_loai (ma_the_loai, ten_the_loai, mo_ta)
values
  ('TL01', 'Công nghệ thông tin', 'Sách lập trình, kiến trúc phần mềm, OOAD'),
  ('TL02', 'Kỹ năng sống', 'Sách phát triển bản thân, giao tiếp'),
  ('TL03', 'Lịch sử - Xã hội', 'Sách lịch sử nhân loại, xã hội học')
on conflict (ma_the_loai) do nothing;

insert into public.nha_xuat_ban (ma_nxb, ten_nxb, dia_chi, so_dien_thoai)
values
  ('NXB01', 'NXB Tri Thức', 'Hà Nội', '02439447279'),
  ('NXB02', 'NXB Tổng hợp TP.HCM', 'TP. Hồ Chí Minh', '02838225340')
on conflict (ma_nxb) do nothing;

insert into public.sach (ma_sach, ten_sach, nam_xuat_ban, gia_nhap, gia_ban, so_luong_ton, muc_ton_toi_thieu, trang_thai, ma_the_loai, ma_nxb)
values
  ('S001', 'Clean Code: Mã nguồn sạch', 2020, 210000, 320000, 25, 5, 'CON_HANG', 'TL01', 'NXB01'),
  ('S002', 'Design Patterns (GoF)', 2019, 300000, 450000, 15, 5, 'CON_HANG', 'TL01', 'NXB01'),
  ('S003', 'Sapiens: Lược Sử Loài Người', 2021, 140000, 210000, 40, 5, 'CON_HANG', 'TL03', 'NXB01'),
  ('S004', 'Đắc Nhân Tâm', 2022, 80000, 120000, 50, 10, 'CON_HANG', 'TL02', 'NXB02')
on conflict (ma_sach) do nothing;
