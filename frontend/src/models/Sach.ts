import { BaseEntity } from './BaseEntity';
import { TheLoai } from './TheLoai';
import { TacGia } from './TacGia';
import { NhaXuatBan } from './NhaXuatBan';
import { ChuongTrinhKhuyenMai } from './ChuongTrinhKhuyenMai';

export interface SachProps {
  maSach: string;
  tenSach: string;
  namXuatBan: number;
  giaNhap: number;
  giaBan: number;
  soLuongTon: number;
  mucTonToiThieu?: number;
  trangThai?: string;
  theLoai?: TheLoai | null;
  nhaXuatBan?: NhaXuatBan | null;
  danhSachTacGia?: TacGia[];
  chuongTrinhKhuyenMai?: ChuongTrinhKhuyenMai | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp Sach theo Class Diagram
 * -maSach: String
 * -tenSach: String
 * -namXuatBan: int
 * -giaNhap: Double
 * -giaBan: Double
 * -soLuongTon: int
 * -mucTonToiThieu: int
 * -trangThai: String
 * +capNhatThongTinSach(): void
 * +traCuuSach(tuKhoa: String): List<Sach>
 * +kiemTraCanhBaoTonKho(): Boolean
 * +capNhatSoLuongTon(soLuong: int): void
 */
export class Sach extends BaseEntity {
  private _maSach: string;
  private _tenSach: string;
  private _namXuatBan: number;
  private _giaNhap: number;
  private _giaBan: number;
  private _soLuongTon: number;
  private _mucTonToiThieu: number;
  private _trangThai: string;

  // Quan hệ kết tập (Aggregation) với TheLoai, NhaXuatBan, TacGia[], ChuongTrinhKhuyenMai
  private _theLoai: TheLoai | null;
  private _nhaXuatBan: NhaXuatBan | null;
  private _danhSachTacGia: TacGia[];
  private _chuongTrinhKhuyenMai: ChuongTrinhKhuyenMai | null;

  constructor(props: SachProps) {
    super(props.maSach, props.createdAt, props.updatedAt);
    if (!props.maSach.trim()) {
      throw new Error('Mã sách không được để trống.');
    }
    if (!props.tenSach.trim()) {
      throw new Error('Tên sách không được để trống.');
    }
    if (props.giaNhap < 0 || props.giaBan < 0) {
      throw new Error('Giá nhập và giá bán không được âm.');
    }
    if (props.soLuongTon < 0) {
      throw new Error('Số lượng tồn kho không được âm.');
    }

    this._maSach = props.maSach.trim();
    this._tenSach = props.tenSach.trim();
    this._namXuatBan = props.namXuatBan;
    this._giaNhap = props.giaNhap;
    this._giaBan = props.giaBan;
    this._soLuongTon = props.soLuongTon;
    this._mucTonToiThieu = props.mucTonToiThieu ?? 5;
    this._trangThai = props.trangThai ?? (props.soLuongTon > 0 ? 'CON_HANG' : 'HET_HANG');
    this._theLoai = props.theLoai ?? null;
    this._nhaXuatBan = props.nhaXuatBan ?? null;
    this._danhSachTacGia = props.danhSachTacGia ? [...props.danhSachTacGia] : [];
    this._chuongTrinhKhuyenMai = props.chuongTrinhKhuyenMai ?? null;
  }

  public get maSach(): string {
    return this._maSach;
  }

  public get tenSach(): string {
    return this._tenSach;
  }

  public set tenSach(value: string) {
    if (!value.trim()) throw new Error('Tên sách không được để trống.');
    this._tenSach = value.trim();
    this.touch();
  }

  public get namXuatBan(): number {
    return this._namXuatBan;
  }

  public set namXuatBan(value: number) {
    this._namXuatBan = value;
    this.touch();
  }

  public get giaNhap(): number {
    return this._giaNhap;
  }

  public set giaNhap(value: number) {
    if (value < 0) throw new Error('Giá nhập không được âm.');
    this._giaNhap = value;
    this.touch();
  }

