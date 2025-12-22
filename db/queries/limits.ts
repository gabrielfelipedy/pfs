import { db } from "..";
import { expenselimitTable, InsertExpenseLimit } from "../schema";

export async function getExpensesLimit()
{
    return db.select().from(expenselimitTable)
}

export async function InsertExpensesLimit(values: InsertExpenseLimit)
{
    return db.insert(expenselimitTable).values(values)
}