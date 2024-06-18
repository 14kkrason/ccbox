-- here be the PG dump after working...
--  id, parent_folder_id, name, owner_id

CREATE SCHEMA core;

CREATE TABLE core.folder (
  id integer PRIMARY KEY,
  parent_folder_id integer,
  name text,
  owner_id integer,
  UNIQUE(parent_folder_id, name)
);