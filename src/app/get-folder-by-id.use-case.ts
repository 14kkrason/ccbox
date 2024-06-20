import { FolderEntity } from '@/domain';
import { FoldersRepositoryPort } from '@/domain/ports';
import { FoldersRepositoryImplementation } from '@/infrastructure/folders-repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetFolderByIdUseCase {
  constructor(
    @Inject(FoldersRepositoryImplementation)
    private readonly foldersRepository: FoldersRepositoryPort,
  ) {}

  public async handle(
    id: number,
    ownerId: number,
  ): Promise<FolderEntity | null> {
    return this.foldersRepository.findById(id, ownerId);
  }
}
