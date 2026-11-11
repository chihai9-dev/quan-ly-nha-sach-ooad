import { BaseEntity } from './BaseEntity';

export interface ChuongTrinhKhuyenMaiProps {
  maCTKM: string;
  tenCTKM: string;
  ngayBatDau: Date | string;
  ngayKetThuc: Date | string;
  phanTramGiam: number;
  trangThai?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp ChuongTrinhKhuyenMai theo Class Diagram
 * -maCTKM: String
 * -tenCTKM: String
 * -ngayBatDau: Date
 * -ngayKetThuc: Date
 * -phanTramGiam: Double
 * -trangThai: Boolean
 * +thietLapChuongTrinhKM(): void
 */
export class ChuongTrinhKhuyenMai extends BaseEntity {
  private _maCTKM: string;
  private _tenCTKM: string;
  private _ngayBatDau: Date;
  private _ngayKetThuc: Date;
  private _phanTramGiam: number;
  private _trangThai: boolean;

  constructor(props: ChuongTrinhKhuyenMaiProps) {
    super(props.maCTKM, props.createdAt, props.updatedAt);
    if (props.phanTramGiam < 0 || props.phanTramGiam > 100) {
      throw new Error('Phần trăm giảm phải nằm trong khoảng 0 đến 100.');
    }
    const start = new Date(props.ngayBatDau);
    const end = new Date(props.ngayKetThuc);
    if (end < start) {
      throw new Error('Ngày kết thúc không được nhỏ hơn ngày bắt đầu.');
    }
    this._maCTKM = props.maCTKM.trim();
    this._tenCTKM = props.tenCTKM.trim();
    this._ngayBatDau = start;
    this._ngayKetThuc = end;
    this._phanTramGiam = props.phanTramGiam;
    this._trangThai = props.trangThai ?? true;
  }

  public get maCTKM(): string {
    return this._maCTKM;
  }

  public get tenCTKM(): string {
    return this._tenCTKM;
  }

  public set tenCTKM(value: string) {
    this._tenCTKM = value.trim();
    this.touch();
  }

  public get ngayBatDau(): Date {
    return this._ngayBatDau;
  }

  public get ngayKetThuc(): Date {
    return this._ngayKetThuc;
  }

  public get phanTramGiam(): number {
    return this._phanTramGiam;
  }

  public set phanTramGiam(value: number) {
    if (value < 0 || value > 100) {
      throw new Error('Phần trăm giảm phải từ 0 đến 100.');
    }
    this._phanTramGiam = value;
    this.touch();
  }

  public get trangThai(): boolean {
    return this._trangThai;
  }

  public set trangThai(value: boolean) {
    this._trangThai = value;
    this.touch();
  }

  public thietLapChuongTrinhKM(
    thongTin?: Partial<Omit<ChuongTrinhKhuyenMaiProps, 'maCTKM'>>
  ): void {
    if (thongTin?.tenCTKM !== undefined) this.tenCTKM = thongTin.tenCTKM;
    if (thongTin?.phanTramGiam !== undefined) this.phanTramGiam = thongTin.phanTramGiam;
    if (thongTin?.ngayBatDau !== undefined) this._ngayBatDau = new Date(thongTin.ngayBatDau);
    if (thongTin?.ngayKetThuc !== undefined) this._ngayKetThuc = new Date(thongTin.ngayKetThuc);
    if (thongTin?.trangThai !== undefined) this._trangThai = thongTin.trangThai;
    this.touch();
  }

  public dangHieuLuc(ngayKiemTra: Date = new Date()): boolean {
    return (
      this._trangThai &&
      ngayKiemTra >= this._ngayBatDau &&
      ngayKiemTra <= this._ngayKetThuc
    );
  }
}
