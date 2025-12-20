import { desc, eq } from "drizzle-orm";
import { db } from "..";
import { InsertOperation, operationTable, operationWithCategoryView, SelectOperation, totalOperationsByDayByMonth } from "../schema";

export async function getOperations() {
    return db.select().from(operationWithCategoryView).orderBy(desc(operationWithCategoryView.date))
}

export async function getOperationEvolution()
{
  return db.select().from(totalOperationsByDayByMonth)
}

export async function deleteOperation(id: SelectOperation['id'])
{
    return db.delete(operationTable).where(eq(operationTable.id, id))
}

// ********* CONSTRUCTIVE OPERATIONS *********

export async function insertOperation(expense: InsertOperation) {
 
  return db.insert(operationTable).values(expense)
}

export async function updateOperation(id: SelectOperation['id'], expense: Partial<Omit<SelectOperation, 'id'>>) {
  return db.update(operationTable).set(expense).where(eq(operationTable.id, id))
}