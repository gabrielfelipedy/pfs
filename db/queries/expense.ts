import { desc, eq } from "drizzle-orm"
import { db } from ".."
import { expenseView, InsertOperation, operationTable, SelectOperation, totalExpensesByDay, totalExpensesByMonth, totalExpensesByWeek } from "../schema"

export async function getExpenses()
{
    return db.select().from(expenseView).orderBy(desc(expenseView.date))
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

// ******** INSERTION CODES *********

export async function insertExpense(expense: InsertOperation) {
 
  return db.insert(operationTable).values(expense)
}

export async function updateExpense(id: SelectOperation['id'], expense: Partial<Omit<SelectOperation, 'id'>>) {
  return db.update(operationTable).set(expense).where(eq(operationTable.id, id))
}