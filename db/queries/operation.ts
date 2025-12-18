import { desc, eq } from "drizzle-orm";
import { db } from "..";
import { operationTable, SelectOperation } from "../schema";

export async function getOperations() {
    return db.select().from(operationTable).orderBy(desc(operationTable.date))
}

export async function deleteOperation(id: SelectOperation['id'])
{
    return db.delete(operationTable).where(eq(operationTable.id, id))
}