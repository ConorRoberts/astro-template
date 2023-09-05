import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export const libsqlClient = createClient({
  url: import.meta.env.DATABASE_URL,
});
export const db = () =>
  drizzle(libsqlClient, {
    schema,
    logger: true,
  });
