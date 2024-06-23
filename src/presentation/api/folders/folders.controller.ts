import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FoldersApiService } from './folders-api.service';
import { ApiResponse } from '../common/interfaces/api.interface';
import { FolderProps } from '@domain';
import { CreateFolderDto } from './dtos/create-folder.dto';
import { ApiResponse as SwaggerApiResponse } from '@nestjs/swagger';

@Controller('/api/folders')
export class FoldersController {
  constructor(private readonly foldersApiService: FoldersApiService) {}

  @Get('root')
  @SwaggerApiResponse({
    status: 404,
    description: 'The user has no root folder.',
  })
  async getRootFolder(): Promise<ApiResponse<FolderProps>> {
    // hardcoded for now, should be intercepted from each request
    const ownerId = 1;

    return this.foldersApiService.getRootFolder(ownerId);
  }

  @Get(':id')
  @SwaggerApiResponse({
    status: 404,
    description: 'Folder with specified id does not exist.',
  })
  async getById(@Param('id') id: number): Promise<ApiResponse<FolderProps>> {
    const ownerId = 1;

    return this.foldersApiService.getFolderById(id, ownerId);
  }

  @Post()
  @SwaggerApiResponse({
    status: 404,
    description: 'Parent folder does not exist.',
  })
  @SwaggerApiResponse({
    status: 400,
    description:
      'Incorrect values sent or folder with this name already exists.',
  })
  async createFolder(
    @Body() body: CreateFolderDto,
  ): Promise<ApiResponse<number>> {
    const ownerId = 1;

    return this.foldersApiService.createFolder(body, ownerId);
  }
}
