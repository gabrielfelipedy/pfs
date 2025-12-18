import { desc } from "drizzle-orm"
import { db } from ".."
import { generalBalanceView, incomeView } from "../schema"

export async function getIncomes()
{
    return db.select().from(incomeView).orderBy(desc(incomeView.date))
}

export async function getMonthlyIncomes()
{
    return db.select({total_incomes: generalBalanceView.total_incomes}).from(generalBalanceView)
}