import { FoldersUseCase } from '@app';
import { AppModule } from '@app/app.module';
import { FoldersRepositoryModule } from '@infrastructure/folders-repository';
import { KnexModule } from '@infrastructure/knex';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiModule } from './presentation/api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ApiModule.forRoot(),
    AppModule.forRoot(),
    KnexModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          client: 'pg',
          connection: {
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            user: configService.get('DB_USER'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME')
          }
        };
      },
    }),
    FoldersRepositoryModule.forRoot({type: 'postgres'})
  ],
  providers: [FoldersUseCase],
  exports: [FoldersUseCase]
})
export class MainModule {}
