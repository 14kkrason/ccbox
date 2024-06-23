import {
  GetFolderByIdUseCase,
  GetRootFolderUseCase,
  CreateFolderUseCase,
} from '@/app';
import { FolderProps } from '@/domain';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ApiResponse } from '../common/interfaces/api.interface';
import { CreateFolderDto } from './dtos/create-folder.dto';

@Injectable()
export class FoldersApiService {
  private readonly logger = new Logger(FoldersApiService.name);

  constructor(
    private readonly getRootFolderUseCase: GetRootFolderUseCase,
    private readonly getFolderByIdUseCase: GetFolderByIdUseCase,
    private readonly createFolderUseCase: CreateFolderUseCase,
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

  public async createFolder(
    dto: CreateFolderDto,
    ownerId: number,
  ): Promise<ApiResponse<number>> {
    const data = await this.createFolderUseCase.handle(
      dto.name,
      dto.parentId,
      ownerId,
    );

    this.logger.verbose(
      `Created new folder: ${dto.name}, ${dto.parentId}, ${ownerId}`,
    );

    return {
      data,
      success: true,
    };
  }
}
