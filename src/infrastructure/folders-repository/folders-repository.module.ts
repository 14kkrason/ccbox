import { DynamicModule, Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { FoldersPostgresRepository } from './postgres-folders.repository';

export const FoldersRepositoryImplementation = 'FoldersRepository';
export type FoldersRepositoryConfig = {
  type: 'postgres';
};

@Module({ exports: [FoldersRepositoryImplementation] })
export class FoldersRepositoryModule {
  public static forRoot(config: FoldersRepositoryConfig): DynamicModule {
    if (config.type === 'postgres') {
      const providers: Provider[] = [
        {
          provide: FoldersRepositoryImplementation,
          useClass: FoldersPostgresRepository,
        },
      ];

      return {
        global: true,
        module: FoldersRepositoryModule,
        providers,
      };
    }
  }
}
