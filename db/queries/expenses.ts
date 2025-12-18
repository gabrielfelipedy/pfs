import { db } from ".."
import { operationTable } from "../schema"

export async function getOperations() {
    return db.select().from(operationTable)
}