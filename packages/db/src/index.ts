import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export { schema };
export type Database = ReturnType<typeof createD1Database>;

export function createD1Database(binding: D1Database) {
  return drizzle(binding, { schema });
}
