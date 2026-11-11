import { BaseEntity } from './BaseEntity';
import { NhaCungCap } from './NhaCungCap';
import { PhieuNhap } from './PhieuNhap';
import { NhanVien } from './NhanVien';

export interface PhieuThanhToanNCCProps {
  maThanhToanNCC: string;
  ngayThanhToan?: Date | string;
  soTienThanhToan: number;
  phuongThuc: string;
  ghiChu?: string;
  nhaCungCap?: NhaCungCap | null;
  phieuNhap?: PhieuNhap | null;
  nhanVien?: NhanVien | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp PhieuThanhToanNCC theo Class Diagram
 * -maThanhToanNCC: String
 * -ngayThanhToan: DateTime
 * -soTienThanhToan: Double
 * -phuongThuc: String
 * -ghiChu: String
 * +ghiNhanThanhToanNCC(): void
 */
export class PhieuThanhToanNCC extends BaseEntity {
  private _maThanhToanNCC: string;
  private _ngayThanhToan: Date;
  private _soTienThanhToan: number;
  private _phuongThuc: string;
  private _ghiChu: string;
  private _nhaCungCap: NhaCungCap | null;
  private _phieuNhap: PhieuNhap | null;
  private _nhanVien: NhanVien | null;

  constructor(props: PhieuThanhToanNCCProps) {
    super(props.maThanhToanNCC, props.createdAt, props.updatedAt);
    if (!props.maThanhToanNCC.trim()) {
      throw new Error('Mã phiếu thanh toán NCC không được để trống.');
    }
    if (props.soTienThanhToan <= 0) {
      throw new Error('Số tiền thanh toán phải lớn hơn 0.');
    }
    this._maThanhToanNCC = props.maThanhToanNCC.trim();
    this._ngayThanhToan = props.ngayThanhToan ? new Date(props.ngayThanhToan) : new Date();
    this._soTienThanhToan = props.soTienThanhToan;
    this._phuongThuc = props.phuongThuc.trim();
    this._ghiChu = props.ghiChu?.trim() || '';
    this._nhaCungCap = props.nhaCungCap ?? null;
    this._phieuNhap = props.phieuNhap ?? null;
    this._nhanVien = props.nhanVien ?? null;
  }

  public get maThanhToanNCC(): string {
    return this._maThanhToanNCC;
  }

  public get ngayThanhToan(): Date {
    return this._ngayThanhToan;
  }

  public get soTienThanhToan(): number {
    return this._soTienThanhToan;
  }

  public get phuongThuc(): string {
    return this._phuongThuc;
  }

  public get ghiChu(): string {
    return this._ghiChu;
  }

  public get nhaCungCap(): NhaCungCap | null {
    return this._nhaCungCap;
  }

  public get phieuNhap(): PhieuNhap | null {
    return this._phieuNhap;
  }

  public get nhanVien(): NhanVien | null {
    return this._nhanVien;
  }

  public ghiNhanThanhToanNCC(): void {
    if (this._phieuNhap) {
      this._phieuNhap.ghiNhanThanhToan(this._soTienThanhToan);
    }
    if (this._nhaCungCap) {
      this._nhaCungCap.capNhatCongNo(-this._soTienThanhToan);
    }
    this.touch();
  }
}
