import { BaseEntity } from './BaseEntity';
import type { CustomerTier } from '@/types/dtos';
import type { Database } from '@/types/database.types';

export interface CustomerProps {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  loyaltyPoints?: number;
  tier?: CustomerTier;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Lớp Thực thể Khách hàng (Customer Entity)
 * Quản lý thông tin hội viên, tích điểm và chính sách ưu đãi thành viên.
 */
export class Customer extends BaseEntity {
  private _fullName: string;
  private _phoneNumber: string;
  private _email: string | null;
  private _loyaltyPoints: number;
  private _tier: CustomerTier;

  constructor(props: CustomerProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._fullName = props.fullName.trim();
    this._phoneNumber = props.phoneNumber.trim();
    this._email = props.email?.trim() || null;
    this._loyaltyPoints = props.loyaltyPoints ?? 0;
    this._tier = props.tier ?? 'STANDARD';
    this.refreshTier();
  }

  public get fullName(): string {
    return this._fullName;
  }

  public get phoneNumber(): string {
    return this._phoneNumber;
  }

  public get email(): string | null {
    return this._email;
  }

  public get loyaltyPoints(): number {
    return this._loyaltyPoints;
  }

  public get tier(): CustomerTier {
    return this._tier;
  }

  /**
   * Tích điểm thưởng dựa trên số tiền chi tiêu (Quy ước: 10,000 VNĐ = 1 điểm)
   */
  public addPointsFromSpending(amount: number): number {
    if (amount <= 0) return 0;
    const earnedPoints = Math.floor(amount / 10000);
    this._loyaltyPoints += earnedPoints;
    this.refreshTier();
    this.touch();
    return earnedPoints;
  }

  /**
   * Tự động cập nhật hạng thành viên dựa trên điểm tích lũy
   */
  private refreshTier(): void {
    if (this._loyaltyPoints >= 1000) {
      this._tier = 'PLATINUM';
    } else if (this._loyaltyPoints >= 500) {
      this._tier = 'GOLD';
    } else if (this._loyaltyPoints >= 100) {
      this._tier = 'SILVER';
    } else {
      this._tier = 'STANDARD';
    }
  }

  /**
   * Lấy tỷ lệ giảm giá theo hạng thành viên
   */
  public getDiscountRate(): number {
    switch (this._tier) {
      case 'PLATINUM':
        return 0.15; // Giảm 15%
      case 'GOLD':
        return 0.10; // Giảm 10%
      case 'SILVER':
        return 0.05; // Giảm 5%
      case 'STANDARD':
      default:
        return 0.0;
    }
  }

  public static fromDatabase(row: Database['public']['Tables']['customers']['Row']): Customer {
    return new Customer({
      id: row.id,
      fullName: row.full_name,
      phoneNumber: row.phone_number,
      email: row.email,
      loyaltyPoints: row.loyalty_points,
      tier: row.tier as CustomerTier,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
