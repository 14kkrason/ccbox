import { GetRootFolderUseCase } from '@/app';
import { FolderEntity } from '../../src/domain';
import { KnexModule, KnexService } from '@/infrastructure/knex';
import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import {
  REQUESTED_OWNER_ID,
  setupCoreFolder,
  teardownChangesToCoreFolder,
} from '../fixtures/core-folders.fixture';
import { setupPostgresContainer } from '../fixtures/pg-setup.fixture';
import { FoldersRepositoryModule } from '@/infrastructure/folders-repository';

describe('GetRootFolder (db integration)', () => {
  jest.setTimeout(60000);

  let app: INestApplication;
  let knexService: KnexService;
  let getRootFolderUseCase: GetRootFolderUseCase;
  let container: StartedPostgreSqlContainer;

  beforeAll(async () => {
    // Arrange
    container = await setupPostgresContainer();
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        KnexModule.forRoot({
          client: 'pg',
          connection: {
            host: container.getHost(),
            port: container.getPort(),
            user: container.getUsername(),
            password: container.getPassword(),
            database: container.getDatabase(),
          },
        }),
        FoldersRepositoryModule.forRoot({ type: 'postgres' }),
      ],
      providers: [GetRootFolderUseCase],
      exports: [GetRootFolderUseCase],
    }).compile();

    app = moduleRef.createNestApplication();

    getRootFolderUseCase = app.get<GetRootFolderUseCase>(GetRootFolderUseCase);
    knexService = app.get<KnexService>(KnexService);

    await app.init();
    await setupCoreFolder(knexService.connection);
  });

  beforeEach(async () => {
    await teardownChangesToCoreFolder(knexService.connection);
  });

  afterAll(async () => {
    container.stop({ removeVolumes: false });
    app.close();
    knexService.connection.destroy();
  });

  it('should return a root folder when owner_id matches', async () => {
    // Arrange
    const retrievedFolder = new FolderEntity({
      id: 1,
      parentId: null,
      name: null,
      ownerId: REQUESTED_OWNER_ID,
      folders: [],
    });

    retrievedFolder.addFolder(2, '1');
    retrievedFolder.addFolder(3, '2');

    // Act
    const result = await getRootFolderUseCase.handle(REQUESTED_OWNER_ID);
    expect(result.getSnapshot()).toMatchObject(retrievedFolder.getSnapshot());
  });

  it('should return null when no root folder is found', async () => {
    const INVALID_OWNER_ID = 9999;

    const result = await getRootFolderUseCase.handle(INVALID_OWNER_ID);

    expect(result).toBeNull();
  });
});
