import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./trpc-context";

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

const isAuthed = t.middleware(async ({ next, ctx }) => {
  const session = await ctx.auth.validate();

  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: { ...ctx, session },
  });
});

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(isAuthed);
