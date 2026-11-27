import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { bookstoreStore } from '@/lib/mock/bookstoreStore';
import { ChuongTrinhKhuyenMai } from '@/models/ChuongTrinhKhuyenMai';
import { MaGiamGia } from '@/models/MaGiamGia';
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

/**
 * Triển khai PromotionRepository kết nối bảng `chuong_trinh_khuyen_mai` & `ma_giam_gia` trên Supabase
 * (có fallback sang `bookstoreStore`).
 */
export class PromotionRepository implements IPromotionRepository {
  async getPromotions(): Promise<PromotionCampaignDTO[]> {
    if (!isSupabaseConfigured()) {
      return [...bookstoreStore.promotions];
    }

    try {
      const { data, error } = await supabase
        .from('chuong_trinh_khuyen_mai')
        .select('*')
        .order('ngay_bat_dau', { ascending: false });
      if (error || !data) return [...bookstoreStore.promotions];

      return data.map((row) => {
        const entity = new ChuongTrinhKhuyenMai({
          maCTKM: row.ma_ctkm,
          tenCTKM: row.ten_ctkm,
          ngayBatDau: row.ngay_bat_dau,
          ngayKetThuc: row.ngay_ket_thuc,
          phanTramGiam: Number(row.phan_tram_giam),
          trangThai: row.trang_thai,
        });
        return {
          id: entity.maCTKM,
          code: entity.maCTKM,
          name: entity.tenCTKM,
          discountType: 'PERCENT',
          discountValue: entity.phanTramGiam,
          scope: 'ALL',
          startDate: row.ngay_bat_dau,
          endDate: row.ngay_ket_thuc,
          status: entity.layTrangThaiChienDich(),
        };
      });
    } catch {
      return [...bookstoreStore.promotions];
    }
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

    const maCTKM = (dto.code?.trim() || `KM-${Date.now().toString().slice(-5)}`).toUpperCase();
    const phanTram = dto.discountType === 'PERCENT' ? dto.discountValue : 0;
    const entity = new ChuongTrinhKhuyenMai({
      maCTKM,
      tenCTKM: dto.name,
      ngayBatDau: dto.startDate,
      ngayKetThuc: dto.endDate,
      phanTramGiam: phanTram,
      trangThai: true,
    });

    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('chuong_trinh_khuyen_mai').insert({
        ma_ctkm: entity.maCTKM,
        ten_ctkm: entity.tenCTKM,
        ngay_bat_dau: dto.startDate,
        ngay_ket_thuc: dto.endDate,
        phan_tram_giam: phanTram,
        trang_thai: true,
      });
      if (error) throw new Error(`Không thể tạo CTKM trong CSDL: ${error.message}`);
      return {
        id: entity.maCTKM,
        code: entity.maCTKM,
        name: entity.tenCTKM,
        discountType: dto.discountType,
        discountValue: dto.discountValue,
        scope: dto.scope,
        startDate: dto.startDate,
        endDate: dto.endDate,
        status: entity.layTrangThaiChienDich(),
        description: dto.description?.trim(),
      };
    }

