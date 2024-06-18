import { Inject, Injectable } from '@nestjs/common';
import knex, { Knex } from 'knex';
import { MODULE_OPTIONS_TOKEN } from './knex.module-definition';

@Injectable()
export class KnexService {
  private _connection: Knex;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) private config: Knex.Config) {}

  public get connection() {
    if (!this._connection) {
      this._connection = knex(this.config);

      return this._connection;
    }

    return this._connection;
  }
}
