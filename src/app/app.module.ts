import { DynamicModule } from "@nestjs/common";
import { FoldersUseCase } from "./folders.use-case";

export class AppModule {
  public static forRoot(): DynamicModule {
    return {
      global: true,
      module: AppModule,
      providers: [FoldersUseCase],
      exports: [FoldersUseCase]
    }
  }
}