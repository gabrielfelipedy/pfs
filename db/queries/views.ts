import { eq } from "drizzle-orm"
import { db } from ".."
import { categoryTable } from "../schema"

export async function createExpenseBalanceView()
{
    const categories = await db.select().from(categoryTable).where(eq(categoryTable.is_income, false))

    console.log(categories)
}