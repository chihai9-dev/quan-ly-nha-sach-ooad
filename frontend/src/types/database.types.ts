export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
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
      };
    };
  };
}
