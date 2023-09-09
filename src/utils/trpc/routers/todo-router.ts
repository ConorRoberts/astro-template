import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { insertTodoSchema, selectTodoSchema, todo } from "~/db/schema";
import { protectedProcedure, router } from "../trpc-server-config";

export const todoRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.todo.findMany({
      where: eq(todo.userId, ctx.session.user.id),
    });
  }),
  get: protectedProcedure.input(z.object({ todoId: z.string() })).query(async ({ ctx, input }) => {
    return await ctx.db.query.todo.findFirst({
      where: and(eq(todo.userId, ctx.session.user.id), eq(todo.id, input.todoId)),
    });
  }),
  create: protectedProcedure.input(insertTodoSchema.pick({ name: true })).mutation(async ({ ctx, input }) => {
    return await ctx.db.insert(todo).values({
      name: input.name,
      userId: ctx.session.user.id,
    });
  }),
  delete: protectedProcedure.input(selectTodoSchema.pick({ id: true })).mutation(async ({ ctx, input }) => {
    return await ctx.db.delete(todo).where(and(eq(todo.id, input.id), eq(todo.userId, ctx.session.user.id)));
  }),
});
