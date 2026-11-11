import { BaseEntity } from './BaseEntity';

export interface NhaXuatBanProps {
  maNXB: string;
  tenNXB: string;
  diaChi?: string;
  soDienThoai?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp NhaXuatBan theo Class Diagram
 * -maNXB: String
 * -tenNXB: String
 * -diaChi: String
 * -soDienThoai: String
 * +quanLyNXB(): void
 */
export class NhaXuatBan extends BaseEntity {
  private _maNXB: string;
  private _tenNXB: string;
  private _diaChi: string;
  private _soDienThoai: string;

  constructor(props: NhaXuatBanProps) {
    super(props.maNXB, props.createdAt, props.updatedAt);
    if (!props.maNXB.trim()) {
      throw new Error('Mã nhà xuất bản không được để trống.');
    }
    if (!props.tenNXB.trim()) {
      throw new Error('Tên nhà xuất bản không được để trống.');
    }
    this._maNXB = props.maNXB.trim();
    this._tenNXB = props.tenNXB.trim();
    this._diaChi = props.diaChi?.trim() || '';
    this._soDienThoai = props.soDienThoai?.trim() || '';
  }

  public get maNXB(): string {
    return this._maNXB;
  }

  public get tenNXB(): string {
    return this._tenNXB;
  }

  public set tenNXB(value: string) {
    if (!value.trim()) {
      throw new Error('Tên nhà xuất bản không được để trống.');
    }
    this._tenNXB = value.trim();
    this.touch();
  }

  public get diaChi(): string {
    return this._diaChi;
  }

  public set diaChi(value: string) {
    this._diaChi = value.trim();
    this.touch();
  }

  public get soDienThoai(): string {
    return this._soDienThoai;
  }

  public set soDienThoai(value: string) {
    this._soDienThoai = value.trim();
    this.touch();
  }

  public quanLyNXB(thongTin?: Partial<Omit<NhaXuatBanProps, 'maNXB'>>): void {
    if (thongTin?.tenNXB !== undefined) this.tenNXB = thongTin.tenNXB;
    if (thongTin?.diaChi !== undefined) this.diaChi = thongTin.diaChi;
    if (thongTin?.soDienThoai !== undefined) this.soDienThoai = thongTin.soDienThoai;
    this.touch();
  }
}
