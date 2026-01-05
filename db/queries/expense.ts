import { desc } from "drizzle-orm";
import { db } from ".";
import { expenseWithCategoryView } from "../schema";

export async function getExpenses() {
  return db
    .select()
    .from(expenseWithCategoryView)
    .orderBy(desc(expenseWithCategoryView.date));
}
// **************** CHARTS OPERATIONS ************
