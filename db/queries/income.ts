import { desc, sql } from "drizzle-orm";
import { db } from "..";
import {
  generalBalanceView,
  incomeWithCategoryView,
  totalIncomesByDayByMonth,
} from "../schema";

export async function getIncomes() {
  return db.select().from(incomeWithCategoryView).orderBy(desc(incomeWithCategoryView.date));
}

export async function getMonthlyIncomes() {
  return db
    .select({ total_incomes: generalBalanceView.total_incomes })
    .from(generalBalanceView);
}

// **************** CHARTS OPERATIONS ************

export async function getIncomesEvolution() {
  return db.select().from(totalIncomesByDayByMonth);
}

export async function getIncomesProportion() {
  return await db.run(sql`SELECT * FROM vw_income_balance`);
}