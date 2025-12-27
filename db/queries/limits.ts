import { eq } from "drizzle-orm";
import { db } from "..";
import { expenselimitTable, ExpenseLimitWithCategoryView, InsertExpenseLimit, SelectExpenseLimit } from "../schema";

export async function getExpensesLimit()
{
    return db.select().from(ExpenseLimitWithCategoryView)
}

export async function InsertExpensesLimit(values: InsertExpenseLimit)
{
    return db.insert(expenselimitTable).values(values)
}

export async function updateDbExpenseLimit(id: SelectExpenseLimit['id'], limit: Partial<Omit<SelectExpenseLimit, 'id'>>) {
  return db.update(expenselimitTable).set(limit).where(eq(expenselimitTable.id, id))
}