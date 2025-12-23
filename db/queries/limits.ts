import { db } from "..";
import { expenselimitTable, ExpenseLimitWithCategoryView, InsertExpenseLimit } from "../schema";

export async function getExpensesLimit()
{
    return db.select().from(ExpenseLimitWithCategoryView)
}

export async function InsertExpensesLimit(values: InsertExpenseLimit)
{
    return db.insert(expenselimitTable).values(values)
}