import { PromotionRepository, type IPromotionRepository } from '@/repositories/PromotionRepository';
import type {
  CreateCouponDTO,
  CreatePromotionDTO,
  DiscountCouponDTO,
  PromotionCampaignDTO,
  ValidateCouponResultDTO,
} from '@/types/dtos';

export class PromotionService {
  private readonly repo: IPromotionRepository;

  constructor(repo: IPromotionRepository = new PromotionRepository()) {
    this.repo = repo;
  }

  async getAll(): Promise<{ promotions: PromotionCampaignDTO[]; coupons: DiscountCouponDTO[] }> {
    const [promotions, coupons] = await Promise.all([
      this.repo.getPromotions(),
      this.repo.getCoupons(),
    ]);
    return { promotions, coupons };
  }

  async createPromotion(dto: CreatePromotionDTO): Promise<PromotionCampaignDTO> {
    return this.repo.createPromotion(dto);
  }

  async stopPromotion(id: string): Promise<PromotionCampaignDTO> {
    return this.repo.stopPromotion(id);
  }

  async createCoupon(dto: CreateCouponDTO): Promise<DiscountCouponDTO> {
    return this.repo.createCoupon(dto);
  }

  async validateCoupon(code: string, orderSubtotal: number): Promise<ValidateCouponResultDTO> {
    return this.repo.validateCoupon(code, orderSubtotal);
  }
}
