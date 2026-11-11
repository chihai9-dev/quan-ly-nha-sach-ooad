import { Sach } from './Sach';

export interface ChiTietDoiTraProps {
  sach: Sach;
  soLuongTra: number;
  tinhTrangSach: string;
  donGiaHoan: number;
}

/**
 * Lớp ChiTietDoiTra theo Class Diagram
 * -soLuongTra: int
 * -tinhTrangSach: String
 * -donGiaHoan: Double
 */
export class ChiTietDoiTra {
  private _sach: Sach;
  private _soLuongTra: number;
  private _tinhTrangSach: string;
  private _donGiaHoan: number;

  constructor(props: ChiTietDoiTraProps) {
    if (props.soLuongTra <= 0) {
      throw new Error('Số lượng trả phải lớn hơn 0.');
    }
    if (props.donGiaHoan < 0) {
      throw new Error('Đơn giá hoàn không được âm.');
    }
    this._sach = props.sach;
    this._soLuongTra = props.soLuongTra;
    this._tinhTrangSach = props.tinhTrangSach.trim();
    this._donGiaHoan = props.donGiaHoan;
  }

  public get sach(): Sach {
    return this._sach;
  }

  public get soLuongTra(): number {
    return this._soLuongTra;
  }

  public set soLuongTra(value: number) {
    if (value <= 0) throw new Error('Số lượng trả phải lớn hơn 0.');
    this._soLuongTra = value;
  }

  public get tinhTrangSach(): string {
    return this._tinhTrangSach;
  }

  public set tinhTrangSach(value: string) {
    this._tinhTrangSach = value.trim();
  }

  public get donGiaHoan(): number {
    return this._donGiaHoan;
  }

  public set donGiaHoan(value: number) {
    if (value < 0) throw new Error('Đơn giá hoàn không được âm.');
    this._donGiaHoan = value;
  }

  public tinhTienHoan(): number {
    return this._soLuongTra * this._donGiaHoan;
  }
}
