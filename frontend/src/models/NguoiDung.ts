import { BaseEntity } from './BaseEntity';

export interface NguoiDungProps {
  id: string;
  hoTen: string;
  soDienThoai: string;
  email: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp trừu tượng NguoiDung (Base class cho NhanVien và KhachHang)
 * Thể hiện nguyên lý Kế thừa (Inheritance) và Đóng gói (Encapsulation) trong OOP.
 */
export abstract class NguoiDung extends BaseEntity {
  protected _hoTen: string;
  protected _soDienThoai: string;
  protected _email: string;

  constructor(props: NguoiDungProps) {
    super(props.id, props.createdAt, props.updatedAt);
    if (!props.hoTen.trim()) {
      throw new Error('Họ tên không được để trống.');
    }
    this._hoTen = props.hoTen.trim();
    this._soDienThoai = props.soDienThoai.trim();
    this._email = props.email.trim();
  }

  public get hoTen(): string {
    return this._hoTen;
  }

  public set hoTen(value: string) {
    if (!value.trim()) {
      throw new Error('Họ tên không được để trống.');
    }
    this._hoTen = value.trim();
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
}
