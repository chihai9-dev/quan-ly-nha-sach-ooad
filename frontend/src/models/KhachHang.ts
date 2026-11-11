import { NguoiDung } from './NguoiDung';
import type { HoaDon } from './HoaDon';

export interface KhachHangProps {
  maKH: string;
  hoTen: string;
  soDienThoai: string;
  email?: string;
  diemTichLuy?: number;
  lichSuMuaHang?: HoaDon[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp KhachHang kế thừa từ NguoiDung theo Class Diagram
 * -maKH: String
 * -hoTen: String
 * -soDienThoai: String
 * -email: String
 * -diemTichLuy: int
 * +capNhatThongTinKH(): void
 * +traCuuKH(tuKhoa: String): List<KhachHang>
 * +traCuuLichSuMuaHang(): List<HoaDon>
 */
export class KhachHang extends NguoiDung {
  private _maKH: string;
  private _diemTichLuy: number;
  private _lichSuMuaHang: HoaDon[];

  constructor(props: KhachHangProps) {
    super({
      id: props.maKH,
      hoTen: props.hoTen,
      soDienThoai: props.soDienThoai,
      email: props.email ?? '',
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
    if (!props.maKH.trim()) {
      throw new Error('Mã khách hàng không được để trống.');
    }
    if ((props.diemTichLuy ?? 0) < 0) {
      throw new Error('Điểm tích lũy không được âm.');
    }
    this._maKH = props.maKH.trim();
    this._diemTichLuy = props.diemTichLuy ?? 0;
    this._lichSuMuaHang = props.lichSuMuaHang ? [...props.lichSuMuaHang] : [];
  }

  public get maKH(): string {
    return this._maKH;
  }

  public get diemTichLuy(): number {
    return this._diemTichLuy;
  }

  public set diemTichLuy(value: number) {
    if (value < 0) throw new Error('Điểm tích lũy không được âm.');
    this._diemTichLuy = value;
    this.touch();
  }

  public congDiemTichLuy(diem: number): void {
    if (diem > 0) {
      this._diemTichLuy += diem;
      this.touch();
    }
  }

  public capNhatThongTinKH(
    thongTin?: Partial<Pick<KhachHangProps, 'hoTen' | 'soDienThoai' | 'email' | 'diemTichLuy'>>
  ): void {
    if (thongTin?.hoTen !== undefined) this.hoTen = thongTin.hoTen;
    if (thongTin?.soDienThoai !== undefined) this.soDienThoai = thongTin.soDienThoai;
    if (thongTin?.email !== undefined) this.email = thongTin.email;
    if (thongTin?.diemTichLuy !== undefined) this.diemTichLuy = thongTin.diemTichLuy;
    this.touch();
  }

  public traCuuKH(tuKhoa: string, danhSach: KhachHang[] = [this]): KhachHang[] {
    const kw = tuKhoa.trim().toLowerCase();
    if (!kw) return [...danhSach];
    return danhSach.filter(
      kh =>
        kh.maKH.toLowerCase().includes(kw) ||
        kh.hoTen.toLowerCase().includes(kw) ||
        kh.soDienThoai.toLowerCase().includes(kw)
    );
  }

  public traCuuLichSuMuaHang(): HoaDon[] {
    return [...this._lichSuMuaHang];
  }

  public themHoaDon(hoaDon: HoaDon): void {
    this._lichSuMuaHang.push(hoaDon);
    this.touch();
  }
}
