import { BaseEntity } from './BaseEntity';

export interface TacGiaProps {
  maTacGia: string;
  tenTacGia: string;
  tieuSu?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp TacGia theo Class Diagram
 * -maTacGia: String
 * -tenTacGia: String
 * -tieuSu: String
 * +quanLyTacGia(): void
 */
export class TacGia extends BaseEntity {
  private _maTacGia: string;
  private _tenTacGia: string;
  private _tieuSu: string;

  constructor(props: TacGiaProps) {
    super(props.maTacGia, props.createdAt, props.updatedAt);
    if (!props.maTacGia.trim()) {
      throw new Error('Mã tác giả không được để trống.');
    }
    if (!props.tenTacGia.trim()) {
      throw new Error('Tên tác giả không được để trống.');
    }
    this._maTacGia = props.maTacGia.trim();
    this._tenTacGia = props.tenTacGia.trim();
    this._tieuSu = props.tieuSu?.trim() || '';
  }

  public get maTacGia(): string {
    return this._maTacGia;
  }

  public get tenTacGia(): string {
    return this._tenTacGia;
  }

  public set tenTacGia(value: string) {
    if (!value.trim()) {
      throw new Error('Tên tác giả không được để trống.');
    }
    this._tenTacGia = value.trim();
    this.touch();
  }

  public get tieuSu(): string {
    return this._tieuSu;
  }

  public set tieuSu(value: string) {
    this._tieuSu = value.trim();
    this.touch();
  }

  public quanLyTacGia(tenTacGia?: string, tieuSu?: string): void {
    if (tenTacGia !== undefined) this.tenTacGia = tenTacGia;
    if (tieuSu !== undefined) this.tieuSu = tieuSu;
    this.touch();
  }
}
