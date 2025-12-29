import { desc, sql } from "drizzle-orm";
import { db } from ".";
import {
  expenseBalanceView,
  expenseWithCategoryView,
  totalExpensesByDay,
  totalExpensesByDayByMonth,
  totalExpensesByMonth,
  totalExpensesByWeek,
} from "../schema";

export async function getExpenses() {
  return db
    .select()
    .from(expenseWithCategoryView)
    .orderBy(desc(expenseWithCategoryView.date));
}

export async function getDailyExpenses() {
  return db.select().from(totalExpensesByDay);
}

export async function getWeeklyExpenses() {
  return db.select().from(totalExpensesByWeek);
}

export async function getMonthlyExpenses() {
  return db.select().from(totalExpensesByMonth);
}

// **************** CHARTS OPERATIONS ************

export async function getExpensesEvolution() {
  return db.select().from(totalExpensesByDayByMonth);
}

export async function getExpensesProportion() {
  return db.select().from(expenseBalanceView);
}
