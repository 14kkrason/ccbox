import { FolderEntity } from "@domain/entities/folder.entity";

export interface FoldersRepositoryPort {
  findByParentId(parentId: number | null, ownerId: number): FolderEntity | null | Promise<FolderEntity | null>
}