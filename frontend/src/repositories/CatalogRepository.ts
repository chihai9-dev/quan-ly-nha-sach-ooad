import { bookstoreStore } from '@/lib/mock/bookstoreStore';
import type { AuthorDTO, CategoryDTO, PublisherDTO } from '@/types/dtos';

export interface ICatalogRepository {
  getCategories(): Promise<CategoryDTO[]>;
  createCategory(input: Omit<CategoryDTO, 'id'>): Promise<CategoryDTO>;
  toggleCategoryStatus(id: string): Promise<CategoryDTO>;
  getAuthors(): Promise<AuthorDTO[]>;
  createAuthor(input: Omit<AuthorDTO, 'id'>): Promise<AuthorDTO>;
  getPublishers(): Promise<PublisherDTO[]>;
  createPublisher(input: Omit<PublisherDTO, 'id'>): Promise<PublisherDTO>;
}

export class CatalogRepository implements ICatalogRepository {
  async getCategories(): Promise<CategoryDTO[]> {
    return [...bookstoreStore.categories];
  }

  async createCategory(input: Omit<CategoryDTO, 'id'>): Promise<CategoryDTO> {
    const item: CategoryDTO = { id: `cat-${Date.now()}`, ...input };
    bookstoreStore.categories.unshift(item);
    return item;
  }

  async toggleCategoryStatus(id: string): Promise<CategoryDTO> {
    const found = bookstoreStore.categories.find((c) => c.id === id);
    if (!found) throw new Error('Không tìm thấy thể loại sách.');
    found.isActive = !found.isActive;
    return found;
  }

  async getAuthors(): Promise<AuthorDTO[]> {
    return [...bookstoreStore.authors];
  }

  async createAuthor(input: Omit<AuthorDTO, 'id'>): Promise<AuthorDTO> {
    const item: AuthorDTO = { id: `aut-${Date.now()}`, ...input };
    bookstoreStore.authors.unshift(item);
    return item;
  }

  async getPublishers(): Promise<PublisherDTO[]> {
    return [...bookstoreStore.publishers];
  }

  async createPublisher(input: Omit<PublisherDTO, 'id'>): Promise<PublisherDTO> {
    const item: PublisherDTO = { id: `pub-${Date.now()}`, ...input };
    bookstoreStore.publishers.unshift(item);
    return item;
  }
}
