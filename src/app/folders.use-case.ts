import { FolderEntity } from '@domain/entities/folder.entity';
import { FoldersRepositoryPort } from '@domain/ports';
import { FoldersRepositoryImplementation } from '@infrastructure/folders-repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class FoldersUseCase {
  constructor(
    @Inject(FoldersRepositoryImplementation)
    private readonly foldersRepository: FoldersRepositoryPort,
  ) {}

  public async getRootFolder(
    ownerId: number,
  ): Promise<FolderEntity | null> {
    return this.foldersRepository.findByParentId(null, ownerId);
  }
}
