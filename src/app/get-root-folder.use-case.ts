import { FolderEntity } from '@/domain/entities/folder.entity';
import { FoldersRepositoryPort } from '@/domain/ports';
import { FoldersRepositoryImplementation } from '@/infrastructure/folders-repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetRootFolderUseCase {
  constructor(
    @Inject(FoldersRepositoryImplementation)
    private readonly foldersRepository: FoldersRepositoryPort,
  ) {}

  public async handle(ownerId: number): Promise<FolderEntity | null> {
    return this.foldersRepository.findByParentId(null, ownerId);
  }
}
