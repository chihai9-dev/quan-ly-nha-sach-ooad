import { BaseEntity } from './BaseEntity';
import { PhieuNhap } from './PhieuNhap';

export interface NhaCungCapProps {
  maNCC: string;
  tenNCC: string;
  soDienThoai: string;
  email: string;
  diaChi: string;
  tongCongNo?: number;
  lichSuNhapHang?: PhieuNhap[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp NhaCungCap theo Class Diagram
 * -maNCC: String
 * -tenNCC: String
 * -soDienThoai: String
 * -email: String
 * -diaChi: String
 * -tongCongNo: Double
 * +capNhatThongTinNCC(): void
 * +traCuuNCC(tuKhoa: String): List<NhaCungCap>
 * +traCuuLichSuNhapHang(): List<PhieuNhap>
 * +capNhatCongNo(soTien: Double): void
 */
export class NhaCungCap extends BaseEntity {
  private _maNCC: string;
  private _tenNCC: string;
  private _soDienThoai: string;
  private _email: string;
  private _diaChi: string;
  private _tongCongNo: number;
  private _lichSuNhapHang: PhieuNhap[];

  constructor(props: NhaCungCapProps) {
    super(props.maNCC, props.createdAt, props.updatedAt);
    if (!props.maNCC.trim()) throw new Error('Mã nhà cung cấp không được để trống.');
    if (!props.tenNCC.trim()) throw new Error('Tên nhà cung cấp không được để trống.');
    if ((props.tongCongNo ?? 0) < 0) {
      throw new Error('Tổng công nợ không được âm.');
    }
    this._maNCC = props.maNCC.trim();
    this._tenNCC = props.tenNCC.trim();
    this._soDienThoai = props.soDienThoai.trim();
    this._email = props.email.trim();
    this._diaChi = props.diaChi.trim();
    this._tongCongNo = props.tongCongNo ?? 0;
    this._lichSuNhapHang = props.lichSuNhapHang ? [...props.lichSuNhapHang] : [];
  }

  public get maNCC(): string {
    return this._maNCC;
  }

  public get tenNCC(): string {
    return this._tenNCC;
  }

  public set tenNCC(value: string) {
    if (!value.trim()) throw new Error('Tên nhà cung cấp không được để trống.');
    this._tenNCC = value.trim();
    this.touch();
  }

  public get soDienThoai(): string {
    return this._soDienThoai;
  }

  public set soDienThoai(value: string) {
    this._soDienThoai = value.trim();
    this.touch();
  }

  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    this._email = value.trim();
    this.touch();
  }

  public get diaChi(): string {
    return this._diaChi;
  }

  public set diaChi(value: string) {
    this._diaChi = value.trim();
    this.touch();
  }

  public get tongCongNo(): number {
    return this._tongCongNo;
  }

  public capNhatThongTinNCC(
    thongTin?: Partial<Pick<NhaCungCapProps, 'tenNCC' | 'soDienThoai' | 'email' | 'diaChi'>>
  ): void {
    if (thongTin?.tenNCC !== undefined) this.tenNCC = thongTin.tenNCC;
    if (thongTin?.soDienThoai !== undefined) this.soDienThoai = thongTin.soDienThoai;
    if (thongTin?.email !== undefined) this.email = thongTin.email;
    if (thongTin?.diaChi !== undefined) this.diaChi = thongTin.diaChi;
    this.touch();
  }

  public traCuuNCC(tuKhoa: string, danhSach: NhaCungCap[] = [this]): NhaCungCap[] {
    const kw = tuKhoa.trim().toLowerCase();
    if (!kw) return [...danhSach];
    return danhSach.filter(
      ncc =>
        ncc.maNCC.toLowerCase().includes(kw) ||
        ncc.tenNCC.toLowerCase().includes(kw) ||
        ncc.soDienThoai.toLowerCase().includes(kw)
    );
  }

  public traCuuLichSuNhapHang(): PhieuNhap[] {
    return [...this._lichSuNhapHang];
  }

  public themPhieuNhap(phieuNhap: PhieuNhap): void {
    this._lichSuNhapHang.push(phieuNhap);
    this.capNhatCongNo(phieuNhap.conNo);
  }

  public capNhatCongNo(soTien: number): void {
    const noMoi = this._tongCongNo + soTien;
    if (noMoi < 0) {
      throw new Error('Tổng công nợ sau khi cập nhật không được âm.');
    }
    this._tongCongNo = noMoi;
    this.touch();
  }
}
