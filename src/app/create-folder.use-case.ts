import { FoldersRepositoryImplementation } from '@/infrastructure/folders-repository';
import { FoldersRepositoryPort } from '@/domain/ports';
import { Inject, Injectable } from '@nestjs/common';
import { FolderDoesNotExistError, DuplicateFolderError } from '@/domain/errors';

@Injectable()
export class CreateFolderUseCase {
  constructor(
    @Inject(FoldersRepositoryImplementation)
    private readonly foldersRepository: FoldersRepositoryPort,
  ) {}

  public async handle(
    name: string | null,
    parentId: number | null,
    ownerId: number,
  ): Promise<number> {
    if (parentId === null) {
      return this.handleRoot(ownerId);
    }

    const parent = await this.foldersRepository.findById(parentId, ownerId);

    if (!parent) {
      throw new FolderDoesNotExistError('Parent folder does not exist.');
    }

    if (!parent.canCreateFolder(name)) {
      throw new DuplicateFolderError('Folder with such name already exists.');
    }

    return this.foldersRepository.createFolder(name, parentId, ownerId);
  }

  private async handleRoot(ownerId: number): Promise<number> {
    const isRoot = await this.foldersRepository.findByParentId(null, ownerId);

    if (isRoot) {
      throw new DuplicateFolderError(
        'Root folder already exists for this user.',
      );
    }

    return this.foldersRepository.createFolder(null, null, ownerId);
  }
}
