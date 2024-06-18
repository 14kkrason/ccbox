export interface FoldersPostgresModel {
  id: number;
  parent_folder_id: number | null;
  name: string;
  owner_id: number;
}