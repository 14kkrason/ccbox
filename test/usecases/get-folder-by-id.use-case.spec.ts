import { FolderEntity } from '../../src/domain';
import { KnexModule, KnexService } from '@/infrastructure/knex';
import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import {
  DEPENDANT_FOLDER_WITH_CHILDREN_ID,
  REQUESTED_OWNER_ID,
  ROOT_FOLDER_ID,
  setupCoreFolder,
  teardownCoreFolder,
} from '../fixtures/core-folders.fixture';
import { setupPostgresContainer } from '../fixtures/pg-setup.fixture';
import { FoldersRepositoryModule } from '@/infrastructure/folders-repository';
import { GetFolderByIdUseCase } from '@/app';

describe('GetFolderById (db integration)', () => {
  jest.setTimeout(60000);

  let app: INestApplication;
  let knexService: KnexService;
  let getFolderByIdUseCase: GetFolderByIdUseCase;
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
      providers: [GetFolderByIdUseCase],
      exports: [GetFolderByIdUseCase],
    }).compile();

    app = moduleRef.createNestApplication();

    getFolderByIdUseCase = app.get<GetFolderByIdUseCase>(GetFolderByIdUseCase);
    knexService = app.get<KnexService>(KnexService);

    await app.init();
  });

  beforeEach(async () => {
    await teardownCoreFolder(knexService.connection);
    await setupCoreFolder(knexService.connection);
  });

  afterAll(async () => {
    container.stop({ removeVolumes: false });
    app.close();
    knexService.connection.destroy();
  });

  it('should return a folder when the id an ownerId is matching', async () => {
    // Arrange
    const retrievedFolder = new FolderEntity({
      id: DEPENDANT_FOLDER_WITH_CHILDREN_ID,
      parentId: ROOT_FOLDER_ID,
      name: '1',
      ownerId: REQUESTED_OWNER_ID,
      folders: [],
    });

    retrievedFolder.addFolder(4, '3');

    // Act
    const result = await getFolderByIdUseCase.handle(
      DEPENDANT_FOLDER_WITH_CHILDREN_ID,
      REQUESTED_OWNER_ID,
    );

    // Assert
    expect(result.getSnapshot()).toMatchObject(retrievedFolder.getSnapshot());
  });

  it('should return null when folder is not found (wrong id)', async () => {
    // Arrange
    const INVALID_ID = 9999;

    // Act
    const result = await getFolderByIdUseCase.handle(
      INVALID_ID,
      REQUESTED_OWNER_ID,
    );

    // Assert
    expect(result).toBeNull();
  });

  it('should return null when folder is not found (wrong owner id)', async () => {
    // Arrange
    // TODO: when authentication is done we should get this from the presentation layer/controller/header
    const INVALID_OWNER_ID = 9999;

    // Act
    const result = await getFolderByIdUseCase.handle(
      DEPENDANT_FOLDER_WITH_CHILDREN_ID,
      INVALID_OWNER_ID,
    );

    // Assert
    expect(result).toBeNull();
  });
});
