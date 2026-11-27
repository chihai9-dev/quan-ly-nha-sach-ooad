import { CatalogRepository, type ICatalogRepository } from '@/repositories/CatalogRepository';
import type { AuthorDTO, CategoryDTO, PublisherDTO } from '@/types/dtos';

export class CatalogService {
  private readonly repo: ICatalogRepository;

  constructor(repo: ICatalogRepository = new CatalogRepository()) {
    this.repo = repo;
  }

  async getAllCatalog(searchTerm?: string): Promise<{
    categories: CategoryDTO[];
    authors: AuthorDTO[];
    publishers: PublisherDTO[];
  }> {
    const [categories, authors, publishers] = await Promise.all([
      this.repo.getCategories(),
      this.repo.getAuthors(),
      this.repo.getPublishers(),
    ]);

    const kw = searchTerm?.trim().toLowerCase();
    if (!kw) return { categories, authors, publishers };

    return {
      categories: categories.filter(
        (c) =>
          c.code.toLowerCase().includes(kw) ||
          c.name.toLowerCase().includes(kw) ||
          c.description.toLowerCase().includes(kw)
      ),
      authors: authors.filter(
        (a) =>
          a.name.toLowerCase().includes(kw) ||
          (a.penName ?? '').toLowerCase().includes(kw) ||
          a.biography.toLowerCase().includes(kw)
      ),
      publishers: publishers.filter(
        (p) =>
          p.name.toLowerCase().includes(kw) ||
          p.address.toLowerCase().includes(kw) ||
          p.phoneNumber.includes(kw)
      ),
    };
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

  async updateCategory(id: string, name: string, description: string): Promise<CategoryDTO> {
    if (!name.trim()) throw new Error('Tên thể loại không được để trống.');
    return this.repo.updateCategory(id, { name: name.trim(), description: description.trim() });
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.repo.deleteCategory(id);
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

  async updateAuthor(
    id: string,
    name: string,
    penName: string,
    nationality: string,
    biography: string
  ): Promise<AuthorDTO> {
    if (!name.trim()) throw new Error('Tên tác giả không được để trống.');
    return this.repo.updateAuthor(id, {
      name: name.trim(),
      penName: penName.trim() || name.trim(),
      nationality: nationality.trim() || 'Việt Nam',
      biography: biography.trim(),
    });
  }

  async deleteAuthor(id: string): Promise<boolean> {
    return this.repo.deleteAuthor(id);
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

  async updatePublisher(
    id: string,
    name: string,
    address: string,
    phoneNumber: string,
    contactPerson: string
  ): Promise<PublisherDTO> {
    if (!name.trim()) throw new Error('Tên nhà xuất bản không được để trống.');
    return this.repo.updatePublisher(id, {
      name: name.trim(),
      address: address.trim(),
      phoneNumber: phoneNumber.trim(),
      contactPerson: contactPerson.trim(),
    });
  }

  async deletePublisher(id: string): Promise<boolean> {
    return this.repo.deletePublisher(id);
  }
}
