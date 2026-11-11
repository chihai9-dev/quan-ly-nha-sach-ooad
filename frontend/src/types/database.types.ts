export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      // =======================================================================
      // 22 BẢNG THEO CLASS DIAGRAM (supabase/schema.sql)
      // =======================================================================
      vai_tro: {
        Row: {
          ma_vai_tro: string;
          ten_vai_tro: string;
          danh_sach_quyen: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          ma_vai_tro: string;
          ten_vai_tro: string;
          danh_sach_quyen?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ma_vai_tro?: string;
          ten_vai_tro?: string;
          danh_sach_quyen?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      nhan_vien: {
        Row: {
          ma_nv: string;
          ho_ten: string;
          so_dien_thoai: string | null;
          email: string | null;
          dia_chi: string | null;
          ngay_vao_lam: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          ma_nv: string;
          ho_ten: string;
          so_dien_thoai?: string | null;
          email?: string | null;
          dia_chi?: string | null;
          ngay_vao_lam?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ma_nv?: string;
          ho_ten?: string;
          so_dien_thoai?: string | null;
          email?: string | null;
          dia_chi?: string | null;
          ngay_vao_lam?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tai_khoan: {
        Row: {
          ten_dang_nhap: string;
          mat_khau_hash: string;
          email_khoi_phuc: string | null;
          trang_thai: boolean;
          ma_vai_tro: string;
          ma_nv: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          ten_dang_nhap: string;
          mat_khau_hash: string;
          email_khoi_phuc?: string | null;
          trang_thai?: boolean;
          ma_vai_tro: string;
          ma_nv: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ten_dang_nhap?: string;
          mat_khau_hash?: string;
          email_khoi_phuc?: string | null;
          trang_thai?: boolean;
          ma_vai_tro?: string;
          ma_nv?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      the_loai: {
        Row: {
          ma_the_loai: string;
          ten_the_loai: string;
          mo_ta: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          ma_the_loai: string;
          ten_the_loai: string;
          mo_ta?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ma_the_loai?: string;
          ten_the_loai?: string;
          mo_ta?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tac_gia: {
        Row: {
          ma_tac_gia: string;
          ten_tac_gia: string;
          tieu_su: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          ma_tac_gia: string;
          ten_tac_gia: string;
          tieu_su?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ma_tac_gia?: string;
          ten_tac_gia?: string;
          tieu_su?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      nha_xuat_ban: {
        Row: {
          ma_nxb: string;
          ten_nxb: string;
          dia_chi: string | null;
          so_dien_thoai: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          ma_nxb: string;
          ten_nxb: string;
          dia_chi?: string | null;
          so_dien_thoai?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ma_nxb?: string;
          ten_nxb?: string;
          dia_chi?: string | null;
          so_dien_thoai?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      chuong_trinh_khuyen_mai: {
        Row: {
          ma_ctkm: string;
          ten_ctkm: string;
          ngay_bat_dau: string;
          ngay_ket_thuc: string;
          phan_tram_giam: number;
          trang_thai: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          ma_ctkm: string;
          ten_ctkm: string;
          ngay_bat_dau: string;
          ngay_ket_thuc: string;
          phan_tram_giam?: number;
          trang_thai?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ma_ctkm?: string;
          ten_ctkm?: string;
          ngay_bat_dau?: string;
          ngay_ket_thuc?: string;
          phan_tram_giam?: number;
          trang_thai?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sach: {
        Row: {
          ma_sach: string;
          ten_sach: string;
          nam_xuat_ban: number | null;
          gia_nhap: number;
          gia_ban: number;
          so_luong_ton: number;
          muc_ton_toi_thieu: number;
          trang_thai: string;
          ma_the_loai: string;
          ma_nxb: string;
          ma_ctkm: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          ma_sach: string;
          ten_sach: string;
          nam_xuat_ban?: number | null;
          gia_nhap?: number;
          gia_ban: number;
          so_luong_ton?: number;
          muc_ton_toi_thieu?: number;
          trang_thai?: string;
          ma_the_loai: string;
          ma_nxb: string;
          ma_ctkm?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ma_sach?: string;
          ten_sach?: string;
          nam_xuat_ban?: number | null;
          gia_nhap?: number;
          gia_ban?: number;
          so_luong_ton?: number;
          muc_ton_toi_thieu?: number;
          trang_thai?: string;
          ma_the_loai?: string;
          ma_nxb?: string;
          ma_ctkm?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sach_tac_gia: {
        Row: {
          ma_sach: string;
          ma_tac_gia: string;
        };
        Insert: {
          ma_sach: string;
          ma_tac_gia: string;
        };
        Update: {
          ma_sach?: string;
          ma_tac_gia?: string;
        };
        Relationships: [];
      };
      phieu_kiem_ke: {
        Row: {
          ma_kiem_ke: string;
          ngay_kiem_ke: string;
          ghi_chu: string | null;
          ma_nv: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          ma_kiem_ke: string;
          ngay_kiem_ke?: string;
          ghi_chu?: string | null;
          ma_nv: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ma_kiem_ke?: string;
          ngay_kiem_ke?: string;
          ghi_chu?: string | null;
          ma_nv?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      chi_tiet_kiem_ke: {
        Row: {
          ma_kiem_ke: string;
          ma_sach: string;
          so_luong_he_thong: number;
          so_luong_thuc_te: number;
          chenh_lech: number;
          ly_do: string | null;
        };
        Insert: {
          ma_kiem_ke: string;
          ma_sach: string;
          so_luong_he_thong: number;
          so_luong_thuc_te: number;
          ly_do?: string | null;
        };
        Update: {
          ma_kiem_ke?: string;
          ma_sach?: string;
          so_luong_he_thong?: number;
          so_luong_thuc_te?: number;
          ly_do?: string | null;
        };
        Relationships: [];
      };
      nha_cung_cap: {
        Row: {
          ma_ncc: string;
          ten_ncc: string;
          so_dien_thoai: string | null;
          email: string | null;
          dia_chi: string | null;
          tong_cong_no: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          ma_ncc: string;
          ten_ncc: string;
          so_dien_thoai?: string | null;
          email?: string | null;
          dia_chi?: string | null;
          tong_cong_no?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ma_ncc?: string;
          ten_ncc?: string;
          so_dien_thoai?: string | null;
          email?: string | null;
          dia_chi?: string | null;
          tong_cong_no?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      phieu_nhap: {
        Row: {
          ma_phieu_nhap: string;
          ngay_nhap: string;
          tong_tien: number;
          da_thanh_toan: number;
          con_no: number;
          trang_thai: string;
          ma_ncc: string;
          ma_nv: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          ma_phieu_nhap: string;
          ngay_nhap?: string;
          tong_tien?: number;
          da_thanh_toan?: number;
          trang_thai?: string;
          ma_ncc: string;
          ma_nv: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ma_phieu_nhap?: string;
          ngay_nhap?: string;
          tong_tien?: number;
          da_thanh_toan?: number;
          trang_thai?: string;
          ma_ncc?: string;
          ma_nv?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      chi_tiet_phieu_nhap: {
        Row: {
          ma_phieu_nhap: string;
          ma_sach: string;
          so_luong_nhap: number;
          don_gia_nhap: number;
          thanh_tien: number;
        };
        Insert: {
          ma_phieu_nhap: string;
          ma_sach: string;
          so_luong_nhap: number;
          don_gia_nhap: number;
        };
        Update: {
          ma_phieu_nhap?: string;
          ma_sach?: string;
          so_luong_nhap?: number;
          don_gia_nhap?: number;
        };
        Relationships: [];
      };
      phieu_thanh_toan_ncc: {
        Row: {
          ma_thanh_toan_ncc: string;
          ngay_thanh_toan: string;
          so_tien_thanh_toan: number;
          phuong_thuc: string;
          ghi_chu: string | null;
          ma_ncc: string;
          ma_phieu_nhap: string | null;
          ma_nv: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          ma_thanh_toan_ncc: string;
          ngay_thanh_toan?: string;
          so_tien_thanh_toan: number;
          phuong_thuc: string;
          ghi_chu?: string | null;
          ma_ncc: string;
          ma_phieu_nhap?: string | null;
          ma_nv: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ma_thanh_toan_ncc?: string;
          ngay_thanh_toan?: string;
          so_tien_thanh_toan?: number;
          phuong_thuc?: string;
          ghi_chu?: string | null;
          ma_ncc?: string;
          ma_phieu_nhap?: string | null;
          ma_nv?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      khach_hang: {
        Row: {
          ma_kh: string;
          ho_ten: string;
          so_dien_thoai: string | null;
          email: string | null;
          diem_tich_luy: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          ma_kh: string;
          ho_ten: string;
          so_dien_thoai?: string | null;
          email?: string | null;
          diem_tich_luy?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ma_kh?: string;
          ho_ten?: string;
          so_dien_thoai?: string | null;
          email?: string | null;
          diem_tich_luy?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ma_giam_gia: {
        Row: {
          ma_code: string;
          gia_tri_giam: number;
          don_toi_thieu: number;
          so_luong_con_lai: number;
          han_su_dung: string;
          ma_ctkm: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          ma_code: string;
          gia_tri_giam: number;
          don_toi_thieu?: number;
          so_luong_con_lai?: number;
          han_su_dung: string;
          ma_ctkm: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ma_code?: string;
          gia_tri_giam?: number;
          don_toi_thieu?: number;
          so_luong_con_lai?: number;
          han_su_dung?: string;
          ma_ctkm?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      hoa_don: {
        Row: {
          ma_hoa_don: string;
          ngay_lap: string;
          tong_tien_hang: number;
          tien_giam_gia: number;
          thanh_toan_cuoi: number;
          trang_thai: string;
          ma_kh: string | null;
          ma_nv: string;
          ma_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          ma_hoa_don: string;
          ngay_lap?: string;
          tong_tien_hang?: number;
          tien_giam_gia?: number;
          trang_thai?: string;
          ma_kh?: string | null;
          ma_nv: string;
          ma_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ma_hoa_don?: string;
          ngay_lap?: string;
          tong_tien_hang?: number;
          tien_giam_gia?: number;
          trang_thai?: string;
          ma_kh?: string | null;
          ma_nv?: string;
          ma_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      chi_tiet_hoa_don: {
        Row: {
          ma_hoa_don: string;
          ma_sach: string;
          so_luong_ban: number;
          don_gia_ban: number;
          giam_gia: number;
          thanh_tien: number;
        };
        Insert: {
          ma_hoa_don: string;
          ma_sach: string;
          so_luong_ban: number;
          don_gia_ban: number;
          giam_gia?: number;
        };
        Update: {
          ma_hoa_don?: string;
          ma_sach?: string;
          so_luong_ban?: number;
          don_gia_ban?: number;
          giam_gia?: number;
        };
        Relationships: [];
      };
      thanh_toan: {
        Row: {
          ma_thanh_toan: string;
          ngay_thanh_toan: string;
          so_tien: number;
          phuong_thuc: string;
          trang_thai: string;
          ma_hoa_don: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          ma_thanh_toan: string;
          ngay_thanh_toan?: string;
          so_tien: number;
          phuong_thuc: string;
          trang_thai?: string;
          ma_hoa_don: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ma_thanh_toan?: string;
          ngay_thanh_toan?: string;
          so_tien?: number;
          phuong_thuc?: string;
          trang_thai?: string;
          ma_hoa_don?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      phieu_doi_tra: {
        Row: {
          ma_doi_tra: string;
          ngay_doi_tra: string;
          ly_do: string;
          hinh_thuc_xu_ly: string;
          tien_hoan_tra: number;
          ma_hoa_don: string;
          ma_nv: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          ma_doi_tra: string;
          ngay_doi_tra?: string;
          ly_do: string;
          hinh_thuc_xu_ly: string;
          tien_hoan_tra?: number;
          ma_hoa_don: string;
          ma_nv: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ma_doi_tra?: string;
          ngay_doi_tra?: string;
          ly_do?: string;
          hinh_thuc_xu_ly?: string;
          tien_hoan_tra?: number;
          ma_hoa_don?: string;
          ma_nv?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      chi_tiet_doi_tra: {
        Row: {
          ma_doi_tra: string;
          ma_sach: string;
          so_luong_tra: number;
          tinh_trang_sach: string;
          don_gia_hoan: number;
        };
        Insert: {
          ma_doi_tra: string;
          ma_sach: string;
          so_luong_tra: number;
          tinh_trang_sach: string;
          don_gia_hoan?: number;
        };
        Update: {
          ma_doi_tra?: string;
          ma_sach?: string;
          so_luong_tra?: number;
          tinh_trang_sach?: string;
          don_gia_hoan?: number;
        };
        Relationships: [];
      };

      // =======================================================================
      // CÁC BẢNG PHỤC VỤ REPOSITORIES HIỆN CÓ (GIỮ TƯƠNG THÍCH NGƯỢC)
      // =======================================================================
      categories: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      books: {
        Row: {
          id: string;
          isbn: string;
          title: string;
          author: string;
          publisher: string | null;
          publish_year: number | null;
          price: number;
          stock_quantity: number;
          cover_url: string | null;
          category_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          isbn: string;
          title: string;
          author: string;
          publisher?: string | null;
          publish_year?: number | null;
          price: number;
          stock_quantity?: number;
          cover_url?: string | null;
          category_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          isbn?: string;
          title?: string;
          author?: string;
          publisher?: string | null;
          publish_year?: number | null;
          price?: number;
          stock_quantity?: number;
          cover_url?: string | null;
          category_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          full_name: string;
          phone_number: string;
          email: string | null;
          loyalty_points: number;
          tier: 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          phone_number: string;
          email?: string | null;
          loyalty_points?: number;
          tier?: 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone_number?: string;
          email?: string | null;
          loyalty_points?: number;
          tier?: 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_code: string;
          customer_id: string | null;
          status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
          subtotal: number;
          discount_amount: number;
          tax_amount: number;
          total_amount: number;
          cashier_name: string | null;
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_code: string;
          customer_id?: string | null;
          status?: 'PENDING' | 'COMPLETED' | 'CANCELLED';
          subtotal?: number;
          discount_amount?: number;
          tax_amount?: number;
          total_amount?: number;
          cashier_name?: string | null;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_code?: string;
          customer_id?: string | null;
          status?: 'PENDING' | 'COMPLETED' | 'CANCELLED';
          subtotal?: number;
          discount_amount?: number;
          tax_amount?: number;
          total_amount?: number;
          cashier_name?: string | null;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          book_id: string;
          quantity: number;
          unit_price: number;
          subtotal: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          book_id: string;
          quantity: number;
          unit_price: number;
          subtotal: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          book_id?: string;
          quantity?: number;
          unit_price?: number;
          subtotal?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'order_items_book_id_fkey';
            columns: ['book_id'];
            isOneToOne: false;
            referencedRelation: 'books';
            referencedColumns: ['id'];
          },
        ];
      };
      invoices: {
        Row: {
          id: string;
          invoice_code: string;
          order_id: string;
          payment_method: 'CASH' | 'BANK_TRANSFER' | 'MOMO' | 'CARD';
          paid_amount: number;
          change_amount: number;
          payment_status: 'PAID' | 'REFUNDED';
          issued_at: string;
        };
        Insert: {
          id?: string;
          invoice_code: string;
          order_id: string;
          payment_method: 'CASH' | 'BANK_TRANSFER' | 'MOMO' | 'CARD';
          paid_amount: number;
          change_amount?: number;
          payment_status?: 'PAID' | 'REFUNDED';
          issued_at?: string;
        };
        Update: {
          id?: string;
          invoice_code?: string;
          order_id?: string;
          payment_method?: 'CASH' | 'BANK_TRANSFER' | 'MOMO' | 'CARD';
          paid_amount?: number;
          change_amount?: number;
          payment_status?: 'PAID' | 'REFUNDED';
          issued_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
