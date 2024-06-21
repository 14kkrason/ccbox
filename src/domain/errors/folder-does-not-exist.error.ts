export class FolderDoesNotExistError extends Error {
  constructor(message: string) {
    super(message);
  }
}
