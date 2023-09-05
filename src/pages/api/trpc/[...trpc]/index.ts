import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { APIRoute } from "astro";
import { createContext } from "~/utils/trpc/trpc-context";
import { appRouter } from "~/utils/trpc/trpc-router";

export const dynamic = "force-dynamic";
// export const runtime = "edge";

const handler: APIRoute = (context) => {
  if (context.request.method === "OPTIONS") {
    return new Response("{}", { status: 200 });
  }
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: context.request,
    router: appRouter,
    createContext: async (opts) => {
      return await createContext(opts, context);
    },
  });
};

export { handler as GET, handler as OPTIONS, handler as POST };
