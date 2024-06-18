import { Global, Module } from "@nestjs/common";
import { KnexService } from "./knex.service";
import { ConfigurableModuleClass } from "./knex.module-definition";

@Global()
@Module({
  providers: [KnexService],
  exports: [KnexService]
})
export class KnexModule extends ConfigurableModuleClass { }