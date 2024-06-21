import { GetFolderByIdUseCase, GetRootFolderUseCase } from '@app';
import { FolderProps } from '@domain';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApiResponse } from '../common/api.interface';
import { CreateFolderDto } from './dtos/create-folder.dto';
import { CreateFolderUseCase } from '@app/create-folder.use-case';
import { FolderDoesNotExistError } from '@domain/errors/folder-does-not-exist.error';
import { DuplicateFolderError } from '@domain/errors/duplicate-folder.error';

@Injectable()
export class FoldersApiService {
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
    try {
      const data = await this.createFolderUseCase.handle(
        dto.name,
        dto.parentId,
        ownerId,
      );

      return {
        data,
        success: true,
      };
    } catch (error) {
      // TODO: create interceptors that map instances of business logic error to http exceptions
      // https://stackoverflow.com/questions/51112952/what-is-the-nestjs-error-handling-approach-business-logic-error-vs-http-error

      if (error instanceof FolderDoesNotExistError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof DuplicateFolderError) {
        throw new BadRequestException(error.message);
      }
    }
  }
}
