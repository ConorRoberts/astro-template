import { createClient } from "@libsql/client";
import { isServer } from "@tanstack/react-query";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export const libsqlClient = createClient({
  url: import.meta.env.DATABASE_URL,
});
export const getDb = () => {
  if (!isServer) {
    throw new Error("Can only use database connection from server");
  }

  return drizzle(libsqlClient, {
    schema,
    logger: true,
  });
};
