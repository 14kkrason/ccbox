import { DynamicModule } from '@nestjs/common';
import {
  FoldersController,
  FoldersApiService,
} from '@/presentation/api/folders';

export class FoldersApiModule {
  public static forRoot(): DynamicModule {
    return {
      global: true,
      module: FoldersApiModule,
      controllers: [FoldersController],
      providers: [FoldersApiService],
      exports: [FoldersApiService],
    };
  }
}
