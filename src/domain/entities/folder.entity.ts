import { Entity } from './entity';

export interface FolderProps {
  id: number;
  parentId: number | null;
  name: string | null;
  ownerId: number;
  folders: Pick<FolderProps, 'id' | 'name'>[];
}

export class FolderEntity extends Entity<FolderProps> {
  constructor(props: FolderProps) {
    super(props);
  }

  public canCreateFolder(name: string): boolean {
    return this.props.folders.findIndex((folder) => folder.name === name) < 0;
  }

  public addFolder(id: number, name: string): void {
    if (!this.canCreateFolder(name)) {
      throw new Error('Folder with this name already exists.');
    }

    this.props.folders.push({ id, name });
  }
}
