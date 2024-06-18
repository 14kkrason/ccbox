import { Entity } from "./entity";

export interface FolderProps {
  id: number;
  parentId: number;
  name: string;
  ownerId: number;
  folders: Pick<FolderProps, 'id' | 'name'>[];
}

export class FolderEntity extends Entity<FolderProps> {
  public canCreate(name: string) {
    return this.props.folders.findIndex((folder) => folder.name === name) < 0;
  }
}