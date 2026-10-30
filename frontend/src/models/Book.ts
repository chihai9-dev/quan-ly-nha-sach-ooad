import { BaseEntity } from './BaseEntity';
import type { Database } from '@/types/database.types';

export interface BookProps {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher?: string | null;
  publishYear?: number | null;
  price: number;
  stockQuantity: number;
  coverUrl?: string | null;
  categoryId?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp Thực thể Sách (Book Entity)
 * Đóng gói thông tin, logic kiểm tra tồn kho, tính giá và cập nhật nghiệp vụ sách.
 */
export class Book extends BaseEntity {
  private _isbn: string;
  private _title: string;
  private _author: string;
  private _publisher: string;
  private _publishYear: number | null;
  private _price: number;
  private _stockQuantity: number;
  private _coverUrl: string;
  private _categoryId: string | null;

  constructor(props: BookProps) {
    super(props.id, props.createdAt, props.updatedAt);
    
    if (props.price < 0) {
      throw new Error('Giá sách không được là số âm.');
    }
    if (props.stockQuantity < 0) {
      throw new Error('Số lượng tồn kho không được là số âm.');
    }

    this._isbn = props.isbn.trim();
    this._title = props.title.trim();
    this._author = props.author.trim();
    this._publisher = props.publisher?.trim() || '';
    this._publishYear = props.publishYear ?? null;
    this._price = props.price;
    this._stockQuantity = props.stockQuantity;
    this._coverUrl = props.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80';
    this._categoryId = props.categoryId || null;
  }

  // --- Getters đóng gói dữ liệu (Encapsulation) ---
  public get isbn(): string {
    return this._isbn;
  }

  public get title(): string {
    return this._title;
  }

  public get author(): string {
    return this._author;
  }

  public get publisher(): string {
    return this._publisher;
  }

  public get publishYear(): number | null {
    return this._publishYear;
  }

  public get price(): number {
    return this._price;
  }

  public get stockQuantity(): number {
    return this._stockQuantity;
  }

  public get coverUrl(): string {
    return this._coverUrl;
  }

  public get categoryId(): string | null {
    return this._categoryId;
  }

  // --- Các phương thức nghiệp vụ (Business Logic Methods) ---

  /**
   * Kiểm tra sách có đủ số lượng trong kho hay không
   */
  public isAvailable(requiredQuantity: number = 1): boolean {
    if (requiredQuantity <= 0) return false;
    return this._stockQuantity >= requiredQuantity;
  }

  /**
   * Giảm số lượng tồn kho khi bán hàng
   * Bảo đảm bất biến (Invariant): Tồn kho không bao giờ âm
   */
  public reduceStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Số lượng giảm phải lớn hơn 0.');
    }
    if (!this.isAvailable(quantity)) {
      throw new Error(`Sách "${this._title}" không đủ số lượng tồn kho (Hiện có: ${this._stockQuantity}, Yêu cầu: ${quantity}).`);
    }
    this._stockQuantity -= quantity;
    this.touch();
  }

  /**
   * Tăng số lượng tồn kho khi nhập thêm hàng hoặc hủy đơn
   */
  public restock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Số lượng nhập thêm phải lớn hơn 0.');
    }
    this._stockQuantity += quantity;
    this.touch();
  }

  /**
   * Tính giá bán sau khi áp dụng phần trăm chiết khấu
   * @param discountPercent Phần trăm giảm giá (0 -> 100)
   */
  public calculateDiscountedPrice(discountPercent: number): number {
    if (discountPercent <= 0) return this._price;
    if (discountPercent >= 100) return 0;
    return Math.round(this._price * (1 - discountPercent / 100));
  }

  /**
   * Kiểm tra mức tồn kho có thấp hơn ngưỡng an toàn cần cảnh báo không
   */
  public isLowStock(threshold: number = 5): boolean {
    return this._stockQuantity <= threshold;
  }

  /**
   * Điều chỉnh giá bán
   */
  public updatePrice(newPrice: number): void {
    if (newPrice < 0) {
      throw new Error('Đơn giá không thể âm.');
    }
    this._price = newPrice;
    this.touch();
  }

  /**
   * Chuyển đổi từ dữ liệu thô Supabase Row sang Domain Entity Model
   */
  public static fromDatabase(row: Database['public']['Tables']['books']['Row']): Book {
    return new Book({
      id: row.id,
      isbn: row.isbn,
      title: row.title,
      author: row.author,
      publisher: row.publisher,
      publishYear: row.publish_year,
      price: Number(row.price),
      stockQuantity: row.stock_quantity,
      coverUrl: row.cover_url,
      categoryId: row.category_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  /**
   * Chuyển đổi Model sang dạng plain object phù hợp ghi xuống Supabase
   */
  public toDatabase(): Database['public']['Tables']['books']['Insert'] {
    return {
      id: this.id,
      isbn: this._isbn,
      title: this._title,
      author: this._author,
      publisher: this._publisher,
      publish_year: this._publishYear,
      price: this._price,
      stock_quantity: this._stockQuantity,
      cover_url: this._coverUrl,
      category_id: this._categoryId,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }
}
