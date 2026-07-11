declare module "bun:sqlite" {
  export type Database = unknown;
}

declare module "node:sqlite" {
  export type DatabaseSync = unknown;
}

declare type Timer = ReturnType<typeof setTimeout>;
