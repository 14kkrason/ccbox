import { FolderEntity } from '@domain/entities/folder.entity';

export interface FoldersRepositoryPort {
  findByParentId(
    parentId: number | null,
    ownerId: number,
  ): Promise<FolderEntity | null>;
  findById(id: number, ownerId: number): Promise<FolderEntity | null>;
}
