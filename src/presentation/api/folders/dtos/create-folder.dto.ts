export interface CreateFolderDto {
  parentId: number; // we cannot create root folder through the API
  name: string;
}
