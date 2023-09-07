import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL environment variable");
}

let url = String(process.env.DATABASE_URL);

// Migrations are only supported via the libsql protocol
url = url.startsWith("http") ? url.replace(/http(s)?/, "libsql") : url;

const authToken = process.env.DATABASE_AUTH_TOKEN;

const db = drizzle(
  createClient(
    // Auth token must be either 1) present and not undefined or 2) not present
    authToken
      ? {
          url,
          authToken,
        }
      : { url }
  ),
  { schema }
);

(async () => {
  console.info("Running migrations");
  await migrate(db, {
    migrationsFolder: "./src/db/migrations",
    migrationsTable: "migrations",
  });
  console.info("Migrations applied");
  process.exit(0);
})();
