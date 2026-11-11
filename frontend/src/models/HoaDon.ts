import { BaseEntity } from './BaseEntity';
import { ChiTietHoaDon } from './ChiTietHoaDon';
import { ThanhToan } from './ThanhToan';
import { NhanVien } from './NhanVien';
import { MaGiamGia } from './MaGiamGia';
import type { KhachHang } from './KhachHang';

export interface HoaDonProps {
  maHoaDon: string;
  ngayLap?: Date | string;
  tongTienHang?: number;
  tienGiamGia?: number;
  thanhToanCuoi?: number;
  trangThai?: string;
  khachHang?: KhachHang | null;
  nhanVien?: NhanVien | null;
  maGiamGia?: MaGiamGia | null;
  danhSachChiTiet?: ChiTietHoaDon[];
  danhSachThanhToan?: ThanhToan[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp HoaDon theo Class Diagram
 * -maHoaDon: String
 * -ngayLap: DateTime
 * -tongTienHang: Double
 * -tienGiamGia: Double
 * -thanhToanCuoi: Double
 * -trangThai: String
 * +lapHoaDon(): void
 * +traCuuHoaDon(tuKhoa: String): List<HoaDon>
 * +tinhTongThanhToan(): Double
 * (kèm alias calculateTotal() và applyDiscount() theo yêu cầu OOP)
 */
export class HoaDon extends BaseEntity {
  private _maHoaDon: string;
  private _ngayLap: Date;
  private _tongTienHang: number;
  private _tienGiamGia: number;
  private _thanhToanCuoi: number;
  private _trangThai: string;

  // Quan hệ kết tập (Aggregation) và hợp thành (Composition)
  private _khachHang: KhachHang | null;
  private _nhanVien: NhanVien | null;
  private _maGiamGia: MaGiamGia | null;
  private _danhSachChiTiet: ChiTietHoaDon[];
  private _danhSachThanhToan: ThanhToan[];

  constructor(props: HoaDonProps) {
    super(props.maHoaDon, props.createdAt, props.updatedAt);
    if (!props.maHoaDon.trim()) {
      throw new Error('Mã hóa đơn không được để trống.');
    }
    this._maHoaDon = props.maHoaDon.trim();
    this._ngayLap = props.ngayLap ? new Date(props.ngayLap) : new Date();
    this._danhSachChiTiet = props.danhSachChiTiet ? [...props.danhSachChiTiet] : [];
    this._danhSachThanhToan = props.danhSachThanhToan ? [...props.danhSachThanhToan] : [];
    this._khachHang = props.khachHang ?? null;
    this._nhanVien = props.nhanVien ?? null;
    this._maGiamGia = props.maGiamGia ?? null;
    this._tongTienHang = props.tongTienHang ?? 0;
    this._tienGiamGia = props.tienGiamGia ?? 0;
    this._thanhToanCuoi = props.thanhToanCuoi ?? 0;
    this._trangThai = props.trangThai ?? 'MOI_TAO';
    this.tinhTongThanhToan();
  }

  public get maHoaDon(): string {
    return this._maHoaDon;
  }

  public get ngayLap(): Date {
    return this._ngayLap;
  }

  public get tongTienHang(): number {
    return this._tongTienHang;
  }

  public get tienGiamGia(): number {
    return this._tienGiamGia;
  }

  public get thanhToanCuoi(): number {
    return this._thanhToanCuoi;
  }

  public get trangThai(): string {
    return this._trangThai;
  }

  public set trangThai(value: string) {
    this._trangThai = value.trim();
    this.touch();
  }

  public get khachHang(): KhachHang | null {
    return this._khachHang;
  }

  public get nhanVien(): NhanVien | null {
    return this._nhanVien;
  }

  public get maGiamGia(): MaGiamGia | null {
    return this._maGiamGia;
  }

  public get danhSachChiTiet(): ReadonlyArray<ChiTietHoaDon> {
    return [...this._danhSachChiTiet];
  }

  public get danhSachThanhToan(): ReadonlyArray<ThanhToan> {
    return [...this._danhSachThanhToan];
  }

  public themChiTiet(chiTiet: ChiTietHoaDon): void {
    this._danhSachChiTiet.push(chiTiet);
    this.tinhTongThanhToan();
    this.touch();
  }

  public themThanhToan(thanhToan: ThanhToan): void {
    this._danhSachThanhToan.push(thanhToan);
    this.touch();
  }

  /**
   * Áp dụng mã giảm giá hoặc số tiền giảm giá trực tiếp
   */
  public applyDiscount(giamGia: MaGiamGia | number): number {
    this._tongTienHang = this._danhSachChiTiet.reduce(
      (sum, ct) => sum + ct.tinhThanhTien(),
      0
    );

    if (typeof giamGia === 'number') {
      if (giamGia < 0 || giamGia > this._tongTienHang) {
        throw new Error('Số tiền giảm giá không hợp lệ.');
      }
      this._tienGiamGia = giamGia;
    } else {
      if (!giamGia.kiemTraHopLe(this._tongTienHang)) {
        throw new Error(`Mã giảm giá "${giamGia.maCode}" không hợp lệ hoặc chưa đủ điều kiện.`);
      }
      giamGia.suDungMa();
      this._maGiamGia = giamGia;
      this._tienGiamGia = Math.min(this._tongTienHang, giamGia.giaTriGiam);
    }

    this._thanhToanCuoi = Math.max(0, this._tongTienHang - this._tienGiamGia);
    this.touch();
    return this._thanhToanCuoi;
  }

  public tinhTongThanhToan(): number {
    if (this._danhSachChiTiet.length > 0) {
      this._tongTienHang = this._danhSachChiTiet.reduce(
        (sum, ct) => sum + ct.tinhThanhTien(),
        0
      );
    }
    this._thanhToanCuoi = Math.max(0, this._tongTienHang - this._tienGiamGia);
    return this._thanhToanCuoi;
  }

  public calculateTotal(): number {
    return this.tinhTongThanhToan();
  }

  public lapHoaDon(): void {
    if (this._danhSachChiTiet.length === 0) {
      throw new Error('Hóa đơn phải có ít nhất 1 dòng chi tiết sách.');
    }
    this.tinhTongThanhToan();
    for (const ct of this._danhSachChiTiet) {
      ct.sach.capNhatSoLuongTon(-ct.soLuongBan);
    }
    if (this._khachHang) {
      this._khachHang.congDiemTichLuy(Math.floor(this._thanhToanCuoi / 10000));
    }
    this._trangThai = 'DA_THANH_TOAN';
    this.touch();
  }

  public traCuuHoaDon(tuKhoa: string, danhSach: HoaDon[] = [this]): HoaDon[] {
    const kw = tuKhoa.trim().toLowerCase();
    if (!kw) return [...danhSach];
    return danhSach.filter(
      hd =>
        hd.maHoaDon.toLowerCase().includes(kw) ||
        hd.trangThai.toLowerCase().includes(kw)
    );
  }
}
