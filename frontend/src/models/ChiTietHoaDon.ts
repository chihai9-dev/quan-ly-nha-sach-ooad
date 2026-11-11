import { Sach } from './Sach';

export interface ChiTietHoaDonProps {
  sach: Sach;
  soLuongBan: number;
  donGiaBan?: number;
  giamGia?: number;
}

/**
 * Lớp ChiTietHoaDon theo Class Diagram
 * -soLuongBan: int
 * -donGiaBan: Double
 * -giamGia: Double
 * -thanhTien: Double
 * +tinhThanhTien(): Double
 */
export class ChiTietHoaDon {
  private _sach: Sach;
  private _soLuongBan: number;
  private _donGiaBan: number;
  private _giamGia: number;
  private _thanhTien: number;

  constructor(props: ChiTietHoaDonProps) {
    if (props.soLuongBan <= 0) {
      throw new Error('Số lượng bán phải lớn hơn 0.');
    }
    const donGia = props.donGiaBan ?? props.sach.giaBan;
    const giamGia = props.giamGia ?? 0;
    if (donGia < 0 || giamGia < 0) {
      throw new Error('Đơn giá bán và giảm giá không được âm.');
    }
    this._sach = props.sach;
    this._soLuongBan = props.soLuongBan;
    this._donGiaBan = donGia;
    this._giamGia = giamGia;
    this._thanhTien = this.tinhThanhTien();
  }

  public get sach(): Sach {
    return this._sach;
  }

  public get soLuongBan(): number {
    return this._soLuongBan;
  }

  public set soLuongBan(value: number) {
    if (value <= 0) throw new Error('Số lượng bán phải lớn hơn 0.');
    this._soLuongBan = value;
    this._thanhTien = this.tinhThanhTien();
  }

  public get donGiaBan(): number {
    return this._donGiaBan;
  }

  public set donGiaBan(value: number) {
    if (value < 0) throw new Error('Đơn giá bán không được âm.');
    this._donGiaBan = value;
    this._thanhTien = this.tinhThanhTien();
  }

  public get giamGia(): number {
    return this._giamGia;
  }

  public set giamGia(value: number) {
    if (value < 0) throw new Error('Giảm giá không được âm.');
    this._giamGia = value;
    this._thanhTien = this.tinhThanhTien();
  }

  public get thanhTien(): number {
    return this._thanhTien;
  }

  public tinhThanhTien(): number {
    this._thanhTien = Math.max(0, this._soLuongBan * this._donGiaBan - this._giamGia);
    return this._thanhTien;
  }
}
