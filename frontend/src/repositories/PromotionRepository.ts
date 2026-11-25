import { bookstoreStore } from '@/lib/mock/bookstoreStore';
import type {
  CreateCouponDTO,
  CreatePromotionDTO,
  DiscountCouponDTO,
  PromotionCampaignDTO,
  ValidateCouponResultDTO,
} from '@/types/dtos';

export interface IPromotionRepository {
  getPromotions(): Promise<PromotionCampaignDTO[]>;
  createPromotion(dto: CreatePromotionDTO): Promise<PromotionCampaignDTO>;
  stopPromotion(id: string): Promise<PromotionCampaignDTO>;
  getCoupons(): Promise<DiscountCouponDTO[]>;
  createCoupon(dto: CreateCouponDTO): Promise<DiscountCouponDTO>;
  validateCoupon(code: string, orderSubtotal: number): Promise<ValidateCouponResultDTO>;
}

export class PromotionRepository implements IPromotionRepository {
  async getPromotions(): Promise<PromotionCampaignDTO[]> {
    return [...bookstoreStore.promotions];
  }

  async createPromotion(dto: CreatePromotionDTO): Promise<PromotionCampaignDTO> {
    if (!dto.name.trim()) throw new Error('Tên chương trình khuyến mãi không được để trống.');
    if (dto.endDate < dto.startDate) throw new Error('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.');
    if (dto.discountType === 'PERCENT' && (dto.discountValue <= 0 || dto.discountValue > 100)) {
      throw new Error('Phần trăm giảm giá phải nằm trong khoảng 1% - 100%.');
    }
    if (dto.discountType === 'FIXED' && dto.discountValue <= 0) {
      throw new Error('Số tiền giảm cố định phải lớn hơn 0.');
    }

    const today = new Date().toISOString().slice(0, 10);
    const status: PromotionCampaignDTO['status'] =
      dto.startDate > today ? 'UPCOMING' : dto.endDate < today ? 'ENDED' : 'ACTIVE';

    const item: PromotionCampaignDTO = {
      id: `km-${Date.now()}`,
      code: (dto.code?.trim() || `KM-${bookstoreStore.promotions.length + 1}`).toUpperCase(),
      name: dto.name.trim(),
      discountType: dto.discountType,
      discountValue: dto.discountValue,
      scope: dto.scope,
      startDate: dto.startDate,
      endDate: dto.endDate,
      status,
      description: dto.description?.trim(),
    };
    bookstoreStore.promotions.unshift(item);
    return item;
  }

  async stopPromotion(id: string): Promise<PromotionCampaignDTO> {
    const found = bookstoreStore.promotions.find((p) => p.id === id);
    if (!found) throw new Error('Không tìm thấy chương trình khuyến mãi.');
    found.status = 'STOPPED';
    return found;
  }

  async getCoupons(): Promise<DiscountCouponDTO[]> {
    return [...bookstoreStore.coupons];
  }

  async createCoupon(dto: CreateCouponDTO): Promise<DiscountCouponDTO> {
    const code = dto.code.trim().toUpperCase();
    if (!code) throw new Error('Mã giảm giá không được để trống.');
    if (bookstoreStore.coupons.some((c) => c.code === code)) {
      throw new Error(`Mã giảm giá "${code}" đã tồn tại.`);
    }
    if (dto.discountAmount <= 0) throw new Error('Giá trị giảm của mã phải lớn hơn 0.');
    if (dto.minOrderAmount < 0) throw new Error('Giá trị đơn tối thiểu không được âm.');
    if (dto.maxUses <= 0) throw new Error('Số lượt sử dụng tối đa phải lớn hơn 0.');

    const coupon: DiscountCouponDTO = {
      id: `cp-${Date.now()}`,
      code,
      discountAmount: dto.discountAmount,
      minOrderAmount: dto.minOrderAmount,
      maxUses: dto.maxUses,
      usedCount: 0,
      expiryDate: dto.expiryDate,
      isActive: true,
    };
    bookstoreStore.coupons.unshift(coupon);
    return coupon;
  }

  async validateCoupon(code: string, orderSubtotal: number): Promise<ValidateCouponResultDTO> {
    const clean = code.trim().toUpperCase();
    const found = bookstoreStore.coupons.find((c) => c.code === clean);
    if (!found) {
      return { valid: false, discountAmount: 0, message: `Mã "${clean}" không tồn tại.` };
    }
    const today = new Date().toISOString().slice(0, 10);
    if (!found.isActive || found.expiryDate < today) {
      return { valid: false, discountAmount: 0, message: `Mã "${clean}" đã hết hạn hoặc bị khóa.` };
    }
    if (found.usedCount >= found.maxUses) {
      return { valid: false, discountAmount: 0, message: `Mã "${clean}" đã hết lượt sử dụng.` };
    }
    if (orderSubtotal < found.minOrderAmount) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Đơn hàng tối thiểu ${found.minOrderAmount.toLocaleString('vi-VN')} đ để áp dụng mã "${clean}".`,
      };
    }
    return {
      valid: true,
      discountAmount: found.discountAmount,
      message: `Áp dụng mã ${clean}: giảm ${found.discountAmount.toLocaleString('vi-VN')} đ.`,
      coupon: found,
    };
  }
}
