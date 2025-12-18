import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { categoryTable } from "../schema";

export async function createExpenseBalanceView() {
  const categories = await db
    .select()
    .from(categoryTable)
    .where(eq(categoryTable.is_income, false));

  const pivotClauses = categories.map((cat) => {
    const safeName = `total_${cat.name}`;
    const catId = (cat.id).toString()

    return sql`
    CAST(SUM(CASE WHEN category_id = ${sql.raw(catId)} THEN value ELSE 0 END) AS INTEGER) AS ${sql.raw(safeName)}`;
  });

  const query = sql`
        CREATE VIEW IF NOT EXISTS vw_expense_balance AS
        SELECT 
        ${sql.join(pivotClauses, sql`, `)},
        CAST(SUM(CASE WHEN category_id IS NULL THEN value ELSE 0 END) AS INTEGER) AS total_uncategorized,
        CAST(SUM(value) AS INTEGER) AS total_sum
        FROM vw_expense
    `;

  await db.run(sql`DROP VIEW IF EXISTS vw_expense_balance`)
  await db.run(query);
  console.log("View vw_expense_balance foi atualizada dinamicamente.");
}

export async function createIncomeBalanceView() {
  const categories = await db
    .select()
    .from(categoryTable)
    .where(eq(categoryTable.is_income, true));

  const pivotClauses = categories.map((cat) => {
    const safeName = `total_${cat.name}`;
    const catId = (cat.id).toString()

    return sql`
    CAST(SUM(CASE WHEN category_id = ${sql.raw(catId)} THEN value ELSE 0 END) AS INTEGER) AS ${sql.raw(safeName)}`;
  });

  const query = sql`
        CREATE VIEW IF NOT EXISTS vw_income_balance AS
        SELECT 
        ${sql.join(pivotClauses, sql`, `)},
        CAST(SUM(CASE WHEN category_id IS NULL THEN value ELSE 0 END) AS INTEGER) AS total_uncategorized,
        CAST(SUM(value) AS INTEGER) AS total_sum
        FROM vw_income
    `;

  await db.run(sql`DROP VIEW IF EXISTS vw_income_balance`)
  await db.run(query);
  console.log("View vw_income_balance foi atualizada dinamicamente.");
}