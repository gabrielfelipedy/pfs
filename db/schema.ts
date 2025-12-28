import { asc, eq, sql } from "drizzle-orm";
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
  recursive: integer({ mode: "boolean" }).notNull(),
  start_date: integer({ mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`),
  end_date: integer({ mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`),
  category_id: integer().references(() => categoryTable.id, {
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

export const ExpenseLimitWithCategoryView = sqliteView(
  "vw_expense_limit_with_category"
).as((qb) =>
  qb
    .select({
      id: expenselimitTable.id,
      name: expenselimitTable.name,
      description: expenselimitTable.description,
      value: expenselimitTable.value,
      recursive: expenselimitTable.recursive,
      start_date: expenselimitTable.start_date,
      end_date: expenselimitTable.end_date,
      category_id: expenselimitTable.category_id,
      category_name: sql<string>`category.name`.as("category_name"),
    })
    .from(expenselimitTable)
    .leftJoin(categoryTable, sql`expense_limit.category_id = category.id`)
);

export const operationTable = sqliteTable("operation", {
  id: integer().primaryKey({ autoIncrement: true }),

  name: text().notNull(),
  description: text(),
  value: integer(),
  date: integer({ mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`),
  is_paid: integer({ mode: "boolean" }),
  is_income: integer({ mode: "boolean" }),
  category_id: integer().references(() => categoryTable.id, {
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

// **** VIEWS **** //
export const incomeView = sqliteView("vw_income").as((qb) =>
  qb.select().from(operationTable).where(eq(operationTable.is_income, true))
);

export const expenseView = sqliteView("vw_expense").as((qb) =>
  qb.select().from(operationTable).where(eq(operationTable.is_income, false))
);

export const operationWithCategoryView = sqliteView(
  "vw_operation_with_category"
).as((qb) =>
  qb
    .select({
      id: operationTable.id,
      name: operationTable.name,
      description: operationTable.description,
      value: operationTable.value,
      date: operationTable.date,
      is_paid: operationTable.is_paid,
      is_income: operationTable.is_income,
      category_id: operationTable.category_id,
      category_name: sql<string>`category.name`.as("category_name"),
    })
    .from(operationTable)
    .leftJoin(categoryTable, sql`operation.category_id = category.id`)
);

export const expenseWithCategoryView = sqliteView(
  "vw_expense_with_category"
).as((qb) =>
  qb
    .select({
      id: expenseView.id,
      name: expenseView.name,
      description: expenseView.description,
      value: expenseView.value,
      date: expenseView.date,
      is_paid: expenseView.is_paid,
      is_income: expenseView.is_income,
      category_id: expenseView.category_id,
      category_name: sql<string>`category.name`.as("category_name"),
    })
    .from(expenseView)
    .leftJoin(categoryTable, sql`vw_expense.category_id = category.id`)
);

export const incomeWithCategoryView = sqliteView("vw_income_with_category").as(
  (qb) =>
    qb
      .select({
        id: incomeView.id,
        name: incomeView.name,
        description: incomeView.description,
        value: incomeView.value,
        date: incomeView.date,
        is_paid: incomeView.is_paid,
        is_income: incomeView.is_income,
        category_id: incomeView.category_id,
        category_name: sql<string>`category.name`.as("category_name"),
      })
      .from(incomeView)
      .leftJoin(categoryTable, sql`vw_income.category_id = category.id`)
);

// *** TOTAL EXPENSES BY PERIOD

export const totalExpensesByDayByMonth = sqliteView(
  "vw_total_expense_by_daymonth"
).as((qb) =>
  qb
    .select({
      date: sql<string>`date(${expenseView.date}, 'unixepoch', '-3 hours')`.as(
        "date"
      ),
      total_value: sql<number>`CAST(SUM(${expenseView.value}) AS INTEGER)`.as(
        "total_value"
      ),
    })
    .from(expenseView)
    .where(
      sql`
    date(${expenseView.date}, 'unixepoch', '-3 hours') >= date('now', '-3 hours', 'start of month')
    AND date(${expenseView.date}, 'unixepoch', '-3 hours') < date('now', '-3 hours', '+1 month', 'start of month')
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
     date(${expenseView.date}, 'unixepoch', '-3 hours') = date('now', '-3 hours')`
      )
);

export const totalExpensesByWeek = sqliteView("vw_total_expense_by_week").as(
  (qb) =>
    qb
      .select({
        day: sql<string>`date(date, 'unixepoch', '-3 hours')`.as("day"),
        total_value: sql<number>`CAST(SUM(${expenseView.value}) AS INTEGER)`.as(
          "total_value"
        ),
      })
      .from(expenseView)
      .where(
        sql`
    day >= date('now', '-3 hours', '+1 day', 'weekday 0', '-7 days')
    AND day < date('now', '-3 hours', '+1 day', 'weekday 0')
  `
      )
);

export const totalExpensesByMonth = sqliteView("vw_total_expense_by_month").as(
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
    date(${expenseView.date}, 'unixepoch', '-3 hours') >= date('now', '-3 hours', 'start of month')
    AND date(${expenseView.date}, 'unixepoch', '-3 hours') < date('now', '-3 hours', '+1 month', 'start of month')
  `
      )
);

// *** TOTAL INCOMES BY PERIOD

export const totalIncomesByDayByMonth = sqliteView(
  "vw_total_income_by_daymonth"
).as((qb) =>
  qb
    .select({
      date: sql<string>`date(${incomeView.date}, 'unixepoch', '-3 hours')`.as(
        "date"
      ),
      total_value: sql<number>`CAST(SUM(${incomeView.value}) AS INTEGER)`.as(
        "total_value"
      ),
    })
    .from(incomeView)
    .where(
      sql`
    date(${incomeView.date}, 'unixepoch', '-3 hours') >= date('now', '-3 hours', 'start of month')
    AND date(${incomeView.date}, 'unixepoch', '-3 hours') < date('now', '-3 hours', '+1 month', 'start of month')
  `
    )
    .groupBy(sql`date(${incomeView.date}, 'unixepoch', '-3 hours')`)
    .orderBy(sql`date(${incomeView.date}, 'unixepoch', '-3 hours')`)
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

export const generalBalanceView = sqliteView("vw_general_balance").as((qb) =>
  qb
    .select({
      total_incomes: sql<number>`CAST(${sql.raw(
        "vw_income_balance.total_sum"
      )} AS INTEGER)`.as("total_incomes"),
      total_expenses: sql<number>`CAST(${sql.raw(
        "vw_expense_balance.total_sum"
      )} AS INTEGER)`.as("total_expenses"),

      balance: sql<number>`CAST(${sql.raw(
        "vw_income_balance.total_sum"
      )} - ${sql.raw("vw_expense_balance.total_sum")} AS INTEGER)`.as(
        "balance"
      ),
    })
    .from(sql.raw("vw_income_balance"))
    .fullJoin(sql.raw("vw_expense_balance"), sql`1=1`)
);

export const balanceEvolutionView = sqliteView("vw_balance_evolution").as(
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
);

// ********* TOTAL INCOMES BY PERIOD **************

export const totalOperationsByDayByMonth = sqliteView(
  "vw_total_operation_by_daymonth"
).as((qb) => {
  const expensesByDayByMonth = qb.$with("expenses_by_daymonth").as(
    qb
      .select({
        date: sql<string>`date(date, 'unixepoch', '-3 hours')`.as("day"),
        total_expense: sql<number>`CAST(SUM(value) AS INTEGER)`.as(
          "total_expense"
        ),
      })
      .from(expenseView)
      .where(
        sql`day >= date('now', '-3 hours', 'start of month') AND day < date('now', '-3 hours', '+1 month', 'start of month')`
      )
      .groupBy(sql`day`)
  );

  const icomesByDayByMonth = qb.$with("incomes_by_daymonth").as(
    qb
      .select({
        date: sql<string>`date(date, 'unixepoch', '-3 hours')`.as("day"),
        total_income: sql<number>`CAST(SUM(value) AS INTEGER)`.as(
          "total_income"
        ),
      })
      .from(incomeView)
      .where(
        sql`day >= date('now', '-3 hours', 'start of month') AND day < date('now', '-3 hours', '+1 month', 'start of month')`
      )
      .groupBy(sql`day`)
  );

  return qb
    .with(expensesByDayByMonth, icomesByDayByMonth)
    .select({
      day: sql<string>`COALESCE(expenses_by_daymonth.day, incomes_by_daymonth.day)`.as(
        "day"
      ),
      total_income:
        sql<number>`IFNULL(${icomesByDayByMonth.total_income}, 0)`.as(
          "total_income"
        ),
      total_expense:
        sql<number>`IFNULL(${expensesByDayByMonth.total_expense}, 0)`.as(
          "total_expense"
        ),
      balance:
        sql<number>`(IFNULL(${icomesByDayByMonth.total_income}, 0) - IFNULL(${expensesByDayByMonth.total_expense}, 0))`.as(
          "balance"
        ),
    })
    .from(expensesByDayByMonth)
    .fullJoin(
      icomesByDayByMonth,
      eq(sql`expenses_by_daymonth.day`, sql`incomes_by_daymonth.day`)
    )
    .orderBy(sql`day`);
});

export type InsertCategory = typeof categoryTable.$inferInsert;
export type SelectCategory = typeof categoryTable.$inferSelect;

export type InsertOperation = typeof operationTable.$inferInsert;
export type SelectOperation = typeof operationTable.$inferSelect;

export type InsertUser = typeof userTable.$inferInsert;
export type SelectUser = typeof userTable.$inferSelect;

export type InsertExpenseLimit = typeof expenselimitTable.$inferInsert;
export type SelectExpenseLimit = typeof expenselimitTable.$inferSelect;
