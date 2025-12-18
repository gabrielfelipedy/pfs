import { eq, sql } from "drizzle-orm";
import { integer, sqliteTable, SQLiteTableWithColumns, sqliteView, text } from "drizzle-orm/sqlite-core";

export const categoryTable = sqliteTable("category", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  is_income: integer({ mode: "boolean" }).notNull(),
  created_at: text()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const userTable = sqliteTable("user", {
  id: integer().primaryKey({ autoIncrement: true }),
  username: text().notNull(),
  password: text().notNull(),
  created_at: text()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const operationTable = sqliteTable("operation", {
  id: integer().primaryKey({ autoIncrement: true }),

  name: text().notNull(),
  description: text(),
  value: integer(),
  date: text().default(sql`(CURRENT_TIMESTAMP)`),
  is_paid: integer({ mode: "boolean" }),
  is_income: integer({ mode: "boolean" }),
  category_id: integer()
    .references(() => categoryTable.id, {
      onUpdate: "cascade",
      onDelete: "set null",
    }),

  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});


// **** VIEWS **** //
export const incomeView = sqliteView('vw_income').as((qb) => qb.select().from(operationTable).where(eq(operationTable.is_income, true)));

export const expenseView = sqliteView('vw_expense').as((qb) => qb.select().from(operationTable).where(eq(operationTable.is_income, false)));

export type InsertCategory = typeof categoryTable.$inferInsert;
export type SelectCategory = typeof categoryTable.$inferSelect;

export type InsertOperation = typeof operationTable.$inferInsert;
export type SelectOperation = typeof operationTable.$inferSelect;

export type InsertUser = typeof userTable.$inferInsert;
export type SelectUser = typeof userTable.$inferSelect;