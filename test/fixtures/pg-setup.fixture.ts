import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import * as path from 'path';

export const setupPostgresContainer =
  async (): Promise<StartedPostgreSqlContainer> => {
    const x = await new PostgreSqlContainer()
      .withDatabase('ccboxdb')
      .withCopyFilesToContainer([
        {
          source: path.resolve('docker/init.sql'),
          target: 'docker-entrypoint-initdb.d/init.sql',
        },
      ])
      .start();

    return x;
  };
