import { FolderEntity } from '@/domain/entities/folder.entity';
import { FoldersRepositoryPort } from '@/domain/ports';
import { KnexService } from '@/infrastructure/knex';
import { Injectable } from '@nestjs/common';
import { FoldersPostgresModel } from './models/folders-postgres.model';

type FoldersPostgresModelJoined = FoldersPostgresModel & {
  dep_folder_id: number;
  dep_folder_name: string;
};

@Injectable()
export class FoldersPostgresRepository implements FoldersRepositoryPort {
  constructor(private readonly knexService: KnexService) {}

  public async findById(
    id: number,
    ownerId: number,
  ): Promise<FolderEntity | null> {
    const client = this.knexService.connection('core.folder');

    const response = await client
      .select('f1.*', 'f2.id as dep_folder_id', 'f2.name as dep_folder_name')
      .from('core.folder as f1')
      .where('f1.owner_id', ownerId)
      .andWhere('f1.id', id)
      .leftJoin('core.folder as f2', 'f2.parent_folder_id', '=', 'f1.id');

    if (response.length === 0) {
      return null;
    }

    return this.toEntity(response);
  }

  public async findByParentId(
    parentId: number | null,
    ownerId: number,
  ): Promise<FolderEntity | null> {
    const client = this.knexService.connection('core.folder');

    const response = await client
      .select('f1.*', 'f2.id as dep_folder_id', 'f2.name as dep_folder_name')
      .from('core.folder as f1')
      .where('f1.owner_id', ownerId)
      .andWhere('f1.parent_folder_id', parentId)
      .leftJoin('core.folder as f2', 'f2.parent_folder_id', '=', 'f1.id');

    if (response.length === 0) {
      return null;
    }

    return this.toEntity(response);
  }

  private toEntity(model: FoldersPostgresModelJoined[]): FolderEntity {
    return new FolderEntity({
      id: model[0].id,
      parentId: model[0].parent_folder_id,
      name: model[0].name,
      ownerId: model[0].owner_id,
      folders: model.flatMap((m) => {
        if (m.dep_folder_id && m.dep_folder_name) {
          return {
            id: m.dep_folder_id,
            name: m.dep_folder_name,
          };
        }

        return [];
      }),
    });
  }
}
