import { GetFolderByIdUseCase, GetRootFolderUseCase } from '@app';
import { FolderProps } from '@domain';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiResponse } from '../common/api.interface';

@Injectable()
export class FoldersApiService {
  constructor(
    private readonly getRootFolderUseCase: GetRootFolderUseCase,
    private readonly getFolderByIdUseCase: GetFolderByIdUseCase,
  ) {}

  public async getRootFolder(
    ownerId: number,
  ): Promise<ApiResponse<FolderProps>> {
    const result = await this.getRootFolderUseCase.handle(ownerId);

    if (!result) {
      throw new NotFoundException('Root folder not found.');
    }

    return {
      data: result.getSnapshot(),
      success: true,
    };
  }

  public async getFolderById(
    id: number,
    ownerId: number,
  ): Promise<ApiResponse<FolderProps>> {
    const result = await this.getFolderByIdUseCase.handle(id, ownerId);

    if (!result) {
      throw new NotFoundException('Folder with such id not found for user.');
    }

    return {
      data: result.getSnapshot(),
      success: true,
    };
  }
}
