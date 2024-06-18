import { Controller, Get, Param } from "@nestjs/common";
import { FoldersApiService } from "./folders-api.service";

@Controller('/api/folders')
export class FoldersController {
  constructor(
    private readonly foldersApiService: FoldersApiService
  ) { }

  @Get()
  async getRootFolder() {
    // hardcoded for now, should be intercepted from each request
    const ownerId = 1;

    return this.foldersApiService.getRootFolder(ownerId);
  }
}