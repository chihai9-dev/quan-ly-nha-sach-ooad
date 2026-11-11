import { NguoiDung } from './NguoiDung';
import { TaiKhoan } from './TaiKhoan';

export interface NhanVienProps {
  maNV: string;
  hoTen: string;
  soDienThoai: string;
  email: string;
  diaChi: string;
  ngayVaoLam?: Date | string;
  taiKhoan?: TaiKhoan | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp NhanVien kế thừa từ NguoiDung theo Class Diagram
 * -maNV: String
 * -hoTen: String
 * -soDienThoai: String
 * -email: String
 * -diaChi: String
 * -ngayVaoLam: Date
 * +capNhatThongTin(): void
 * +traCuuNhanVien(tuKhoa: String): List<NhanVien>
 */
export class NhanVien extends NguoiDung {
  private _maNV: string;
  private _diaChi: string;
  private _ngayVaoLam: Date;
  private _taiKhoan: TaiKhoan | null;

  constructor(props: NhanVienProps) {
    super({
      id: props.maNV,
      hoTen: props.hoTen,
      soDienThoai: props.soDienThoai,
      email: props.email,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
    if (!props.maNV.trim()) {
      throw new Error('Mã nhân viên không được để trống.');
    }
    this._maNV = props.maNV.trim();
    this._diaChi = props.diaChi.trim();
    this._ngayVaoLam = props.ngayVaoLam ? new Date(props.ngayVaoLam) : new Date();
    this._taiKhoan = props.taiKhoan ?? null;
  }

  public get maNV(): string {
    return this._maNV;
  }

  public get diaChi(): string {
    return this._diaChi;
  }

  public set diaChi(value: string) {
    this._diaChi = value.trim();
    this.touch();
  }

  public get ngayVaoLam(): Date {
    return this._ngayVaoLam;
  }

  public set ngayVaoLam(value: Date) {
    this._ngayVaoLam = value;
    this.touch();
  }

  public get taiKhoan(): TaiKhoan | null {
    return this._taiKhoan;
  }

  public set taiKhoan(tk: TaiKhoan | null) {
    this._taiKhoan = tk;
    this.touch();
  }

  public capNhatThongTin(
    thongTin?: Partial<Pick<NhanVienProps, 'hoTen' | 'soDienThoai' | 'email' | 'diaChi'>>
  ): void {
    if (thongTin?.hoTen !== undefined) this.hoTen = thongTin.hoTen;
    if (thongTin?.soDienThoai !== undefined) this.soDienThoai = thongTin.soDienThoai;
    if (thongTin?.email !== undefined) this.email = thongTin.email;
    if (thongTin?.diaChi !== undefined) this._diaChi = thongTin.diaChi.trim();
    this.touch();
  }

  public traCuuNhanVien(tuKhoa: string, danhSach: NhanVien[] = [this]): NhanVien[] {
    const kw = tuKhoa.trim().toLowerCase();
    if (!kw) return [...danhSach];
    return danhSach.filter(
      nv =>
        nv.maNV.toLowerCase().includes(kw) ||
        nv.hoTen.toLowerCase().includes(kw) ||
        nv.soDienThoai.toLowerCase().includes(kw) ||
        nv.email.toLowerCase().includes(kw)
    );
  }
}
