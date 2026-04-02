import { desc } from "drizzle-orm";
import { db } from ".";
import { incomeWithCategoryView } from "../schema";

export async function getIncomes() {
  return db
    .select()
    .from(incomeWithCategoryView)
    .orderBy(desc(incomeWithCategoryView.date));
}