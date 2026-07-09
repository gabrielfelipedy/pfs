import { INVESTIMENTO_CATEGORY_ID } from "@/lib/operation";
import { and, asc, eq, getTableColumns, sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  sqliteView,
  text,
} from "drizzle-orm/sqlite-core";

// ********* TABLES **********

const CREDIT_CARD_ID = 3;

export const categoryTable = sqliteTable("category", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  is_income: integer({ mode: "boolean" }).notNull(),
  created_at: integer({ mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const periodTable = sqliteTable("period", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  created_at: integer({ mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const paymentMethodTable = sqliteTable("payment_method", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  created_at: integer({ mode: "timestamp" })
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
  created_at: integer({ mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const expenselimitTable = sqliteTable("expense_limit", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  value: integer(),

  start_date: integer({ mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`),
  end_date: integer({ mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`),

  category_id: integer().references(() => categoryTable.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  period_id: integer().references(() => periodTable.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),

  created_at: integer({ mode: "timestamp" })
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
  value: integer().default(0).notNull(),
  parcelas: integer().default(1).notNull(),
  date: integer({ mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),

  start_date: integer("start_date", { mode: "timestamp" }),
  end_date: integer("end_date", { mode: "timestamp" }),

  is_paid: integer({ mode: "boolean" }).default(false).notNull(),
  is_income: integer({ mode: "boolean" }).default(false).notNull(),

  category_id: integer().references(() => categoryTable.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),

  period_id: integer().references(() => periodTable.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),

  payment_method_id: integer().references(() => paymentMethodTable.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),

  created_at: integer({ mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

// ****************** VIEWS ******************

export const CreditCardExpensesView = sqliteView("vw_credit_card_expenses").as(
  (qb) =>
    qb
      .select()
      .from(operationTable)
      .where(
        and(
          eq(operationTable.payment_method_id, CREDIT_CARD_ID),
          sql`
    date(${operationTable.date}, 'unixepoch', '-3 hours') >= date('now', '-3 hours', 'start of month')
    AND date(${operationTable.date}, 'unixepoch', '-3 hours') < date('now', '-3 hours', '+1 month', 'start of month')
  `
        )
      )
);

export const ExpenseLimitWithCategoryView = sqliteView(
  "vw_expense_limit_with_category"
).as((qb) =>
  qb
    .select({
      id: expenselimitTable.id,
      name: expenselimitTable.name,
      description: expenselimitTable.description,
      value: expenselimitTable.value,
      start_date: expenselimitTable.start_date,
      end_date: expenselimitTable.end_date,
      category_id: expenselimitTable.category_id,
      category_name: sql<string>`category.name`.as("category_name"),
      period_id: expenselimitTable.period_id,
      period_name: sql<string>`period.name`.as("period_name"),
    })
    .from(expenselimitTable)
    .leftJoin(categoryTable, sql`expense_limit.category_id = category.id`)
    .leftJoin(periodTable, sql`expense_limit.period_id = period.id`)
);

export const incomeView = sqliteView("vw_income").as((qb) =>
  qb.select().from(operationTable).where(eq(operationTable.is_income, true))
);

export const expenseView = sqliteView("vw_expense").as((qb) =>
  qb.select().from(operationTable).where(eq(operationTable.is_income, false))
);

export const investmentView = sqliteView("vw_investment").as((qb) =>
  qb
    .select()
    .from(operationTable)
    .where(eq(operationTable.category_id, INVESTIMENTO_CATEGORY_ID))
);

export const operationWithCategoryView = sqliteView(
  "vw_operation_with_category"
).as((qb) =>
  qb
    .select({
      ...getTableColumns(operationTable),

      category_name: sql<string>`category.name`.as("category_name"),
      period_name: sql<string>`period.name`.as("period_name"),

      payment_method_name: sql<string>`payment_method.name`.as(
        "payment_method_name"
      ),
    })
    .from(operationTable)
    .leftJoin(categoryTable, sql`operation.category_id = category.id`)
    .leftJoin(
      paymentMethodTable,
      sql`operation.payment_method_id = payment_method.id`
    )
    .leftJoin(periodTable, sql`operation.period_id = period.id`)
);

export const expenseWithCategoryView = sqliteView(
  "vw_expense_with_category"
).as((qb) =>
  qb
    .select()
    .from(operationWithCategoryView)
    .where(eq(operationWithCategoryView.is_income, false))
);

export const incomeWithCategoryView = sqliteView("vw_income_with_category").as(
  (qb) =>
    qb
      .select()
      .from(operationWithCategoryView)
      .where(eq(operationWithCategoryView.is_income, true))
);

// ********* BALANCES ****************

export const expenseBalanceView = sqliteView("vw_expense_balance").as((qb) =>
  qb
    .select({
      category_id: expenseWithCategoryView.category_id,
      category_name: expenseWithCategoryView.category_name,
      total: sql<number>`CAST(SUM(value) AS INTEGER)`.as("total"),
    })
    .from(expenseWithCategoryView)
    .where(
      sql`date(date, 'unixepoch', '-3 hours') >= date('now', '-3 hours', 'start of month') AND date(date, 'unixepoch', '-3 hours') < date('now', '-3 hours' , '+1 month', 'start of month')`
    )
    .groupBy(expenseWithCategoryView.category_id)
    .orderBy(expenseWithCategoryView.category_id)
);

/* export const PaymentMethodBalanceView = sqliteView(
  "vw_payment_method_balance"
).as((qb) =>
  qb
    .select({
      payment_method_id: expenseWithCategoryView.payment_method_id,
      payment_method_name: expenseWithCategoryView.payment_method_name,
      total: sql<number>`CAST(SUM(value) AS INTEGER)`.as("total"),
    })
    .from(expenseWithCategoryView)
    .where(
      sql`date(date, 'unixepoch', '-3 hours') >= date('now', '-3 hours', 'start of month') AND date(date, 'unixepoch', '-3 hours') < date('now', '-3 hours' , '+1 month', 'start of month')`
    )
    .groupBy(expenseWithCategoryView.payment_method_id)
    .orderBy(expenseWithCategoryView.payment_method_id)
);

export const incomeBalanceView = sqliteView("vw_income_balance").as((qb) =>
  qb
    .select({
      category_id: incomeWithCategoryView.category_id,
      category_name: incomeWithCategoryView.category_name,
      total: sql<number>`CAST(SUM(value) AS INTEGER)`.as("total"),
    })
    .from(incomeWithCategoryView)
    .where(
      sql`date(date, 'unixepoch', '-3 hours') >= date('now', '-3 hours', 'start of month') AND date(date, 'unixepoch', '-3 hours') < date('now', '-3 hours' , '+1 month', 'start of month')`
    )
    .groupBy(incomeWithCategoryView.category_id)
    .orderBy(incomeWithCategoryView.category_id)
);

export const generalBalanceView = sqliteView("vw_general_balance").as((qb) => {
  const incomes = qb.$with("incomes").as(
    qb
      .select({
        total_incomes: sql<number>`COALESCE(SUM(total), 0)`.as("total_incomes"),
      })
      .from(incomeBalanceView)
  );

  const expenses = qb.$with("expenses").as(
    qb
      .select({
        total_expenses: sql<number>`COALESCE(SUM(total), 0)`.as(
          "total_expenses"
        ),
      })
      .from(expenseBalanceView)
  );

  return qb
    .with(incomes, expenses)
    .select({
      total_incomes: sql<number>`incomes.total_incomes`.as("total_incomes"),
      total_expenses: sql<number>`expenses.total_expenses`.as("total_expenses"),
      balance: sql<number>`incomes.total_incomes - expenses.total_expenses`.as(
        "balance"
      ),
    })
    .from(incomes)
    .leftJoin(expenses, sql`1=1`);
}); */

/* export const balanceEvolutionView = sqliteView("vw_balance_evolution").as(
  (qb) => {
    const dailySum = qb.$with("expenses_by_daymonth").as(
      qb
        .select({
          day: sql<string>`date(date, 'unixepoch', '-3 hours')`.as("day"),
          total_expense: sql<number>`CAST(SUM(value) AS INTEGER)`.as(
            "total_expense"
          ),
        })
        .from(expenseView)
        .where(
          sql`day >= date('now', '-3 hours', 'start of month') AND day < date('now', '-3 hours' , '+1 month', 'start of month')`
        )
        .groupBy(sql`day`)
    );

    return qb
      .with(dailySum)
      .select({
        day: dailySum.day,
        balance: sql<number>`CAST(${qb
          .select({ total_incomes: generalBalanceView.total_incomes })
          .from(generalBalanceView)
          .limit(1)} - SUM(${dailySum.total_expense}) OVER (ORDER BY ${
          dailySum.day
        } ASC) AS INTEGER)`.as("balance"),
      })
      .from(dailySum)
      .orderBy(asc(dailySum.day));
  }
); */

export const expenseLimitBalanceView = sqliteView(
  "vw_expense_limit_balance"
).as((qb) =>
  qb
    .select({
      id: ExpenseLimitWithCategoryView.id,
      name: ExpenseLimitWithCategoryView.name,
      value: ExpenseLimitWithCategoryView.value,
      period_id: ExpenseLimitWithCategoryView.period_id,
      start_date: ExpenseLimitWithCategoryView.start_date,
      end_date: ExpenseLimitWithCategoryView.end_date,
      category_id:
        sql<number>`"vw_expense_limit_with_category"."category_id"`.as(
          "category_id"
        ),
      category_name:
        sql<string>`"vw_expense_limit_with_category"."category_name"`.as(
          "category_name"
        ),
      period_name:
        sql<string>`"vw_expense_limit_with_category"."period_name"`.as(
          "period_name"
        ),
      spend: expenseBalanceView.total,
    })
    .from(ExpenseLimitWithCategoryView)
    .leftJoin(
      expenseBalanceView,
      eq(
        ExpenseLimitWithCategoryView.category_id,
        expenseBalanceView.category_id
      )
    )
);

export type InsertCategory = typeof categoryTable.$inferInsert;
export type SelectCategory = typeof categoryTable.$inferSelect;

export type InsertOperation = typeof operationTable.$inferInsert;
export type SelectOperation = typeof operationTable.$inferSelect;

export type InsertUser = typeof userTable.$inferInsert;
export type SelectUser = typeof userTable.$inferSelect;

export type InsertExpenseLimit = typeof expenselimitTable.$inferInsert;
export type SelectExpenseLimit = typeof expenselimitTable.$inferSelect;
