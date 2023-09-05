import { QueryClient } from "@tanstack/react-query";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import SuperJSON from "superjson";
import type { AppRouter } from "~/utils/trpc/trpc-router";

export const trpc = createTRPCReact<AppRouter>({
  unstable_overrides: {
    useMutation: {
      async onSuccess(opts) {
        await opts.originalFn();
        await opts.queryClient.invalidateQueries();
      },
    },
  },
});

export const proxyClient = createTRPCProxyClient<AppRouter>({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: "/api/trpc",
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});

export const queryClient = new QueryClient();

export const trpcClient = trpc.createClient({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: "/api/trpc",
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});
