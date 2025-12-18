import { db } from ".."
import { expenseView, totalExpensesByDay, totalExpensesByMonth, totalExpensesByWeek } from "../schema"

export async function getExpenses()
{
    return db.select().from(expenseView)
}

export async function getDailyExpenses() {
    return db.select().from(totalExpensesByDay)
}

export async function getWeeklyExpenses()
{
    return db.select().from(totalExpensesByWeek)
}

export async function getMonthlyExpenses()
{
    return db.select().from(totalExpensesByMonth)
}