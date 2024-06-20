export interface FoldersPostgresModel {
  id: number;
  parent_folder_id: number | null;
  name: string | null;
  owner_id: number;
}
