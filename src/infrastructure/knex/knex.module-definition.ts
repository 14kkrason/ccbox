import { ConfigurableModuleBuilder } from '@nestjs/common';
import { Knex } from 'knex';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<Knex.Config>()
    .setClassMethodName('forRoot')
    .setExtras({ global: true })
    .build();
