import { BaseEntity } from './BaseEntity';

export interface ThanhToanProps {
  maThanhToan: string;
  ngayThanhToan?: Date | string;
  soTien: number;
  phuongThuc: string;
  trangThai?: string;
  maHoaDon?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp ThanhToan theo Class Diagram
 * -maThanhToan: String
 * -ngayThanhToan: DateTime
 * -soTien: Double
 * -phuongThuc: String
 * -trangThai: String
 * +ghiNhanThanhToan(): void
 */
export class ThanhToan extends BaseEntity {
  private _maThanhToan: string;
  private _ngayThanhToan: Date;
  private _soTien: number;
  private _phuongThuc: string;
  private _trangThai: string;
  private _maHoaDon: string;

  constructor(props: ThanhToanProps) {
    super(props.maThanhToan, props.createdAt, props.updatedAt);
    if (!props.maThanhToan.trim()) {
      throw new Error('Mã thanh toán không được để trống.');
    }
    if (props.soTien <= 0) {
      throw new Error('Số tiền thanh toán phải lớn hơn 0.');
    }
    this._maThanhToan = props.maThanhToan.trim();
    this._ngayThanhToan = props.ngayThanhToan ? new Date(props.ngayThanhToan) : new Date();
    this._soTien = props.soTien;
    this._phuongThuc = props.phuongThuc.trim();
    this._trangThai = props.trangThai ?? 'THANH_CONG';
    this._maHoaDon = props.maHoaDon ?? '';
  }

  public get maThanhToan(): string {
    return this._maThanhToan;
  }

  public get ngayThanhToan(): Date {
    return this._ngayThanhToan;
  }

  public get soTien(): number {
    return this._soTien;
  }

  public get phuongThuc(): string {
    return this._phuongThuc;
  }

  public get trangThai(): string {
    return this._trangThai;
  }

  public set trangThai(value: string) {
    this._trangThai = value.trim();
    this.touch();
  }

  public get maHoaDon(): string {
    return this._maHoaDon;
  }

  public ghiNhanThanhToan(): void {
    this._trangThai = 'THANH_CONG';
    this._ngayThanhToan = new Date();
    this.touch();
  }
}
