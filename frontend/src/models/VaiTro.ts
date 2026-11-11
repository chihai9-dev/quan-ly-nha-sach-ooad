import { BaseEntity } from './BaseEntity';

export interface VaiTroProps {
  maVaiTro: string;
  tenVaiTro: string;
  danhSachQuyen?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp VaiTro (Role) theo Class Diagram
 * -maVaiTro: String
 * -tenVaiTro: String
 * -danhSachQuyen: List<String>
 * +phanQuyen(): void
 */
export class VaiTro extends BaseEntity {
  private _maVaiTro: string;
  private _tenVaiTro: string;
  private _danhSachQuyen: string[];

  constructor(props: VaiTroProps) {
    super(props.maVaiTro, props.createdAt, props.updatedAt);
    if (!props.maVaiTro.trim()) {
      throw new Error('Mã vai trò không được để trống.');
    }
    if (!props.tenVaiTro.trim()) {
      throw new Error('Tên vai trò không được để trống.');
    }
    this._maVaiTro = props.maVaiTro.trim();
    this._tenVaiTro = props.tenVaiTro.trim();
    this._danhSachQuyen = props.danhSachQuyen ? [...props.danhSachQuyen] : [];
  }

  public get maVaiTro(): string {
    return this._maVaiTro;
  }

  public get tenVaiTro(): string {
    return this._tenVaiTro;
  }

  public set tenVaiTro(value: string) {
    if (!value.trim()) {
      throw new Error('Tên vai trò không được để trống.');
    }
    this._tenVaiTro = value.trim();
    this.touch();
  }

  public get danhSachQuyen(): ReadonlyArray<string> {
    return [...this._danhSachQuyen];
  }

  public phanQuyen(quyenMoi?: string[]): void {
    if (quyenMoi) {
      this._danhSachQuyen = Array.from(new Set(quyenMoi.map(q => q.trim()).filter(Boolean)));
    }
    this.touch();
  }

  public coQuyen(quyen: string): boolean {
    return this._danhSachQuyen.includes(quyen);
  }
}
