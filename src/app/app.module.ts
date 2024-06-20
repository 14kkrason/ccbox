import { DynamicModule } from '@nestjs/common';
import { GetRootFolderUseCase } from './get-root-folder.use-case';
import { GetFolderByIdUseCase } from './get-folder-by-id.use-case';

const useCases = [GetRootFolderUseCase, GetFolderByIdUseCase];

export class AppModule {
  public static forRoot(): DynamicModule {
    return {
      global: true,
      module: AppModule,
      providers: [...useCases],
      exports: [...useCases],
    };
  }
}
