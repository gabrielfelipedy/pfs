import { eq } from "drizzle-orm";
import { db } from "..";
import { categoryTable } from "../schema";

export async function getCategories()
{
    return db.select().from(categoryTable)
}

export async function getIncomeCategories()
{
    return db.select().from(categoryTable).where(eq(categoryTable.is_income, true))
}

export async function getExpenseCategories()
{
    return db.select().from(categoryTable).where(eq(categoryTable.is_income, false))
}