import { supabase } from '@/lib/supabase/client';
import { Book } from '@/models/Book';
import { IBookRepository } from './IBookRepository';
import type { BookFilterParams, CreateBookDTO, UpdateBookDTO } from '@/types/dtos';

/**
 * Triển khai BookRepository sử dụng Supabase Client
 */
export class BookRepository implements IBookRepository {
  /**
   * Lấy danh sách sách có hỗ trợ tìm kiếm và lọc danh mục
   */
  async findAll(filter?: BookFilterParams): Promise<Book[]> {
    try {
      let query = supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter?.categoryId) {
        query = query.eq('category_id', filter.categoryId);
      }

      if (filter?.inStockOnly) {
        query = query.gt('stock_quantity', 0);
      }

      if (filter?.searchTerm) {
        query = query.or(`title.ilike.%${filter.searchTerm}%,author.ilike.%${filter.searchTerm}%,isbn.ilike.%${filter.searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.warn('Lỗi khi truy vấn Supabase books:', error.message);
        return this.getMockBooks();
      }

      if (!data || data.length === 0) {
        return this.getMockBooks();
      }

      return data.map(row => Book.fromDatabase(row));
    } catch (err) {
      console.warn('Lỗi kết nối Supabase, đang hiển thị dữ liệu mẫu:', err);
      return this.getMockBooks();
    }
  }

  async findById(id: string): Promise<Book | null> {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return Book.fromDatabase(data);
  }

  async findByIsbn(isbn: string): Promise<Book | null> {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('isbn', isbn)
      .single();

    if (error || !data) return null;
    return Book.fromDatabase(data);
  }

  async create(dto: CreateBookDTO): Promise<Book> {
    const { data, error } = await supabase
      .from('books')
      .insert({
        isbn: dto.isbn,
        title: dto.title,
        author: dto.author,
        publisher: dto.publisher || null,
        publish_year: dto.publishYear || null,
        price: dto.price,
        stock_quantity: dto.stockQuantity,
        cover_url: dto.coverUrl || null,
        category_id: dto.categoryId || null,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Không thể tạo sách mới: ${error?.message}`);
    }

    return Book.fromDatabase(data);
  }

  async update(dto: UpdateBookDTO): Promise<Book> {
    const { data, error } = await supabase
      .from('books')
      .update({
        isbn: dto.isbn,
        title: dto.title,
        author: dto.author,
        publisher: dto.publisher,
        publish_year: dto.publishYear,
        price: dto.price,
        stock_quantity: dto.stockQuantity,
        cover_url: dto.coverUrl,
        category_id: dto.categoryId,
      })
      .eq('id', dto.id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Không thể cập nhật sách: ${error?.message}`);
    }

    return Book.fromDatabase(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    return !error;
  }

  async updateStock(bookId: string, remainingStock: number): Promise<void> {
    const { error } = await supabase
      .from('books')
      .update({ stock_quantity: remainingStock })
      .eq('id', bookId);

    if (error) {
      throw new Error(`Lỗi cập nhật tồn kho: ${error.message}`);
    }
  }

  /**
   * Dữ liệu mẫu (Fallback mock data khi chưa kết nối Supabase)
   */
  private getMockBooks(): Book[] {
    return [
      new Book({
        id: 'b1111111-1111-1111-1111-111111111111',
        isbn: '978-0132350884',
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        publisher: 'Prentice Hall',
        publishYear: 2008,
        price: 320000,
        stockQuantity: 25,
        coverUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=500&q=80',
        categoryId: 'c1111111-1111-1111-1111-111111111111',
      }),
      new Book({
        id: 'b2222222-2222-2222-2222-222222222222',
        isbn: '978-0201633610',
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        author: 'Erich Gamma et al. (GoF)',
        publisher: 'Addison-Wesley',
        publishYear: 1994,
        price: 450000,
        stockQuantity: 15,
        coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
        categoryId: 'c1111111-1111-1111-1111-111111111111',
      }),
      new Book({
        id: 'b3333333-3333-3333-3333-333333333333',
        isbn: '978-0134494166',
        title: 'Clean Architecture: A Craftsman Guide to Software Structure',
        author: 'Robert C. Martin',
        publisher: 'Prentice Hall',
        publishYear: 2017,
        price: 380000,
        stockQuantity: 18,
        coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80',
        categoryId: 'c1111111-1111-1111-1111-111111111111',
      }),
      new Book({
        id: 'b4444444-4444-4444-4444-444444444444',
        isbn: '978-0062316097',
        title: 'Sapiens: Lược Sử Loài Người',
        author: 'Yuval Noah Harari',
        publisher: 'NXB Tri Thức',
        publishYear: 2014,
        price: 210000,
        stockQuantity: 40,
        coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80',
        categoryId: 'c3333333-3333-3333-3333-333333333333',
      }),
      new Book({
        id: 'b5555555-5555-5555-5555-555555555555',
        isbn: '978-0743273565',
        title: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        publisher: 'NXB Tổng hợp TP.HCM',
        publishYear: 2016,
        price: 120000,
        stockQuantity: 50,
        coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
        categoryId: 'c4444444-4444-4444-4444-444444444444',
      }),
    ];
  }
}
