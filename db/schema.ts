import {eq, sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  sqliteView,
  text,
} from "drizzle-orm/sqlite-core";

export const categoryTable = sqliteTable("category", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  is_income: integer({ mode: "boolean" }).notNull(),
  created_at: integer({mode: 'timestamp'})
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const userTable = sqliteTable("user", {
  id: integer().primaryKey({ autoIncrement: true }),
  username: text().notNull(),
  password: text().notNull(),
  created_at: integer({mode: 'timestamp'})
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const operationTable = sqliteTable("operation", {
  id: integer().primaryKey({ autoIncrement: true }),

  name: text().notNull(),
  description: text(),
  value: integer(),
  date: integer({mode: 'timestamp'}).default(sql`(CURRENT_TIMESTAMP)`),
  is_paid: integer({ mode: "boolean" }),
  is_income: integer({ mode: "boolean" }),
  category_id: integer().references(() => categoryTable.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),

  created_at: integer({mode: 'timestamp'})
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).$onUpdate(
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

export const operationWithCategoryView = sqliteView("vw_operation_with_category").as((qb) =>
  qb.select({
    id: operationTable.id,
    name: operationTable.name,
    description: operationTable.description,
    value: operationTable.value,
    date: operationTable.date,
    is_pad: operationTable.is_income,
    is_income: operationTable.is_income,
    category_id: operationTable.category_id,
    category_name: categoryTable.name
  }).from(operationTable).leftJoin(categoryTable, sql`operationTable.category_id = categoryTable.id`)
);

// *** TOTAL EXPENSES BY PERIOD

export const totalExpensesByDayByMonth = sqliteView(
  "vw_total_expense_by_daymonth"
).as((qb) =>
  qb
    .select({
      date: sql<string>`date(${expenseView.date}, 'unixepoch', '-3 hours')`.as("date"),
      total_value: sql<number>`CAST(SUM(${expenseView.value}) AS INTEGER)`.as(
        "total_value"
      ),
    })
    .from(expenseView)
    .where(
      sql`
    date(${expenseView.date}, 'unixepoch', '-3 hours') >= date('now', 'start of month')
    AND date(${expenseView.date}, 'unixepoch', '-3 hours') <= date('now')
  `
    )
    .groupBy(sql`date(${expenseView.date}, 'unixepoch', '-3 hours')`)
    .orderBy(sql`date(${expenseView.date}, 'unixepoch', '-3 hours')`)
);

export const totalExpensesByDay = sqliteView("vw_total_expense_by_day").as(
  (qb) =>
    qb
      .select({
        total_value: sql<number>`CAST(SUM(${expenseView.value}) AS INTEGER)`.as(
          "total_value"
        ),
      })
      .from(expenseView)
      .where(
        sql`
     date(${expenseView.date}, 'unixepoch', '-3 hours') >= date('now', 'start of day')
    AND date(${expenseView.date}, 'unixepoch', '-3 hours') <= date('now')
  `
      )
);

export const totalExpensesByWeek = sqliteView(
  "vw_total_expense_by_week"
).as((qb) =>
  qb
    .select({
      total_value: sql<number>`CAST(SUM(${expenseView.value}) AS INTEGER)`.as(
        "total_value"
      ),
    })
    .from(expenseView)
    .where(
      sql`
    date(${expenseView.date}, 'unixepoch', '-3 hours') >= date('now', 'weekday 0', '-7 days')
    AND date(${expenseView.date}, 'unixepoch', '-3 hours') <= date('now')
  `
    )
);

export const totalExpensesByMonth = sqliteView(
  "vw_total_expense_by_month"
).as((qb) =>
  qb
    .select({
      total_value: sql<number>`CAST(SUM(${expenseView.value}) AS INTEGER)`.as(
        "total_value"
      ),
    })
    .from(expenseView)
    .where(
      sql`
    date(${expenseView.date}, 'unixepoch', '-3 hours') >= date('now', 'start of month')
    AND date(${expenseView.date}, 'unixepoch', '-3 hours') <= date('now', '+1 day')
  `
    )
);

// *** TOTAL INCOMES BY PERIOD

export const totalIncomesByDayByMonth = sqliteView(
  "vw_total_income_by_daymonth"
).as((qb) =>
  qb
    .select({
      date: sql<string>`date(${incomeView.date}, 'unixepoch', '-3 hours')`.as("date"),
      total_value: sql<number>`CAST(SUM(${incomeView.value}) AS INTEGER)`.as(
        "total_value"
      ),
    })
    .from(incomeView)
    .where(
      sql`
    date(${incomeView.date}, 'unixepoch', '-3 hours') >= date('now', 'start of month')
    AND date(${incomeView.date}, 'unixepoch', '-3 hours') <= date('now')
  `
    )
    .groupBy(sql`date(${incomeView.date}, 'unixepoch', '-3 hours')`)
    .orderBy(sql`date(${incomeView.date}, 'unixepoch', '-3 hours')`)
);

export const generalBalanceView = sqliteView("vw_general_balance").as((qb) =>
  qb
    .select({
      total_incomes: sql`CAST(${sql.raw(
        "vw_income_balance.total_sum"
      )} AS INTEGER)`.as("total_incomes"),
      total_expenses: sql`CAST(${sql.raw(
        "vw_expense_balance.total_sum"
      )} AS INTEGER)`.as("total_expenses"),

      balance: sql`CAST(${sql.raw("vw_income_balance.total_sum")} - ${sql.raw(
        "vw_expense_balance.total_sum"
      )} AS INTEGER)`.as("balance"),
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