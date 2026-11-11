-- =============================================================================
-- HỆ THỐNG QUẢN LÝ NHÀ SÁCH — SUPABASE / POSTGRESQL SCHEMA
-- Nguồn thiết kế: docs/diagrams/Class diagram.drawio (21 lớp thực thể, 27 quan hệ)
-- Giữ nguyên tên lớp và thuộc tính từ Class Diagram (chuyển sang snake_case cho SQL)
-- =============================================================================

create extension if not exists pgcrypto;

-- =============================================================================
-- 1. VAI TRÒ, NHÂN VIÊN, TÀI KHOẢN (VaiTro, NhanVien, TaiKhoan)
-- =============================================================================

-- Lớp: VaiTro
create table if not exists public.vai_tro (
  ma_vai_tro       varchar(50) primary key check (length(trim(ma_vai_tro)) > 0),
  ten_vai_tro      varchar(100) not null check (length(trim(ten_vai_tro)) > 0),
  danh_sach_quyen  text[] not null default '{}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Lớp: NhanVien
create table if not exists public.nhan_vien (
  ma_nv          varchar(50) primary key check (length(trim(ma_nv)) > 0),
  ho_ten         varchar(150) not null check (length(trim(ho_ten)) > 0),
  so_dien_thoai  varchar(20),
  email          varchar(150) check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  dia_chi        text,
  ngay_vao_lam   date not null default current_date,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Lớp: TaiKhoan
-- Quan hệ:
--   VaiTro (1) --- co ---> (0..*) TaiKhoan
--   NhanVien (1) --- so huu ---> (0..1) TaiKhoan (1-1: ma_nv UNIQUE)
create table if not exists public.tai_khoan (
  ten_dang_nhap    varchar(100) primary key check (length(trim(ten_dang_nhap)) >= 3),
  mat_khau_hash    text not null,
  email_khoi_phuc  varchar(150) check (email_khoi_phuc is null or email_khoi_phuc ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  trang_thai       boolean not null default true,
  ma_vai_tro       varchar(50) not null references public.vai_tro(ma_vai_tro) on delete restrict,
  ma_nv            varchar(50) not null unique references public.nhan_vien(ma_nv) on delete cascade,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- =============================================================================
-- 2. DANH MỤC SÁCH & KHUYẾN MÃI (TheLoai, TacGia, NhaXuatBan, ChuongTrinhKhuyenMai, Sach)
-- =============================================================================

-- Lớp: TheLoai
create table if not exists public.the_loai (
  ma_the_loai   varchar(50) primary key check (length(trim(ma_the_loai)) > 0),
  ten_the_loai  varchar(150) not null check (length(trim(ten_the_loai)) > 0),
  mo_ta         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Lớp: TacGia
create table if not exists public.tac_gia (
  ma_tac_gia   varchar(50) primary key check (length(trim(ma_tac_gia)) > 0),
  ten_tac_gia  varchar(150) not null check (length(trim(ten_tac_gia)) > 0),
  tieu_su      text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Lớp: NhaXuatBan
create table if not exists public.nha_xuat_ban (
  ma_nxb         varchar(50) primary key check (length(trim(ma_nxb)) > 0),
  ten_nxb        varchar(200) not null check (length(trim(ten_nxb)) > 0),
  dia_chi        text,
  so_dien_thoai  varchar(20),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Lớp: ChuongTrinhKhuyenMai
create table if not exists public.chuong_trinh_khuyen_mai (
  ma_ctkm         varchar(50) primary key check (length(trim(ma_ctkm)) > 0),
  ten_ctkm        varchar(200) not null check (length(trim(ten_ctkm)) > 0),
  ngay_bat_dau    date not null,
  ngay_ket_thuc   date not null,
  phan_tram_giam  numeric(5,2) not null default 0 check (phan_tram_giam between 0 and 100),
  trang_thai      boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint chk_ctkm_ngay check (ngay_ket_thuc >= ngay_bat_dau)
);

-- Lớp: Sach
-- Quan hệ:
--   TheLoai (1) --- phan loai ---> (0..*) Sach
--   NhaXuatBan (1) --- xuat ban ---> (0..*) Sach
--   ChuongTrinhKhuyenMai (0..1) --- ap dung ---> (0..*) Sach
create table if not exists public.sach (
  ma_sach             varchar(50) primary key check (length(trim(ma_sach)) > 0),
  ten_sach            varchar(255) not null check (length(trim(ten_sach)) > 0),
  nam_xuat_ban        integer check (nam_xuat_ban is null or nam_xuat_ban between 1000 and 9999),
  gia_nhap            numeric(14,2) not null default 0 check (gia_nhap >= 0),
  gia_ban             numeric(14,2) not null check (gia_ban >= 0),
  so_luong_ton        integer not null default 0 check (so_luong_ton >= 0),
  muc_ton_toi_thieu   integer not null default 5 check (muc_ton_toi_thieu >= 0),
  trang_thai          varchar(50) not null default 'CON_HANG',
  ma_the_loai         varchar(50) not null references public.the_loai(ma_the_loai) on delete restrict,
  ma_nxb              varchar(50) not null references public.nha_xuat_ban(ma_nxb) on delete restrict,
  ma_ctkm             varchar(50) references public.chuong_trinh_khuyen_mai(ma_ctkm) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Bảng trung gian N-N: TacGia (1..*) --- sang tac ---> (0..*) Sach
create table if not exists public.sach_tac_gia (
  ma_sach     varchar(50) not null references public.sach(ma_sach) on delete cascade,
  ma_tac_gia  varchar(50) not null references public.tac_gia(ma_tac_gia) on delete restrict,
  primary key (ma_sach, ma_tac_gia)
);

-- =============================================================================
-- 3. KIỂM KÊ KHO (PhieuKiemKe, ChiTietKiemKe)
-- =============================================================================

-- Lớp: PhieuKiemKe
-- Quan hệ: NhanVien (1) --- thuc hien ---> (0..*) PhieuKiemKe
create table if not exists public.phieu_kiem_ke (
  ma_kiem_ke    varchar(50) primary key check (length(trim(ma_kiem_ke)) > 0),
  ngay_kiem_ke  timestamptz not null default now(),
  ghi_chu       text,
  ma_nv         varchar(50) not null references public.nhan_vien(ma_nv) on delete restrict,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Lớp: ChiTietKiemKe
-- Quan hệ:
--   PhieuKiemKe (1) ◆--- bao gom ---> (1..*) ChiTietKiemKe (Composition)
--   Sach (1) --- duoc kiem ke ---> (0..*) ChiTietKiemKe
create table if not exists public.chi_tiet_kiem_ke (
  ma_kiem_ke         varchar(50) not null references public.phieu_kiem_ke(ma_kiem_ke) on delete cascade,
  ma_sach            varchar(50) not null references public.sach(ma_sach) on delete restrict,
  so_luong_he_thong  integer not null check (so_luong_he_thong >= 0),
  so_luong_thuc_te   integer not null check (so_luong_thuc_te >= 0),
  chenh_lech         integer generated always as (so_luong_thuc_te - so_luong_he_thong) stored,
  ly_do              text,
  primary key (ma_kiem_ke, ma_sach)
);

-- =============================================================================
-- 4. NHÀ CUNG CẤP & NHẬP HÀNG (NhaCungCap, PhieuNhap, ChiTietPhieuNhap, PhieuThanhToanNCC)
-- =============================================================================

-- Lớp: NhaCungCap
create table if not exists public.nha_cung_cap (
  ma_ncc         varchar(50) primary key check (length(trim(ma_ncc)) > 0),
  ten_ncc        varchar(200) not null check (length(trim(ten_ncc)) > 0),
  so_dien_thoai  varchar(20),
  email          varchar(150) check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  dia_chi        text,
  tong_cong_no   numeric(14,2) not null default 0 check (tong_cong_no >= 0),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Lớp: PhieuNhap
-- Quan hệ:
--   NhaCungCap (1) --- cung cap ---> (0..*) PhieuNhap
--   NhanVien (1) --- lap ---> (0..*) PhieuNhap
create table if not exists public.phieu_nhap (
  ma_phieu_nhap  varchar(50) primary key check (length(trim(ma_phieu_nhap)) > 0),
  ngay_nhap      timestamptz not null default now(),
  tong_tien      numeric(14,2) not null default 0 check (tong_tien >= 0),
  da_thanh_toan  numeric(14,2) not null default 0 check (da_thanh_toan >= 0),
  con_no         numeric(14,2) generated always as (greatest(tong_tien - da_thanh_toan, 0)) stored,
  trang_thai     varchar(50) not null default 'CHUA_THANH_TOAN',
  ma_ncc         varchar(50) not null references public.nha_cung_cap(ma_ncc) on delete restrict,
  ma_nv          varchar(50) not null references public.nhan_vien(ma_nv) on delete restrict,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint chk_phieu_nhap_thanh_toan check (da_thanh_toan <= tong_tien)
);

-- Lớp: ChiTietPhieuNhap
-- Quan hệ:
--   PhieuNhap (1) ◆--- bao gom ---> (1..*) ChiTietPhieuNhap (Composition)
--   Sach (1) --- nam trong ---> (0..*) ChiTietPhieuNhap
create table if not exists public.chi_tiet_phieu_nhap (
  ma_phieu_nhap  varchar(50) not null references public.phieu_nhap(ma_phieu_nhap) on delete cascade,
  ma_sach        varchar(50) not null references public.sach(ma_sach) on delete restrict,
  so_luong_nhap  integer not null check (so_luong_nhap > 0),
  don_gia_nhap   numeric(14,2) not null check (don_gia_nhap >= 0),
  thanh_tien     numeric(14,2) generated always as (so_luong_nhap * don_gia_nhap) stored,
  primary key (ma_phieu_nhap, ma_sach)
);

-- Lớp: PhieuThanhToanNCC
-- Quan hệ:
--   NhaCungCap (1) --- co ---> (0..*) PhieuThanhToanNCC
--   PhieuNhap (0..1) --- thanh toan cho ---> (0..*) PhieuThanhToanNCC
--   NhanVien (1) --- ghi nhan ---> (0..*) PhieuThanhToanNCC
create table if not exists public.phieu_thanh_toan_ncc (
  ma_thanh_toan_ncc  varchar(50) primary key check (length(trim(ma_thanh_toan_ncc)) > 0),
  ngay_thanh_toan    timestamptz not null default now(),
  so_tien_thanh_toan numeric(14,2) not null check (so_tien_thanh_toan > 0),
  phuong_thuc        varchar(50) not null,
  ghi_chu            text,
  ma_ncc             varchar(50) not null references public.nha_cung_cap(ma_ncc) on delete restrict,
  ma_phieu_nhap      varchar(50) references public.phieu_nhap(ma_phieu_nhap) on delete restrict,
  ma_nv              varchar(50) not null references public.nhan_vien(ma_nv) on delete restrict,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- =============================================================================
-- 5. KHÁCH HÀNG & MÃ GIẢM GIÁ (KhachHang, MaGiamGia)
-- =============================================================================

-- Lớp: KhachHang
create table if not exists public.khach_hang (
  ma_kh          varchar(50) primary key check (length(trim(ma_kh)) > 0),
  ho_ten         varchar(150) not null check (length(trim(ho_ten)) > 0),
  so_dien_thoai  varchar(20) unique,
  email          varchar(150) check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  diem_tich_luy  integer not null default 0 check (diem_tich_luy >= 0),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Lớp: MaGiamGia
-- Quan hệ: ChuongTrinhKhuyenMai (1) --- phat hanh ---> (0..*) MaGiamGia
create table if not exists public.ma_giam_gia (
  ma_code           varchar(50) primary key check (length(trim(ma_code)) > 0),
  gia_tri_giam      numeric(14,2) not null check (gia_tri_giam > 0),
  don_toi_thieu     numeric(14,2) not null default 0 check (don_toi_thieu >= 0),
  so_luong_con_lai  integer not null default 0 check (so_luong_con_lai >= 0),
  han_su_dung       date not null,
  ma_ctkm           varchar(50) not null references public.chuong_trinh_khuyen_mai(ma_ctkm) on delete cascade,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- =============================================================================
-- 6. HÓA ĐƠN & THANH TOÁN (HoaDon, ChiTietHoaDon, ThanhToan)
-- =============================================================================

-- Lớp: HoaDon
-- Quan hệ:
--   KhachHang (0..1) --- co ---> (0..*) HoaDon
--   NhanVien (1) --- lap ---> (0..*) HoaDon
--   MaGiamGia (0..1) --- giam gia ---> (0..*) HoaDon
create table if not exists public.hoa_don (
  ma_hoa_don       varchar(50) primary key check (length(trim(ma_hoa_don)) > 0),
  ngay_lap         timestamptz not null default now(),
  tong_tien_hang   numeric(14,2) not null default 0 check (tong_tien_hang >= 0),
  tien_giam_gia    numeric(14,2) not null default 0 check (tien_giam_gia >= 0),
  thanh_toan_cuoi  numeric(14,2) generated always as (greatest(tong_tien_hang - tien_giam_gia, 0)) stored,
  trang_thai       varchar(50) not null default 'DA_THANH_TOAN',
  ma_kh            varchar(50) references public.khach_hang(ma_kh) on delete set null,
  ma_nv            varchar(50) not null references public.nhan_vien(ma_nv) on delete restrict,
  ma_code          varchar(50) references public.ma_giam_gia(ma_code) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Lớp: ChiTietHoaDon
-- Quan hệ:
--   HoaDon (1) ◆--- bao gom ---> (1..*) ChiTietHoaDon (Composition)
--   Sach (1) --- duoc ban ---> (0..*) ChiTietHoaDon
create table if not exists public.chi_tiet_hoa_don (
  ma_hoa_don   varchar(50) not null references public.hoa_don(ma_hoa_don) on delete cascade,
  ma_sach      varchar(50) not null references public.sach(ma_sach) on delete restrict,
  so_luong_ban integer not null check (so_luong_ban > 0),
  don_gia_ban  numeric(14,2) not null check (don_gia_ban >= 0),
  giam_gia     numeric(14,2) not null default 0 check (giam_gia >= 0),
  thanh_tien   numeric(14,2) generated always as (greatest(so_luong_ban * don_gia_ban - giam_gia, 0)) stored,
  primary key (ma_hoa_don, ma_sach)
);

-- Lớp: ThanhToan
-- Quan hệ: HoaDon (1) --- co ---> (1..*) ThanhToan
create table if not exists public.thanh_toan (
  ma_thanh_toan    varchar(50) primary key check (length(trim(ma_thanh_toan)) > 0),
  ngay_thanh_toan  timestamptz not null default now(),
  so_tien          numeric(14,2) not null check (so_tien > 0),
  phuong_thuc      varchar(50) not null,
  trang_thai       varchar(50) not null default 'THANH_CONG',
  ma_hoa_don       varchar(50) not null references public.hoa_don(ma_hoa_don) on delete restrict,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- =============================================================================
-- 7. ĐỔI TRẢ HÀNG (PhieuDoiTra, ChiTietDoiTra)
-- =============================================================================

-- Lớp: PhieuDoiTra
-- Quan hệ:
--   HoaDon (1) --- phat sinh ---> (0..*) PhieuDoiTra
--   NhanVien (1) --- lap ---> (0..*) PhieuDoiTra
create table if not exists public.phieu_doi_tra (
  ma_doi_tra       varchar(50) primary key check (length(trim(ma_doi_tra)) > 0),
  ngay_doi_tra     timestamptz not null default now(),
  ly_do            text not null check (length(trim(ly_do)) > 0),
  hinh_thuc_xu_ly  varchar(50) not null,
  tien_hoan_tra    numeric(14,2) not null default 0 check (tien_hoan_tra >= 0),
  ma_hoa_don       varchar(50) not null references public.hoa_don(ma_hoa_don) on delete restrict,
  ma_nv            varchar(50) not null references public.nhan_vien(ma_nv) on delete restrict,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Lớp: ChiTietDoiTra
-- Quan hệ:
--   PhieuDoiTra (1) ◆--- bao gom ---> (1..*) ChiTietDoiTra (Composition)
--   Sach (1) --- duoc doi tra ---> (0..*) ChiTietDoiTra
create table if not exists public.chi_tiet_doi_tra (
  ma_doi_tra       varchar(50) not null references public.phieu_doi_tra(ma_doi_tra) on delete cascade,
  ma_sach          varchar(50) not null references public.sach(ma_sach) on delete restrict,
  so_luong_tra     integer not null check (so_luong_tra > 0),
  tinh_trang_sach  varchar(100) not null,
  don_gia_hoan     numeric(14,2) not null default 0 check (don_gia_hoan >= 0),
  primary key (ma_doi_tra, ma_sach)
);

-- =============================================================================
-- 8. TRIGGERS CẬP NHẬT TỒN KHO, TỔNG TIỀN & CÔNG NỢ
-- =============================================================================

-- 8.1 Hàm cập nhật số lượng tồn của Sach (chặn tồn kho âm)
create or replace function public.fn_cap_nhat_so_luong_ton(p_ma_sach varchar, p_so_luong_thay_doi integer)
returns void
language plpgsql
as $$
declare
  v_ten_sach text;
  v_ton_hien_tai integer;
begin
  if p_so_luong_thay_doi = 0 then
    return;
  end if;

  select ten_sach, so_luong_ton into v_ten_sach, v_ton_hien_tai
  from public.sach
  where ma_sach = p_ma_sach
  for update;

  if not found then
    raise exception 'Không tìm thấy sách mã %', p_ma_sach;
  end if;

  if v_ton_hien_tai + p_so_luong_thay_doi < 0 then
    raise exception 'Sách "%" không đủ tồn kho (hiện có: %, yêu cầu trừ: %)',
      v_ten_sach, v_ton_hien_tai, -p_so_luong_thay_doi;
  end if;

  update public.sach
  set so_luong_ton = so_luong_ton + p_so_luong_thay_doi,
      updated_at = now()
  where ma_sach = p_ma_sach;
end;
$$;

-- 8.2 Trigger ChiTietHoaDon -> trừ tồn kho & tính lại tong_tien_hang của HoaDon
create or replace function public.trg_chi_tiet_hoa_don_handler()
returns trigger
language plpgsql
as $$
declare
  v_ma_hd varchar(50) := coalesce(new.ma_hoa_don, old.ma_hoa_don);
begin
  if tg_op = 'INSERT' then
    perform public.fn_cap_nhat_so_luong_ton(new.ma_sach, -new.so_luong_ban);
  elsif tg_op = 'UPDATE' then
    if new.ma_sach = old.ma_sach then
      perform public.fn_cap_nhat_so_luong_ton(new.ma_sach, old.so_luong_ban - new.so_luong_ban);
    else
      perform public.fn_cap_nhat_so_luong_ton(old.ma_sach, old.so_luong_ban);
      perform public.fn_cap_nhat_so_luong_ton(new.ma_sach, -new.so_luong_ban);
    end if;
  elsif tg_op = 'DELETE' then
    perform public.fn_cap_nhat_so_luong_ton(old.ma_sach, old.so_luong_ban);
  end if;

  update public.hoa_don
  set tong_tien_hang = coalesce((
    select sum(thanh_tien) from public.chi_tiet_hoa_don where ma_hoa_don = v_ma_hd
  ), 0),
  updated_at = now()
  where ma_hoa_don = v_ma_hd;

  return null;
end;
$$;

drop trigger if exists trg_chi_tiet_hoa_don on public.chi_tiet_hoa_don;
create trigger trg_chi_tiet_hoa_don
  after insert or update or delete on public.chi_tiet_hoa_don
  for each row execute function public.trg_chi_tiet_hoa_don_handler();

-- 8.3 Trigger ChiTietPhieuNhap -> cộng tồn kho, tính tong_tien PhieuNhap & cập nhật công nợ NCC
create or replace function public.trg_chi_tiet_phieu_nhap_handler()
returns trigger
language plpgsql
as $$
declare
  v_ma_pn varchar(50) := coalesce(new.ma_phieu_nhap, old.ma_phieu_nhap);
  v_ma_ncc varchar(50);
begin
  if tg_op = 'INSERT' then
    perform public.fn_cap_nhat_so_luong_ton(new.ma_sach, new.so_luong_nhap);
  elsif tg_op = 'UPDATE' then
    if new.ma_sach = old.ma_sach then
      perform public.fn_cap_nhat_so_luong_ton(new.ma_sach, new.so_luong_nhap - old.so_luong_nhap);
    else
      perform public.fn_cap_nhat_so_luong_ton(old.ma_sach, -old.so_luong_nhap);
      perform public.fn_cap_nhat_so_luong_ton(new.ma_sach, new.so_luong_nhap);
    end if;
  elsif tg_op = 'DELETE' then
    perform public.fn_cap_nhat_so_luong_ton(old.ma_sach, -old.so_luong_nhap);
  end if;

  update public.phieu_nhap
  set tong_tien = coalesce((
    select sum(thanh_tien) from public.chi_tiet_phieu_nhap where ma_phieu_nhap = v_ma_pn
  ), 0),
  updated_at = now()
  where ma_phieu_nhap = v_ma_pn
  returning ma_ncc into v_ma_ncc;

  if v_ma_ncc is not null then
    update public.nha_cung_cap
    set tong_cong_no = coalesce((
      select sum(con_no) from public.phieu_nhap where ma_ncc = v_ma_ncc
    ), 0),
    updated_at = now()
    where ma_ncc = v_ma_ncc;
  end if;

  return null;
end;
$$;

drop trigger if exists trg_chi_tiet_phieu_nhap on public.chi_tiet_phieu_nhap;
create trigger trg_chi_tiet_phieu_nhap
  after insert or update or delete on public.chi_tiet_phieu_nhap
  for each row execute function public.trg_chi_tiet_phieu_nhap_handler();

-- 8.4 Trigger ChiTietKiemKe -> cân bằng kho theo so_luong_thuc_te
create or replace function public.trg_chi_tiet_kiem_ke_handler()
returns trigger
language plpgsql
as $$
begin
  perform public.fn_cap_nhat_so_luong_ton(new.ma_sach, new.so_luong_thuc_te - new.so_luong_he_thong);
  return null;
end;
$$;

drop trigger if exists trg_chi_tiet_kiem_ke on public.chi_tiet_kiem_ke;
create trigger trg_chi_tiet_kiem_ke
  after insert on public.chi_tiet_kiem_ke
  for each row execute function public.trg_chi_tiet_kiem_ke_handler();

-- 8.5 Trigger ChiTietDoiTra -> hoàn lại tồn kho khi đổi trả
create or replace function public.trg_chi_tiet_doi_tra_handler()
returns trigger
language plpgsql
as $$
begin
  perform public.fn_cap_nhat_so_luong_ton(new.ma_sach, new.so_luong_tra);
  return null;
end;
$$;

drop trigger if exists trg_chi_tiet_doi_tra on public.chi_tiet_doi_tra;
create trigger trg_chi_tiet_doi_tra
  after insert on public.chi_tiet_doi_tra
  for each row execute function public.trg_chi_tiet_doi_tra_handler();

-- 8.6 Trigger PhieuThanhToanNCC -> giảm công nợ NCC & cộng da_thanh_toan trên PhieuNhap
create or replace function public.trg_phieu_thanh_toan_ncc_handler()
returns trigger
language plpgsql
as $$
begin
  if new.ma_phieu_nhap is not null then
    update public.phieu_nhap
    set da_thanh_toan = da_thanh_toan + new.so_tien_thanh_toan,
        trang_thai = case
          when da_thanh_toan + new.so_tien_thanh_toan >= tong_tien then 'DA_THANH_TOAN'
          else 'THANH_TOAN_MOT_PHAN'
        end,
        updated_at = now()
    where ma_phieu_nhap = new.ma_phieu_nhap;
  end if;

  update public.nha_cung_cap
  set tong_cong_no = greatest(tong_cong_no - new.so_tien_thanh_toan, 0),
      updated_at = now()
  where ma_ncc = new.ma_ncc;

  return null;
end;
$$;

drop trigger if exists trg_phieu_thanh_toan_ncc on public.phieu_thanh_toan_ncc;
create trigger trg_phieu_thanh_toan_ncc
  after insert on public.phieu_thanh_toan_ncc
  for each row execute function public.trg_phieu_thanh_toan_ncc_handler();

-- =============================================================================
-- 9. INDEXES TỐI ƯU TRUY VẤN
-- =============================================================================
create index if not exists idx_tai_khoan_vai_tro       on public.tai_khoan(ma_vai_tro);
create index if not exists idx_sach_the_loai           on public.sach(ma_the_loai);
create index if not exists idx_sach_nxb                on public.sach(ma_nxb);
create index if not exists idx_sach_ctkm               on public.sach(ma_ctkm);
create index if not exists idx_phieu_kiem_ke_nv        on public.phieu_kiem_ke(ma_nv);
create index if not exists idx_phieu_nhap_ncc          on public.phieu_nhap(ma_ncc);
create index if not exists idx_phieu_nhap_nv           on public.phieu_nhap(ma_nv);
create index if not exists idx_tt_ncc_ncc              on public.phieu_thanh_toan_ncc(ma_ncc);
create index if not exists idx_tt_ncc_pn               on public.phieu_thanh_toan_ncc(ma_phieu_nhap);
create index if not exists idx_ma_giam_gia_ctkm        on public.ma_giam_gia(ma_ctkm);
create index if not exists idx_hoa_don_kh              on public.hoa_don(ma_kh);
create index if not exists idx_hoa_don_nv              on public.hoa_don(ma_nv);
create index if not exists idx_hoa_don_ma_code         on public.hoa_don(ma_code);
create index if not exists idx_thanh_toan_hoa_don      on public.thanh_toan(ma_hoa_don);
create index if not exists idx_phieu_doi_tra_hoa_don   on public.phieu_doi_tra(ma_hoa_don);
