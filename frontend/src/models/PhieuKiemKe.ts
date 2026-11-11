import { BaseEntity } from './BaseEntity';
import { ChiTietKiemKe } from './ChiTietKiemKe';
import { NhanVien } from './NhanVien';
import { Sach } from './Sach';

export interface PhieuKiemKeProps {
  maKiemKe: string;
  ngayKiemKe?: Date | string;
  ghiChu?: string;
  nhanVien?: NhanVien | null;
  danhSachChiTiet?: ChiTietKiemKe[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp PhieuKiemKe theo Class Diagram
 * -maKiemKe: String
 * -ngayKiemKe: DateTime
 * -ghiChu: String
 * +taoPhieuKiemKe(): void
 * +canBangKho(): void
 * +layDanhSachCanhBaoTon(): List<Sach>
 */
export class PhieuKiemKe extends BaseEntity {
  private _maKiemKe: string;
  private _ngayKiemKe: Date;
  private _ghiChu: string;
  private _nhanVien: NhanVien | null;
  private _danhSachChiTiet: ChiTietKiemKe[];

  constructor(props: PhieuKiemKeProps) {
    super(props.maKiemKe, props.createdAt, props.updatedAt);
    if (!props.maKiemKe.trim()) {
      throw new Error('Mã phiếu kiểm kê không được để trống.');
    }
    this._maKiemKe = props.maKiemKe.trim();
    this._ngayKiemKe = props.ngayKiemKe ? new Date(props.ngayKiemKe) : new Date();
    this._ghiChu = props.ghiChu?.trim() || '';
    this._nhanVien = props.nhanVien ?? null;
    this._danhSachChiTiet = props.danhSachChiTiet ? [...props.danhSachChiTiet] : [];
  }

  public get maKiemKe(): string {
    return this._maKiemKe;
  }

  public get ngayKiemKe(): Date {
    return this._ngayKiemKe;
  }

  public get ghiChu(): string {
    return this._ghiChu;
  }

  public set ghiChu(value: string) {
    this._ghiChu = value.trim();
    this.touch();
  }

  public get nhanVien(): NhanVien | null {
    return this._nhanVien;
  }

  public get danhSachChiTiet(): ReadonlyArray<ChiTietKiemKe> {
    return [...this._danhSachChiTiet];
  }

  public themChiTiet(chiTiet: ChiTietKiemKe): void {
    this._danhSachChiTiet.push(chiTiet);
    this.touch();
  }

  public taoPhieuKiemKe(): void {
    this._ngayKiemKe = new Date();
    this.touch();
  }

  public canBangKho(): void {
    for (const ct of this._danhSachChiTiet) {
      const chenhLech = ct.tinhChenhLech();
      if (chenhLech !== 0) {
        ct.sach.capNhatSoLuongTon(chenhLech);
      }
    }
    this.touch();
  }

  public layDanhSachCanhBaoTon(danhSachSach?: Sach[]): Sach[] {
    const nguon = danhSachSach ?? this._danhSachChiTiet.map(ct => ct.sach);
    return nguon.filter(s => s.kiemTraCanhBaoTonKho());
  }
}
