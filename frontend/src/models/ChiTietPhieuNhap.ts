import { Sach } from './Sach';

export interface ChiTietPhieuNhapProps {
  sach: Sach;
  soLuongNhap: number;
  donGiaNhap: number;
}

/**
 * Lớp ChiTietPhieuNhap theo Class Diagram
 * -soLuongNhap: int
 * -donGiaNhap: Double
 * -thanhTien: Double
 * +tinhThanhTien(): Double
 */
export class ChiTietPhieuNhap {
  private _sach: Sach;
  private _soLuongNhap: number;
  private _donGiaNhap: number;
  private _thanhTien: number;

  constructor(props: ChiTietPhieuNhapProps) {
    if (props.soLuongNhap <= 0) {
      throw new Error('Số lượng nhập phải lớn hơn 0.');
    }
    if (props.donGiaNhap < 0) {
      throw new Error('Đơn giá nhập không được âm.');
    }
    this._sach = props.sach;
    this._soLuongNhap = props.soLuongNhap;
    this._donGiaNhap = props.donGiaNhap;
    this._thanhTien = this.tinhThanhTien();
  }

  public get sach(): Sach {
    return this._sach;
  }

  public get soLuongNhap(): number {
    return this._soLuongNhap;
  }

  public set soLuongNhap(value: number) {
    if (value <= 0) throw new Error('Số lượng nhập phải lớn hơn 0.');
    this._soLuongNhap = value;
    this._thanhTien = this.tinhThanhTien();
  }

  public get donGiaNhap(): number {
    return this._donGiaNhap;
  }

  public set donGiaNhap(value: number) {
    if (value < 0) throw new Error('Đơn giá nhập không được âm.');
    this._donGiaNhap = value;
    this._thanhTien = this.tinhThanhTien();
  }

  public get thanhTien(): number {
    return this._thanhTien;
  }

  public tinhThanhTien(): number {
    this._thanhTien = this._soLuongNhap * this._donGiaNhap;
    return this._thanhTien;
  }
}
