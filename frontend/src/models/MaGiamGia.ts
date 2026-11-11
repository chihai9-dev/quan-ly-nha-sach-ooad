import { BaseEntity } from './BaseEntity';
import { ChuongTrinhKhuyenMai } from './ChuongTrinhKhuyenMai';

export interface MaGiamGiaProps {
  maCode: string;
  giaTriGiam: number;
  donToiThieu?: number;
  soLuongConLai: number;
  hanSuDung: Date | string;
  chuongTrinhKhuyenMai?: ChuongTrinhKhuyenMai | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp MaGiamGia theo Class Diagram
 * -maCode: String
 * -giaTriGiam: Double
 * -donToiThieu: Double
 * -soLuongConLai: int
 * -hanSuDung: Date
 * +quanLyMaGiamGia(): void
 * +kiemTraHopLe(tongDon: Double): Boolean
 */
export class MaGiamGia extends BaseEntity {
  private _maCode: string;
  private _giaTriGiam: number;
  private _donToiThieu: number;
  private _soLuongConLai: number;
  private _hanSuDung: Date;
  private _chuongTrinhKhuyenMai: ChuongTrinhKhuyenMai | null;

  constructor(props: MaGiamGiaProps) {
    super(props.maCode, props.createdAt, props.updatedAt);
    if (props.giaTriGiam <= 0) {
      throw new Error('Giá trị giảm phải lớn hơn 0.');
    }
    if (props.soLuongConLai < 0) {
      throw new Error('Số lượng còn lại không được âm.');
    }
    this._maCode = props.maCode.trim().toUpperCase();
    this._giaTriGiam = props.giaTriGiam;
    this._donToiThieu = props.donToiThieu ?? 0;
    this._soLuongConLai = props.soLuongConLai;
    this._hanSuDung = new Date(props.hanSuDung);
    this._chuongTrinhKhuyenMai = props.chuongTrinhKhuyenMai ?? null;
  }

  public get maCode(): string {
    return this._maCode;
  }

  public get giaTriGiam(): number {
    return this._giaTriGiam;
  }

  public set giaTriGiam(value: number) {
    if (value <= 0) throw new Error('Giá trị giảm phải lớn hơn 0.');
    this._giaTriGiam = value;
    this.touch();
  }

  public get donToiThieu(): number {
    return this._donToiThieu;
  }

  public set donToiThieu(value: number) {
    if (value < 0) throw new Error('Đơn tối thiểu không được âm.');
    this._donToiThieu = value;
    this.touch();
  }

  public get soLuongConLai(): number {
    return this._soLuongConLai;
  }

  public set soLuongConLai(value: number) {
    if (value < 0) throw new Error('Số lượng còn lại không được âm.');
    this._soLuongConLai = value;
    this.touch();
  }

  public get hanSuDung(): Date {
    return this._hanSuDung;
  }

  public get chuongTrinhKhuyenMai(): ChuongTrinhKhuyenMai | null {
    return this._chuongTrinhKhuyenMai;
  }

  public quanLyMaGiamGia(thongTin?: Partial<Omit<MaGiamGiaProps, 'maCode'>>): void {
    if (thongTin?.giaTriGiam !== undefined) this.giaTriGiam = thongTin.giaTriGiam;
    if (thongTin?.donToiThieu !== undefined) this.donToiThieu = thongTin.donToiThieu;
    if (thongTin?.soLuongConLai !== undefined) this.soLuongConLai = thongTin.soLuongConLai;
    if (thongTin?.hanSuDung !== undefined) this._hanSuDung = new Date(thongTin.hanSuDung);
    this.touch();
  }

  public kiemTraHopLe(tongDon: number, thoiDiem: Date = new Date()): boolean {
    if (this._soLuongConLai <= 0) return false;
    if (tongDon < this._donToiThieu) return false;
    if (thoiDiem > this._hanSuDung) return false;
    return true;
  }

  public suDungMa(): void {
    if (this._soLuongConLai <= 0) {
      throw new Error('Mã giảm giá đã hết lượt sử dụng.');
    }
    this._soLuongConLai -= 1;
    this.touch();
  }
}