  public get giaBan(): number {
    return this._giaBan;
  }

  public set giaBan(value: number) {
    if (value < 0) throw new Error('Giá bán không được âm.');
    this._giaBan = value;
    this.touch();
  }

  public get soLuongTon(): number {
    return this._soLuongTon;
  }

  public get mucTonToiThieu(): number {
    return this._mucTonToiThieu;
  }

  public set mucTonToiThieu(value: number) {
    if (value < 0) throw new Error('Mức tồn tối thiểu không được âm.');
    this._mucTonToiThieu = value;
    this.touch();
  }

  public get trangThai(): string {
    return this._trangThai;
  }

  public set trangThai(value: string) {
    this._trangThai = value.trim();
    this.touch();
  }

  public get theLoai(): TheLoai | null {
    return this._theLoai;
  }

  public get nhaXuatBan(): NhaXuatBan | null {
    return this._nhaXuatBan;
  }

  public get danhSachTacGia(): ReadonlyArray<TacGia> {
    return [...this._danhSachTacGia];
  }

  public get chuongTrinhKhuyenMai(): ChuongTrinhKhuyenMai | null {
    return this._chuongTrinhKhuyenMai;
  }

  public capNhatThongTinSach(thongTin?: Partial<Omit<SachProps, 'maSach'>>): void {
    if (thongTin?.tenSach !== undefined) this.tenSach = thongTin.tenSach;
    if (thongTin?.namXuatBan !== undefined) this.namXuatBan = thongTin.namXuatBan;
    if (thongTin?.giaNhap !== undefined) this.giaNhap = thongTin.giaNhap;
    if (thongTin?.giaBan !== undefined) this.giaBan = thongTin.giaBan;
    if (thongTin?.mucTonToiThieu !== undefined) this.mucTonToiThieu = thongTin.mucTonToiThieu;
    if (thongTin?.trangThai !== undefined) this.trangThai = thongTin.trangThai;
    if (thongTin?.theLoai !== undefined) this._theLoai = thongTin.theLoai;
    if (thongTin?.nhaXuatBan !== undefined) this._nhaXuatBan = thongTin.nhaXuatBan;
    if (thongTin?.danhSachTacGia !== undefined) {
      this._danhSachTacGia = [...thongTin.danhSachTacGia];
    }
    if (thongTin?.chuongTrinhKhuyenMai !== undefined) {
      this._chuongTrinhKhuyenMai = thongTin.chuongTrinhKhuyenMai;
    }
    this.touch();
  }

  public traCuuSach(tuKhoa: string, danhSach: Sach[] = [this]): Sach[] {
    const kw = tuKhoa.trim().toLowerCase();
    if (!kw) return [...danhSach];
    return danhSach.filter(
      s =>
        s.maSach.toLowerCase().includes(kw) ||
        s.tenSach.toLowerCase().includes(kw) ||
        s.danhSachTacGia.some(tg => tg.tenTacGia.toLowerCase().includes(kw))
    );
  }

  public kiemTraCanhBaoTonKho(): boolean {
    return this._soLuongTon <= this._mucTonToiThieu;
  }

  public capNhatSoLuongTon(soLuong: number): void {
    const tonMoi = this._soLuongTon + soLuong;
    if (tonMoi < 0) {
      throw new Error(
        `Sách "${this._tenSach}" không đủ tồn kho (hiện có: ${this._soLuongTon}, cần trừ: ${-soLuong}).`
      );
    }
    this._soLuongTon = tonMoi;
    this._trangThai = this._soLuongTon > 0 ? 'CON_HANG' : 'HET_HANG';
    this.touch();
  }

  public tinhGiaBanSauKhuyenMai(): number {
    if (this._chuongTrinhKhuyenMai && this._chuongTrinhKhuyenMai.dangHieuLuc()) {
      const phanTram = this._chuongTrinhKhuyenMai.phanTramGiam;
      return Math.round(this._giaBan * (1 - phanTram / 100));
    }
    return this._giaBan;
  }
}
