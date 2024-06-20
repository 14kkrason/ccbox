import { Controller, Get, Param } from '@nestjs/common';
import { FoldersApiService } from './folders-api.service';
import { ApiResponse } from '../common/api.interface';
import { FolderProps } from '@domain';

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
}
