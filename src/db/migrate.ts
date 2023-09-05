import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "./schema";

const databaseUrl = String("file:sqlite.db");

const db = drizzle(
  createClient({
    url: databaseUrl.startsWith("http")
      ? databaseUrl.replace(/http(s)?/, "libsql")
      : databaseUrl,
  }),
  { schema }
);

(async () => {
  await migrate(db, {
    migrationsFolder: "./src/db/migrations",
    migrationsTable: "migrations",
  });
  console.info("Migrations applied");
  process.exit(0);
})();
