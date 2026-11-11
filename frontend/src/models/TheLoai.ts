import { BaseEntity } from './BaseEntity';

export interface TheLoaiProps {
  maTheLoai: string;
  tenTheLoai: string;
  moTa?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp TheLoai theo Class Diagram
 * -maTheLoai: String
 * -tenTheLoai: String
 * -moTa: String
 * +quanLyTheLoai(): void
 */
export class TheLoai extends BaseEntity {
  private _maTheLoai: string;
  private _tenTheLoai: string;
  private _moTa: string;

  constructor(props: TheLoaiProps) {
    super(props.maTheLoai, props.createdAt, props.updatedAt);
    if (!props.maTheLoai.trim()) {
      throw new Error('Mã thể loại không được để trống.');
    }
    if (!props.tenTheLoai.trim()) {
      throw new Error('Tên thể loại không được để trống.');
    }
    this._maTheLoai = props.maTheLoai.trim();
    this._tenTheLoai = props.tenTheLoai.trim();
    this._moTa = props.moTa?.trim() || '';
  }

  public get maTheLoai(): string {
    return this._maTheLoai;
  }

  public get tenTheLoai(): string {
    return this._tenTheLoai;
  }

  public set tenTheLoai(value: string) {
    if (!value.trim()) {
      throw new Error('Tên thể loại không được để trống.');
    }
    this._tenTheLoai = value.trim();
    this.touch();
  }

  public get moTa(): string {
    return this._moTa;
  }

  public set moTa(value: string) {
    this._moTa = value.trim();
    this.touch();
  }

  public quanLyTheLoai(tenMoi?: string, moTaMoi?: string): void {
    if (tenMoi !== undefined) this.tenTheLoai = tenMoi;
    if (moTaMoi !== undefined) this.moTa = moTaMoi;
    this.touch();
  }
}
