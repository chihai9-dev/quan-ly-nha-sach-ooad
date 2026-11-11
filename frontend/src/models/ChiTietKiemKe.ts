import { Sach } from './Sach';

export interface ChiTietKiemKeProps {
  sach: Sach;
  soLuongHeThong: number;
  soLuongThucTe: number;
  lyDo?: string;
}

/**
 * Lớp ChiTietKiemKe theo Class Diagram
 * -soLuongHeThong: int
 * -soLuongThucTe: int
 * -chenhLech: int
 * -lyDo: String
 * +tinhChenhLech(): int
 */
export class ChiTietKiemKe {
  private _sach: Sach;
  private _soLuongHeThong: number;
  private _soLuongThucTe: number;
  private _chenhLech: number;
  private _lyDo: string;

  constructor(props: ChiTietKiemKeProps) {
    if (props.soLuongHeThong < 0 || props.soLuongThucTe < 0) {
      throw new Error('Số lượng kiểm kê không được âm.');
    }
    this._sach = props.sach;
    this._soLuongHeThong = props.soLuongHeThong;
    this._soLuongThucTe = props.soLuongThucTe;
    this._chenhLech = this.tinhChenhLech();
    this._lyDo = props.lyDo?.trim() || '';
  }

  public get sach(): Sach {
    return this._sach;
  }

  public get soLuongHeThong(): number {
    return this._soLuongHeThong;
  }

  public get soLuongThucTe(): number {
    return this._soLuongThucTe;
  }

  public set soLuongThucTe(value: number) {
    if (value < 0) throw new Error('Số lượng thực tế không được âm.');
    this._soLuongThucTe = value;
    this._chenhLech = this.tinhChenhLech();
  }

  public get chenhLech(): number {
    return this._chenhLech;
  }

  public get lyDo(): string {
    return this._lyDo;
  }

  public set lyDo(value: string) {
    this._lyDo = value.trim();
  }

  public tinhChenhLech(): number {
    this._chenhLech = this._soLuongThucTe - this._soLuongHeThong;
    return this._chenhLech;
  }
}
