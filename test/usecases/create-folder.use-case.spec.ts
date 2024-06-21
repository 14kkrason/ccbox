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
import {
  FoldersRepositoryImplementation,
  FoldersRepositoryModule,
} from '@/infrastructure/folders-repository';
import { CreateFolderUseCase } from '@/app/create-folder.use-case';
import { FoldersRepositoryPort } from '@/domain/ports';
import { DuplicateFolderError, FolderDoesNotExistError } from '@/domain/errors';

describe('CreateFolder (db integration)', () => {
  jest.setTimeout(60000);

  let app: INestApplication;
  let knexService: KnexService;
  let createFolderUseCase: CreateFolderUseCase;
  let container: StartedPostgreSqlContainer;
  let foldersRepository: FoldersRepositoryPort;

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
      providers: [CreateFolderUseCase],
      exports: [CreateFolderUseCase],
    }).compile();

    app = moduleRef.createNestApplication();

    createFolderUseCase = app.get<CreateFolderUseCase>(CreateFolderUseCase);
    foldersRepository = app.get<FoldersRepositoryPort>(
      FoldersRepositoryImplementation,
    );
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

  it('should create a folder under specified folder', async () => {
    // Act
    const insertedFolderId = await createFolderUseCase.handle(
      'example',
      4,
      REQUESTED_OWNER_ID,
    );

    // Assert
    const folder = await foldersRepository.findById(
      insertedFolderId,
      REQUESTED_OWNER_ID,
    );
    expect(folder.getSnapshot()).toMatchObject({
      id: insertedFolderId,
      parentId: 4,
      name: 'example',
      ownerId: REQUESTED_OWNER_ID,
      folders: [],
    });
  });

  it('should create a root folder', async () => {
    // Arrange
    const newOwnerId = 2;

    // Act
    const insertedFolderId = await createFolderUseCase.handle(
      null,
      null,
      newOwnerId,
    );

    // Assert
    const folder = await foldersRepository.findById(
      insertedFolderId,
      newOwnerId,
    );
    expect(folder.getSnapshot()).toMatchObject({
      id: insertedFolderId,
      parentId: null,
      name: null,
      ownerId: newOwnerId,
      folders: [],
    });
  });

  it('should throw DuplicateFolderError when folder with this name already exists under parent', async () => {
    // Assert
    expect(async () => {
      await createFolderUseCase.handle('1', 1, REQUESTED_OWNER_ID);
    }).rejects.toThrow(DuplicateFolderError);
  });

  it('should throw DuplicateFolderError when root folder already exists for this user', () => {
    // Assert
    expect(async () => {
      await createFolderUseCase.handle(null, null, REQUESTED_OWNER_ID);
    }).rejects.toThrow(DuplicateFolderError);
  });

  it('should throw FolderDoesNotExist when parentId does not exist', () => {
    expect(async () => {
      await createFolderUseCase.handle(
        'example name',
        99999,
        REQUESTED_OWNER_ID,
      );
    }).rejects.toThrow(FolderDoesNotExistError);
  });

  it('should throw FolderDoesNotExist when ownerId does not match', () => {
    // Arrange
    const MISMATCHED_OWNER_ID = 9999;

    expect(async () => {
      await createFolderUseCase.handle(
        'some unique name',
        1,
        MISMATCHED_OWNER_ID,
      );
    }).rejects.toThrow(FolderDoesNotExistError);
  });
});
