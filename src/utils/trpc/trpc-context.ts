import type { inferAsyncReturnType } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { APIRoute } from "astro";

export const createContext = async (
  _opts: FetchCreateContextFnOptions,
  context: Parameters<APIRoute>[0]
) => {
  return { auth: context.locals.auth };
};

export type Context = inferAsyncReturnType<typeof createContext>;
