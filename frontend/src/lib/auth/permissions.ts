/**
 * Định nghĩa Actor & Quyền hạn (Use Case Permissions)
 * Khớp 100% với docs/diagrams/Sơ đồ usecase/usecase Tổng quát.drawio
 */

export const ACTOR_CODES = {
  NGUOI_DUNG_HE_THONG: 'NGUOI_DUNG_HE_THONG',
  QUAN_LY: 'QUAN_LY',
  NHAN_VIEN_BAN_HANG: 'NHAN_VIEN_BAN_HANG',
  NHAN_VIEN_KHO: 'NHAN_VIEN_KHO',
} as const;

export type ActorCode = (typeof ACTOR_CODES)[keyof typeof ACTOR_CODES];

export const PERMISSIONS = {
  // Actor cha: Người dùng hệ thống
  DANG_NHAP: 'DANG_NHAP',
  DANG_XUAT: 'DANG_XUAT',
  QUEN_MAT_KHAU: 'QUEN_MAT_KHAU',
  DOI_MAT_KHAU: 'DOI_MAT_KHAU',

  // Quản lý
  QUAN_LY_NHAN_VIEN: 'QUAN_LY_NHAN_VIEN',
  QUAN_LY_KHUYEN_MAI: 'QUAN_LY_KHUYEN_MAI',
  QUAN_LY_NHA_CUNG_CAP: 'QUAN_LY_NHA_CUNG_CAP',
  THONG_KE_BAO_CAO: 'THONG_KE_BAO_CAO',

  // Nhân viên bán hàng (+ Quản lý)
  QUAN_LY_BAN_HANG: 'QUAN_LY_BAN_HANG',
  QUAN_LY_KHACH_HANG: 'QUAN_LY_KHACH_HANG',

  // Nhân viên kho (+ Quản lý)
  QUAN_LY_SACH: 'QUAN_LY_SACH',
  QUAN_LY_DANH_MUC_SACH: 'QUAN_LY_DANH_MUC_SACH',
  QUAN_LY_KHO: 'QUAN_LY_KHO',
  QUAN_LY_NHAP_HANG: 'QUAN_LY_NHAP_HANG',
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const BASE_USER_PERMISSIONS: ReadonlyArray<PermissionCode> = [
  PERMISSIONS.DANG_NHAP,
  PERMISSIONS.DANG_XUAT,
  PERMISSIONS.QUEN_MAT_KHAU,
  PERMISSIONS.DOI_MAT_KHAU,
];

export const ACTOR_METADATA: Record<
  ActorCode,
  {
    tenVaiTro: string;
    moTa: string;
    keThua: ActorCode | null;
    defaultPermissions: PermissionCode[];
  }
> = {
  NGUOI_DUNG_HE_THONG: {
    tenVaiTro: 'Người dùng hệ thống',
    moTa: 'Actor tổng quát (cha) — quyền đăng nhập, đăng xuất, quên mật khẩu, đổi mật khẩu.',
    keThua: null,
    defaultPermissions: [...BASE_USER_PERMISSIONS],
  },
  QUAN_LY: {
    tenVaiTro: 'Quản lý',
    moTa: 'Điều hành bán hàng, kho, nhập hàng, nhà cung cấp, khuyến mãi, nhân viên và thống kê báo cáo.',
    keThua: 'NGUOI_DUNG_HE_THONG',
    defaultPermissions: [
      ...BASE_USER_PERMISSIONS,
      PERMISSIONS.QUAN_LY_BAN_HANG,
      PERMISSIONS.QUAN_LY_KHO,
      PERMISSIONS.QUAN_LY_NHAP_HANG,
      PERMISSIONS.QUAN_LY_NHA_CUNG_CAP,
      PERMISSIONS.QUAN_LY_KHUYEN_MAI,
      PERMISSIONS.QUAN_LY_NHAN_VIEN,
      PERMISSIONS.THONG_KE_BAO_CAO,
    ],
  },
  NHAN_VIEN_BAN_HANG: {
    tenVaiTro: 'Nhân viên bán hàng',
    moTa: 'Quản lý bán hàng tại quầy POS (lập hóa đơn, đổi trả) và quản lý khách hàng.',
    keThua: 'NGUOI_DUNG_HE_THONG',
    defaultPermissions: [
      ...BASE_USER_PERMISSIONS,
      PERMISSIONS.QUAN_LY_BAN_HANG,
      PERMISSIONS.QUAN_LY_KHACH_HANG,
    ],
  },
  NHAN_VIEN_KHO: {
    tenVaiTro: 'Nhân viên kho',
    moTa: 'Quản lý sách, danh mục sách, tồn kho, kiểm kê kho và nhập hàng từ nhà cung cấp.',
    keThua: 'NGUOI_DUNG_HE_THONG',
    defaultPermissions: [
      ...BASE_USER_PERMISSIONS,
      PERMISSIONS.QUAN_LY_SACH,
      PERMISSIONS.QUAN_LY_DANH_MUC_SACH,
      PERMISSIONS.QUAN_LY_KHO,
      PERMISSIONS.QUAN_LY_NHAP_HANG,
    ],
  },
};

export const ALL_PERMISSIONS_LIST: ReadonlyArray<{
  code: PermissionCode;
  label: string;
  group: string;
}> = [
  { code: PERMISSIONS.DANG_NHAP, label: 'Đăng nhập', group: 'Người dùng hệ thống' },
  { code: PERMISSIONS.DANG_XUAT, label: 'Đăng xuất', group: 'Người dùng hệ thống' },
  { code: PERMISSIONS.QUEN_MAT_KHAU, label: 'Quên mật khẩu', group: 'Người dùng hệ thống' },
  { code: PERMISSIONS.DOI_MAT_KHAU, label: 'Đổi mật khẩu', group: 'Người dùng hệ thống' },
  { code: PERMISSIONS.QUAN_LY_BAN_HANG, label: 'Quản lý bán hàng', group: 'Bán hàng & Khách hàng' },
  { code: PERMISSIONS.QUAN_LY_KHACH_HANG, label: 'Quản lý khách hàng', group: 'Bán hàng & Khách hàng' },
  { code: PERMISSIONS.QUAN_LY_SACH, label: 'Quản lý sách', group: 'Sách & Kho' },
  { code: PERMISSIONS.QUAN_LY_DANH_MUC_SACH, label: 'Quản lý danh mục sách', group: 'Sách & Kho' },
  { code: PERMISSIONS.QUAN_LY_KHO, label: 'Quản lý kho', group: 'Sách & Kho' },
  { code: PERMISSIONS.QUAN_LY_NHAP_HANG, label: 'Quản lý nhập hàng', group: 'Sách & Kho' },
  { code: PERMISSIONS.QUAN_LY_NHA_CUNG_CAP, label: 'Quản lý nhà cung cấp', group: 'Quản lý điều hành' },
  { code: PERMISSIONS.QUAN_LY_KHUYEN_MAI, label: 'Quản lý khuyến mãi', group: 'Quản lý điều hành' },
  { code: PERMISSIONS.QUAN_LY_NHAN_VIEN, label: 'Quản lý nhân viên', group: 'Quản lý điều hành' },
  { code: PERMISSIONS.THONG_KE_BAO_CAO, label: 'Thống kê - Báo cáo', group: 'Quản lý điều hành' },
];
