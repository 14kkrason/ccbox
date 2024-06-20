import { DynamicModule } from '@nestjs/common';
import { FoldersApiModule } from './folders';

export class ApiModule {
  static forRoot(): DynamicModule {
    return {
      module: ApiModule,
      imports: [FoldersApiModule.forRoot()],
    };
  }
}
