import { eq } from "drizzle-orm";
import { todo } from "~/db/schema";
import { protectedProcedure, router } from "../trpc-server-config";

export const todoRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.todo.findMany({
      where: eq(todo.userId, ctx.session.user.id),
    });
  }),
  create: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.db.insert(todo).values({
      name: "New todo",
      userId: ctx.session.user.id,
    });
  }),
});
