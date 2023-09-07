import { createId } from "@paralleldrive/cuid2";
import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { user } from ".";

export const todo = sqliteTable("todo", {
  id: text("id")
    .primaryKey()
    .$default(() => createId()),
  name: text("name").notNull(),
  createdAt: int("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date()),
  updatedAt: int("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date()),
  userId: text("user_id").notNull(),
  status: text("status", { enum: ["pending", "complete"] })
    .notNull()
    .$default(() => "pending"),
});

export const todoRelations = relations(todo, ({ one }) => ({
  user: one(user, { fields: [todo.userId], references: [user.id] }),
}));

export type Todo = InferSelectModel<typeof todo>;
export type NewTodo = InferInsertModel<typeof todo>;
export const selectTodoSchema = createSelectSchema(todo);
export const insertTodoSchema = createInsertSchema(todo);