    const item: PromotionCampaignDTO = {
      id: entity.maCTKM,
      code: entity.maCTKM,
      name: entity.tenCTKM,
      discountType: dto.discountType,
      discountValue: dto.discountValue,
      scope: dto.scope,
      startDate: dto.startDate,
      endDate: dto.endDate,
      status: entity.layTrangThaiChienDich(),
      description: dto.description?.trim(),
    };
    bookstoreStore.promotions.unshift(item);
    return item;
  }

  async stopPromotion(id: string): Promise<PromotionCampaignDTO> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('chuong_trinh_khuyen_mai')
        .update({ trang_thai: false, updated_at: new Date().toISOString() })
        .eq('ma_ctkm', id);
      if (error) throw new Error(`Không thể ngừng CTKM: ${error.message}`);
      const all = await this.getPromotions();
      const updated = all.find((p) => p.id === id);
      if (!updated) throw new Error('Không tìm thấy chương trình khuyến mãi.');
      return updated;
    }

    const found = bookstoreStore.promotions.find((p) => p.id === id);
    if (!found) throw new Error('Không tìm thấy chương trình khuyến mãi.');
    found.status = 'STOPPED';
    return found;
  }

  async getCoupons(): Promise<DiscountCouponDTO[]> {
    if (!isSupabaseConfigured()) {
      return [...bookstoreStore.coupons];
    }

    try {
      const { data, error } = await supabase
        .from('ma_giam_gia')
        .select('*')
        .order('han_su_dung', { ascending: false });
      if (error || !data) return [...bookstoreStore.coupons];

      return data.map((row) => {
        const entity = new MaGiamGia({
          maCode: row.ma_code,
          giaTriGiam: Number(row.gia_tri_giam),
          donToiThieu: Number(row.don_toi_thieu),
          soLuongConLai: row.so_luong_con_lai,
          hanSuDung: row.han_su_dung,
        });
        return {
          id: entity.maCode,
          code: entity.maCode,
          discountAmount: entity.giaTriGiam,
          minOrderAmount: entity.donToiThieu,
          maxUses: entity.soLuongConLai,
          usedCount: 0,
          expiryDate: row.han_su_dung,
          isActive: entity.layTrangThaiMa() === 'CON_HIEU_LUC',
        };
      });
    } catch {
      return [...bookstoreStore.coupons];
    }
  }

  async createCoupon(dto: CreateCouponDTO): Promise<DiscountCouponDTO> {
    const code = dto.code.trim().toUpperCase();
    const entity = new MaGiamGia({
      maCode: code,
      giaTriGiam: dto.discountAmount,
      donToiThieu: dto.minOrderAmount,
      soLuongConLai: dto.maxUses,
      hanSuDung: dto.expiryDate,
    });

    if (isSupabaseConfigured()) {
      const promos = await this.getPromotions();
      const maCtkm = promos[0]?.id;
      if (!maCtkm) {
        throw new Error('Cần có ít nhất 1 chương trình khuyến mãi trước khi phát hành mã giảm giá.');
      }

      const { error } = await supabase.from('ma_giam_gia').insert({
        ma_code: entity.maCode,
        gia_tri_giam: entity.giaTriGiam,
        don_toi_thieu: entity.donToiThieu,
        so_luong_con_lai: entity.soLuongConLai,
        han_su_dung: dto.expiryDate,
        ma_ctkm: maCtkm,
      });
      if (error) throw new Error(`Không thể tạo mã giảm giá trong CSDL: ${error.message}`);
      return {
        id: entity.maCode,
        code: entity.maCode,
        discountAmount: entity.giaTriGiam,
        minOrderAmount: entity.donToiThieu,
        maxUses: entity.soLuongConLai,
        usedCount: 0,
        expiryDate: dto.expiryDate,
        isActive: true,
      };
    }

    if (bookstoreStore.coupons.some((c) => c.code === code)) {
      throw new Error(`Mã giảm giá "${code}" đã tồn tại.`);
    }
    const coupon: DiscountCouponDTO = {
      id: entity.maCode,
      code: entity.maCode,
      discountAmount: entity.giaTriGiam,
      minOrderAmount: entity.donToiThieu,
      maxUses: entity.soLuongConLai,
      usedCount: 0,
      expiryDate: dto.expiryDate,
      isActive: true,
    };
    bookstoreStore.coupons.unshift(coupon);
    return coupon;
  }

  async validateCoupon(code: string, orderSubtotal: number): Promise<ValidateCouponResultDTO> {
    const clean = code.trim().toUpperCase();
    const coupons = await this.getCoupons();
    const found = coupons.find((c) => c.code === clean);
    if (!found) {
      return { valid: false, discountAmount: 0, message: `Mã "${clean}" không tồn tại.` };
    }

    const remaining = Math.max(0, found.maxUses - found.usedCount);
    const entity = new MaGiamGia({
      maCode: found.code,
      giaTriGiam: found.discountAmount,
      donToiThieu: found.minOrderAmount,
      soLuongConLai: remaining,
      hanSuDung: found.expiryDate,
    });

    const state = entity.layTrangThaiMa();
    if (!found.isActive || state === 'HET_HAN') {
      return { valid: false, discountAmount: 0, message: `Mã "${clean}" đã hết hạn hoặc bị khóa.` };
    }
    if (state === 'HET_LUOT') {
      return { valid: false, discountAmount: 0, message: `Mã "${clean}" đã hết lượt sử dụng.` };
    }
    if (!entity.kiemTraHopLe(orderSubtotal)) {
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
