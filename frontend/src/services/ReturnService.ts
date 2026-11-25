import { ReturnRepository, type IReturnRepository } from '@/repositories/ReturnRepository';
import type { CreateReturnDTO, ReturnExchangeDTO } from '@/types/dtos';

export class ReturnService {
  private readonly repo: IReturnRepository;

  constructor(repo: IReturnRepository = new ReturnRepository()) {
    this.repo = repo;
  }

  async getReturns(): Promise<ReturnExchangeDTO[]> {
    return this.repo.findAll();
  }

  async createReturn(dto: CreateReturnDTO): Promise<ReturnExchangeDTO> {
    return this.repo.create(dto);
  }
}
