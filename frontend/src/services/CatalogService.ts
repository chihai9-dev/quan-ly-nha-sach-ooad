import { CatalogRepository, type ICatalogRepository } from '@/repositories/CatalogRepository';
import type { AuthorDTO, CategoryDTO, PublisherDTO } from '@/types/dtos';

export class CatalogService {
  private readonly repo: ICatalogRepository;

  constructor(repo: ICatalogRepository = new CatalogRepository()) {
    this.repo = repo;
  }

  async getAllCatalog(): Promise<{
    categories: CategoryDTO[];
    authors: AuthorDTO[];
    publishers: PublisherDTO[];
  }> {
    const [categories, authors, publishers] = await Promise.all([
      this.repo.getCategories(),
      this.repo.getAuthors(),
      this.repo.getPublishers(),
    ]);
    return { categories, authors, publishers };
  }

  async addCategory(code: string, name: string, description: string): Promise<CategoryDTO> {
    if (!code.trim() || !name.trim()) {
      throw new Error('Mã thể loại và tên thể loại không được để trống.');
    }
    const existing = await this.repo.getCategories();
    if (existing.some((c) => c.code.toLowerCase() === code.trim().toLowerCase())) {
      throw new Error(`Mã thể loại "${code.trim()}" đã tồn tại.`);
    }
    return this.repo.createCategory({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      isActive: true,
    });
  }

  async toggleCategoryStatus(id: string): Promise<CategoryDTO> {
    return this.repo.toggleCategoryStatus(id);
  }

  async addAuthor(name: string, penName: string, nationality: string, biography: string): Promise<AuthorDTO> {
    if (!name.trim()) throw new Error('Tên tác giả không được để trống.');
    return this.repo.createAuthor({
      name: name.trim(),
      penName: penName.trim() || name.trim(),
      nationality: nationality.trim() || 'Việt Nam',
      biography: biography.trim(),
    });
  }

  async addPublisher(name: string, address: string, phoneNumber: string, contactPerson: string): Promise<PublisherDTO> {
    if (!name.trim()) throw new Error('Tên nhà xuất bản không được để trống.');
    return this.repo.createPublisher({
      name: name.trim(),
      address: address.trim(),
      phoneNumber: phoneNumber.trim(),
      contactPerson: contactPerson.trim(),
    });
  }
}
