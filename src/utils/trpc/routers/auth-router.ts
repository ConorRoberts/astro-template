import { protectedProcedure, router } from "../trpc-server-config";

export const authRouter = router({
  getSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
});
