import { BaseEntity } from './BaseEntity';
import { ChiTietDoiTra } from './ChiTietDoiTra';
import { HoaDon } from './HoaDon';
import { NhanVien } from './NhanVien';

export interface PhieuDoiTraProps {
  maDoiTra: string;
  ngayDoiTra?: Date | string;
  lyDo: string;
  hinhThucXuLy: string;
  tienHoanTra?: number;
  hoaDon?: HoaDon | null;
  nhanVien?: NhanVien | null;
  danhSachChiTiet?: ChiTietDoiTra[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp PhieuDoiTra theo Class Diagram
 * -maDoiTra: String
 * -ngayDoiTra: DateTime
 * -lyDo: String
 * -hinhThucXuLy: String
 * -tienHoanTra: Double
 * +lapPhieuDoiTra(): void
 * +quanLyDoiTraHang(): void
 */
export class PhieuDoiTra extends BaseEntity {
  private _maDoiTra: string;
  private _ngayDoiTra: Date;
  private _lyDo: string;
  private _hinhThucXuLy: string;
  private _tienHoanTra: number;
  private _hoaDon: HoaDon | null;
  private _nhanVien: NhanVien | null;
  private _danhSachChiTiet: ChiTietDoiTra[];

  constructor(props: PhieuDoiTraProps) {
    super(props.maDoiTra, props.createdAt, props.updatedAt);
    if (!props.maDoiTra.trim()) {
      throw new Error('Mã đổi trả không được để trống.');
    }
    if (!props.lyDo.trim()) {
      throw new Error('Lý do đổi trả không được để trống.');
    }
    this._maDoiTra = props.maDoiTra.trim();
    this._ngayDoiTra = props.ngayDoiTra ? new Date(props.ngayDoiTra) : new Date();
    this._lyDo = props.lyDo.trim();
    this._hinhThucXuLy = props.hinhThucXuLy.trim();
    this._danhSachChiTiet = props.danhSachChiTiet ? [...props.danhSachChiTiet] : [];
    this._tienHoanTra =
      props.tienHoanTra ??
      this._danhSachChiTiet.reduce((sum, ct) => sum + ct.tinhTienHoan(), 0);
    this._hoaDon = props.hoaDon ?? null;
    this._nhanVien = props.nhanVien ?? null;
  }

  public get maDoiTra(): string {
    return this._maDoiTra;
  }

  public get ngayDoiTra(): Date {
    return this._ngayDoiTra;
  }

  public get lyDo(): string {
    return this._lyDo;
  }

  public get hinhThucXuLy(): string {
    return this._hinhThucXuLy;
  }

  public get tienHoanTra(): number {
    return this._tienHoanTra;
  }

  public get hoaDon(): HoaDon | null {
    return this._hoaDon;
  }

  public get nhanVien(): NhanVien | null {
    return this._nhanVien;
  }

  public get danhSachChiTiet(): ReadonlyArray<ChiTietDoiTra> {
    return [...this._danhSachChiTiet];
  }

  public themChiTiet(chiTiet: ChiTietDoiTra): void {
    this._danhSachChiTiet.push(chiTiet);
    this._tienHoanTra = this._danhSachChiTiet.reduce(
      (sum, ct) => sum + ct.tinhTienHoan(),
      0
    );
    this.touch();
  }

  public lapPhieuDoiTra(): void {
    this._tienHoanTra = this._danhSachChiTiet.reduce(
      (sum, ct) => sum + ct.tinhTienHoan(),
      0
    );
    for (const ct of this._danhSachChiTiet) {
      ct.sach.capNhatSoLuongTon(ct.soLuongTra);
    }
    this.touch();
  }

  public quanLyDoiTraHang(hinhThucMoi?: string, lyDoMoi?: string): void {
    if (hinhThucMoi !== undefined) this._hinhThucXuLy = hinhThucMoi.trim();
    if (lyDoMoi !== undefined) this._lyDo = lyDoMoi.trim();
    this.touch();
  }
}
