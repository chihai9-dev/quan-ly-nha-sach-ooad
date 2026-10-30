import { BaseEntity } from './BaseEntity';

export interface CategoryProps {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp đại diện cho Danh mục sách.
 * Đóng gói thông tin phân loại sản phẩm trong nhà sách.
 */
export class Category extends BaseEntity {
  private _code: string;
  private _name: string;
  private _description: string;

  constructor(props: CategoryProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._code = props.code.trim().toUpperCase();
    this._name = props.name.trim();
    this._description = props.description?.trim() || '';
  }

  public get code(): string {
    return this._code;
  }

  public get name(): string {
    return this._name;
  }

  public get description(): string {
    return this._description;
  }

  public updateInfo(name: string, description?: string): void {
    if (!name.trim()) {
      throw new Error('Tên danh mục không được để trống.');
    }
    this._name = name.trim();
    if (description !== undefined) {
      this._description = description.trim();
    }
    this.touch();
  }
}
