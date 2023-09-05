import { authRouter } from "./routers/auth-router";
import { publicProcedure, router } from "./trpc-server-config";

export const appRouter = router({
  ping: publicProcedure.query(() => {
    return "Pong";
  }),
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
