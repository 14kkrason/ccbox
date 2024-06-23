import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ApiModule } from '@/presentation/api/api.module';
import {
  CreateFolderUseCase,
  GetFolderByIdUseCase,
  GetRootFolderUseCase,
} from '@/app';
import {
  BadRequestInterceptor,
  NotFoundInterceptor,
} from '@/presentation/api/common';
import { FolderEntity } from '@/domain';
import { REQUESTED_OWNER_ID } from '../fixtures/core-folders.fixture';
import { AppModule } from '@/app/app.module';
import { DuplicateFolderError, FolderDoesNotExistError } from '@/domain/errors';

describe('FoldersController (http integration)', () => {
  let app: INestApplication;
  const createFolderUseCaseMock = { handle: jest.fn() };
  const getRootFolderUseCaseMock = { handle: jest.fn() };
  const getFolderByIdUseCaseMock = { handle: jest.fn() };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ApiModule.forRoot(), AppModule.forRoot()],
    })
      .overrideProvider(CreateFolderUseCase)
      .useValue(createFolderUseCaseMock)
      .overrideProvider(GetRootFolderUseCase)
      .useValue(getRootFolderUseCaseMock)
      .overrideProvider(GetFolderByIdUseCase)
      .useValue(getFolderByIdUseCaseMock)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalInterceptors(
      new NotFoundInterceptor(),
      new BadRequestInterceptor(),
    );
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/folders/root', () => {
    it('should return values when folder exists and ownerId matches', async () => {
      // Arrange
      const rootFolder = new FolderEntity({
        id: 1,
        name: null,
        parentId: null,
        ownerId: REQUESTED_OWNER_ID,
        folders: [],
      });
      getRootFolderUseCaseMock.handle.mockResolvedValue(rootFolder);

      // Act
      const response = await request(app.getHttpServer())
        .get('/api/folders/root')
        .accept('application/json');

      // Assert
      expect(response.body).toMatchObject({
        data: rootFolder.getSnapshot(),
        success: true,
      });
      expect(response.statusCode).toBe(200);
    });

    it('should throw NotFoundException when folder does not exist', async () => {
      // Arrange
      getRootFolderUseCaseMock.handle.mockResolvedValue(null);

      // Act
      const response = await request(app.getHttpServer())
        .get('/api/folders/root')
        .accept('application/json');

      // Assert
      expect(response.statusCode).toBe(404);
    });

    // TODO: write tests for cases with mismatching owner id when that part is implemented
  });

  describe('GET /api/folders/:id', () => {
    it('should return values when folder exists and ownerId matches', async () => {
      // Arrange
      const folder = new FolderEntity({
        id: 123,
        name: 'Some example folder',
        parentId: 1,
        ownerId: REQUESTED_OWNER_ID,
        folders: [],
      });
      getFolderByIdUseCaseMock.handle.mockResolvedValue(folder);

      // Act
      const response = await request(app.getHttpServer())
        .get('/api/folders/123')
        .accept('application/json');

      // Assert
      expect(response.body).toMatchObject({
        data: folder.getSnapshot(),
        success: true,
      });
      expect(response.statusCode).toBe(200);
    });

    it('should throw NotFoundException when folder does not exist', async () => {
      // Arrange
      getFolderByIdUseCaseMock.handle.mockResolvedValue(null);

      // Act
      const response = await request(app.getHttpServer())
        .get('/api/folders/123')
        .accept('application/json');

      // Assert
      expect(response.statusCode).toBe(404);
    });

    // TODO: write tests for cases with mismatching owner id when that part is implemented
  });

  describe('POST /api/folders', () => {
    it('should return newly created folder id', async () => {
      // Arrange
      createFolderUseCaseMock.handle.mockResolvedValue(123);

      // Act
      const response = await request(app.getHttpServer())
        .post('/api/folders')
        .send({
          name: 'example',
          parentId: 1,
        })
        .accept('application/json');

      // Assert
      expect(response.body).toMatchObject({
        data: 123,
        success: true,
      });
      expect(response.statusCode).toBe(201);
    });

    it('should validate wrong data types in DTO', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .post('/api/folders')
        .send({
          name: 111,
          parentId: 'this is not a number',
        })
        .accept('application/json');

      // Assert
      expect(response.body.message.length).toBe(2);
      expect(response.statusCode).toBe(400);
    });

    it('should return NotFoundException when usecase throws FolderDoesNotExistError', async () => {
      // Arrange
      createFolderUseCaseMock.handle.mockImplementation(() => {
        throw new FolderDoesNotExistError(
          "I don't know man, this folder ain't here",
        );
      });

      // Act
      const response = await request(app.getHttpServer())
        .post('/api/folders')
        .send({
          name: 'example',
          parentId: 1,
        })
        .accept('application/json');

      // Assert
      expect(response.statusCode).toBe(404);
    });

    it('should return BadRequestException when requested parent folder does not exist', async () => {
      // Arrange
      createFolderUseCaseMock.handle.mockImplementation(() => {
        throw new DuplicateFolderError('We have such folder already');
      });

      // Act
      const response = await request(app.getHttpServer())
        .post('/api/folders')
        .send({
          name: 'example',
          parentId: 1,
        })
        .accept('application/json');

      // Assert
      expect(response.statusCode).toBe(400);
    });
  });
});
