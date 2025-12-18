import { aliasedTable, and, eq, gte, lte, sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  SQLiteTableWithColumns,
  sqliteView,
  text,
} from "drizzle-orm/sqlite-core";

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
  category_id: integer().references(() => categoryTable.id, {
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
export const incomeView = sqliteView("vw_income").as((qb) =>
  qb.select().from(operationTable).where(eq(operationTable.is_income, true))
);

export const expenseView = sqliteView("vw_expense").as((qb) =>
  qb.select().from(operationTable).where(eq(operationTable.is_income, false))
);

export const totalExpensesByDayByMonth = sqliteView(
  "vw_total_expense_by_daymonth"
).as((qb) =>
  qb
    .select({
      date: sql<string>`substr(${expenseView.date}, 1, 10)`.as("date"),
      total_value: sql<number>`sum(${expenseView.value})`.as("total_value"),
    })
    .from(expenseView)
    .where(
      sql`
    substr(${expenseView.date}, 1, 10) >= date('now', 'start of month')
    AND substr(${expenseView.date}, 1, 10) <= date('now')
  `
    )
    .groupBy(sql`substr(${expenseView.date}, 1, 10)`)
    .orderBy(sql`substr(${expenseView.date}, 1, 10)`)
);

export const totalIncomesByDayByMonth = sqliteView(
  "vw_total_income_by_daymonth"
).as((qb) =>
  qb
    .select({
      date: sql<string>`substr(${incomeView.date}, 1, 10)`.as("date"),
      total_value: sql<number>`sum(${incomeView.value})`.as("total_value"),
    })
    .from(incomeView)
    .where(
      sql`
    substr(${incomeView.date}, 1, 10) >= date('now', 'start of month')
    AND substr(${incomeView.date}, 1, 10) <= date('now')
  `
    )
    .groupBy(sql`substr(${incomeView.date}, 1, 10)`)
    .orderBy(sql`substr(${incomeView.date}, 1, 10)`)
);


export const generalBalanceView = sqliteView(
  "vw_general_balance"
).as((qb) =>
  qb
    .select({
      total_incomes: sql`CAST(${sql.raw("vw_income_balance.total_sum")} AS INTEGER)`.as('total_incomes'),
      total_expenses: sql`CAST(${sql.raw("vw_expense_balance.total_sum")} AS INTEGER)`.as('total_expenses'),

      balance: sql`CAST(${sql.raw("vw_income_balance.total_sum")} - ${sql.raw("vw_expense_balance.total_sum")} AS INTEGER)`.as('balance')
    })
    .from(sql.raw("vw_income_balance"))
    .fullJoin(sql.raw("vw_expense_balance"), sql`1=1`)
);

export type InsertCategory = typeof categoryTable.$inferInsert;
export type SelectCategory = typeof categoryTable.$inferSelect;

export type InsertOperation = typeof operationTable.$inferInsert;
export type SelectOperation = typeof operationTable.$inferSelect;

export type InsertUser = typeof userTable.$inferInsert;
export type SelectUser = typeof userTable.$inferSelect;