import { asc, desc } from "drizzle-orm";
import { db } from ".";
import { expenseWithCategoryView } from "../schema";

export async function getExpenses() {
  return db
    .select()
    .from(expenseWithCategoryView)
    .orderBy(desc(expenseWithCategoryView.date), asc(expenseWithCategoryView.sort_order));
}
// **************** CHARTS OPERATIONS ************
