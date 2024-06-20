import { Knex } from 'knex';
import { FoldersPostgresModel } from '../../src/infrastructure/folders-repository/models/folders-postgres.model';

export const REQUESTED_OWNER_ID = 1;
export const ROOT_FOLDER_ID = 1;
export const DEPENDANT_FOLDER_WITH_CHILDREN_ID = 2;

export const teardownCoreFolder = async (client: Knex): Promise<void> => {
  await client('core.folder').delete();
};

export const setupCoreFolder = async (
  client: Knex,
  rows: FoldersPostgresModel[] = defaultRows,
): Promise<void> => {
  const insert = (row: FoldersPostgresModel): string =>
    `INSERT INTO core.folder VALUES (${row.id}, ${row.parent_folder_id}, ${row.name}, ${row.owner_id});`;

  for (const row of rows) {
    await client.raw(insert(row));
  }
};

export const defaultRows: FoldersPostgresModel[] = [
  {
    id: 1,
    parent_folder_id: null,
    name: null,
    owner_id: REQUESTED_OWNER_ID,
  },
  {
    id: 2,
    parent_folder_id: 1,
    name: '1',
    owner_id: REQUESTED_OWNER_ID,
  },
  {
    id: 3,
    parent_folder_id: 1,
    name: '2',
    owner_id: REQUESTED_OWNER_ID,
  },
  {
    id: 4,
    parent_folder_id: 2,
    name: '3',
    owner_id: REQUESTED_OWNER_ID,
  },
];
