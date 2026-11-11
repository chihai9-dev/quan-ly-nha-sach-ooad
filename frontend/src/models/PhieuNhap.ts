import { BaseEntity } from './BaseEntity';
import { ChiTietPhieuNhap } from './ChiTietPhieuNhap';
import { NhanVien } from './NhanVien';

export interface PhieuNhapProps {
  maPhieuNhap: string;
  ngayNhap?: Date | string;
  tongTien?: number;
  daThanhToan?: number;
  conNo?: number;
  trangThai?: string;
  maNCC?: string;
  nhanVien?: NhanVien | null;
  danhSachChiTiet?: ChiTietPhieuNhap[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp PhieuNhap theo Class Diagram
 * -maPhieuNhap: String
 * -ngayNhap: DateTime
 * -tongTien: Double
 * -daThanhToan: Double
 * -conNo: Double
 * -trangThai: String
 * +lapPhieuNhap(): void
 * +traCuuPhieuNhap(tuKhoa: String): List<PhieuNhap>
 * +tinhTongTien(): Double
 */
export class PhieuNhap extends BaseEntity {
  private _maPhieuNhap: string;
  private _ngayNhap: Date;
  private _tongTien: number;
  private _daThanhToan: number;
  private _conNo: number;
  private _trangThai: string;
  private _maNCC: string;
  private _nhanVien: NhanVien | null;
  private _danhSachChiTiet: ChiTietPhieuNhap[];

  constructor(props: PhieuNhapProps) {
    super(props.maPhieuNhap, props.createdAt, props.updatedAt);
    if (!props.maPhieuNhap.trim()) {
      throw new Error('Mã phiếu nhập không được để trống.');
    }
    this._maPhieuNhap = props.maPhieuNhap.trim();
    this._ngayNhap = props.ngayNhap ? new Date(props.ngayNhap) : new Date();
    this._danhSachChiTiet = props.danhSachChiTiet ? [...props.danhSachChiTiet] : [];
    this._tongTien = props.tongTien ?? this.tinhTongTien();
    this._daThanhToan = props.daThanhToan ?? 0;
    this._conNo = props.conNo ?? Math.max(0, this._tongTien - this._daThanhToan);
    this._trangThai =
      props.trangThai ??
      (this._conNo === 0 && this._tongTien > 0 ? 'DA_THANH_TOAN' : 'CON_NO');
    this._maNCC = props.maNCC ?? '';
    this._nhanVien = props.nhanVien ?? null;
  }

  public get maPhieuNhap(): string {
    return this._maPhieuNhap;
  }

  public get ngayNhap(): Date {
    return this._ngayNhap;
  }

  public get tongTien(): number {
    return this._tongTien;
  }

  public get daThanhToan(): number {
    return this._daThanhToan;
  }

  public get conNo(): number {
    return this._conNo;
  }

  public get trangThai(): string {
    return this._trangThai;
  }

  public get maNCC(): string {
    return this._maNCC;
  }

  public get nhanVien(): NhanVien | null {
    return this._nhanVien;
  }

  public get danhSachChiTiet(): ReadonlyArray<ChiTietPhieuNhap> {
    return [...this._danhSachChiTiet];
  }

  public themChiTiet(chiTiet: ChiTietPhieuNhap): void {
    this._danhSachChiTiet.push(chiTiet);
    this.tinhTongTien();
    this.touch();
  }

  public tinhTongTien(): number {
    this._tongTien = this._danhSachChiTiet.reduce(
      (sum, ct) => sum + ct.tinhThanhTien(),
      0
    );
    this._conNo = Math.max(0, this._tongTien - this._daThanhToan);
    this._trangThai =
      this._conNo === 0 && this._tongTien > 0
        ? 'DA_THANH_TOAN'
        : this._daThanhToan > 0
        ? 'THANH_TOAN_MOT_PHAN'
        : 'CHUA_THANH_TOAN';
    return this._tongTien;
  }

  public calculateTotal(): number {
    return this.tinhTongTien();
  }

  public lapPhieuNhap(): void {
    this.tinhTongTien();
    for (const ct of this._danhSachChiTiet) {
      ct.sach.capNhatSoLuongTon(ct.soLuongNhap);
    }
    this.touch();
  }

  public ghiNhanThanhToan(soTien: number): void {
    if (soTien <= 0) throw new Error('Số tiền thanh toán phải lớn hơn 0.');
    if (this._daThanhToan + soTien > this._tongTien) {
      throw new Error('Số tiền thanh toán vượt quá tổng tiền phiếu nhập.');
    }
    this._daThanhToan += soTien;
    this.tinhTongTien();
    this.touch();
  }

  public traCuuPhieuNhap(tuKhoa: string, danhSach: PhieuNhap[] = [this]): PhieuNhap[] {
    const kw = tuKhoa.trim().toLowerCase();
    if (!kw) return [...danhSach];
    return danhSach.filter(
      pn =>
        pn.maPhieuNhap.toLowerCase().includes(kw) ||
        pn.trangThai.toLowerCase().includes(kw)
    );
  }
}
