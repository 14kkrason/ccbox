import { FoldersUseCase } from "@app";
import { FolderProps } from "@domain";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ApiResponse } from "../common/api.interface";

@Injectable()
export class FoldersApiService {
  constructor(private readonly foldersUseCase: FoldersUseCase) { }

  public async getRootFolder(ownerId: number): Promise<ApiResponse<FolderProps>> {
    const result = await this.foldersUseCase.getRootFolder(ownerId);

    if (!result) {
      throw new NotFoundException('Root folder not found.')
    }

    return {
      data: result.getSnapshot(),
      success: true
    };
  }
}