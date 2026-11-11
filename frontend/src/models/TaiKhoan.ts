import { BaseEntity } from './BaseEntity';
import { VaiTro } from './VaiTro';

export interface TaiKhoanProps {
  tenDangNhap: string;
  matKhauHash: string;
  emailKhoiPhuc: string;
  trangThai?: boolean;
  vaiTro?: VaiTro | null;
  maNV?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp TaiKhoan theo Class Diagram
 * -tenDangNhap: String
 * -matKhauHash: String
 * -emailKhoiPhuc: String
 * -trangThai: Boolean
 * +dangNhap(user: String, pass: String): Boolean
 * +dangXuat(): void
 * +quenMatKhau(email: String): Boolean
 * +doiMatKhau(matKhauMoi: String): Boolean
 */
export class TaiKhoan extends BaseEntity {
  private _tenDangNhap: string;
  private _matKhauHash: string;
  private _emailKhoiPhuc: string;
  private _trangThai: boolean;
  private _vaiTro: VaiTro | null;
  private _maNV: string | null;
  private _dangPhienHoatDong: boolean;

  constructor(props: TaiKhoanProps) {
    super(props.tenDangNhap, props.createdAt, props.updatedAt);
    if (!props.tenDangNhap.trim()) {
      throw new Error('Tên đăng nhập không được để trống.');
    }
    if (!props.matKhauHash.trim()) {
      throw new Error('Mật khẩu hash không được để trống.');
    }
    this._tenDangNhap = props.tenDangNhap.trim();
    this._matKhauHash = props.matKhauHash;
    this._emailKhoiPhuc = props.emailKhoiPhuc.trim();
    this._trangThai = props.trangThai ?? true;
    this._vaiTro = props.vaiTro ?? null;
    this._maNV = props.maNV ?? null;
    this._dangPhienHoatDong = false;
  }

  public get tenDangNhap(): string {
    return this._tenDangNhap;
  }

  public get matKhauHash(): string {
    return this._matKhauHash;
  }

  public get emailKhoiPhuc(): string {
    return this._emailKhoiPhuc;
  }

  public set emailKhoiPhuc(value: string) {
    this._emailKhoiPhuc = value.trim();
    this.touch();
  }

  public get trangThai(): boolean {
    return this._trangThai;
  }

  public set trangThai(value: boolean) {
    this._trangThai = value;
    this.touch();
  }

  public get vaiTro(): VaiTro | null {
    return this._vaiTro;
  }

  public set vaiTro(vaiTro: VaiTro | null) {
    this._vaiTro = vaiTro;
    this.touch();
  }

  public get maNV(): string | null {
    return this._maNV;
  }

  public dangNhap(user: string, pass: string): boolean {
    if (!this._trangThai) {
      return false;
    }
    const hopLe = this._tenDangNhap === user.trim() && this._matKhauHash === pass;
    if (hopLe) {
      this._dangPhienHoatDong = true;
    }
    return hopLe;
  }

  public dangXuat(): void {
    this._dangPhienHoatDong = false;
  }

  public quenMatKhau(email: string): boolean {
    return (
      this._trangThai &&
      this._emailKhoiPhuc.toLowerCase() === email.trim().toLowerCase()
    );
  }

  public doiMatKhau(matKhauMoi: string): boolean {
    if (!matKhauMoi || matKhauMoi.trim().length < 6) {
      return false;
    }
    this._matKhauHash = matKhauMoi;
    this.touch();
    return true;
  }
}
