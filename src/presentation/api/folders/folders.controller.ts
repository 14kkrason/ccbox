import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FoldersApiService } from './folders-api.service';
import { ApiResponse } from '../common/api.interface';
import { FolderProps } from '@domain';
import { CreateFolderDto } from './dtos/create-folder.dto';

@Controller('/api/folders')
export class FoldersController {
  constructor(private readonly foldersApiService: FoldersApiService) {}

  @Get('root')
  async getRootFolder(): Promise<ApiResponse<FolderProps>> {
    // hardcoded for now, should be intercepted from each request
    const ownerId = 1;

    return this.foldersApiService.getRootFolder(ownerId);
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<ApiResponse<FolderProps>> {
    const ownerId = 1;

    return this.foldersApiService.getFolderById(id, ownerId);
  }

  @Post()
  async createFolder(
    @Body() body: CreateFolderDto,
  ): Promise<ApiResponse<number>> {
    const ownerId = 1;

    return this.foldersApiService.createFolder(body, ownerId);
  }
}
