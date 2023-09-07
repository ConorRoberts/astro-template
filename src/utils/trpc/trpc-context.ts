import type { inferAsyncReturnType } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { APIRoute } from "astro";
import { getDb } from "~/db/client";

export const createContext = async (_opts: FetchCreateContextFnOptions, context: Parameters<APIRoute>[0]) => {
  return { auth: context.locals.auth, db: getDb() };
};

export type Context = inferAsyncReturnType<typeof createContext>;
