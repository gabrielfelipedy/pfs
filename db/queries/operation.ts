import { asc, desc, eq } from "drizzle-orm";
import { db } from ".";
import {
  InsertOperation,
  operationTable,
  operationWithCategoryView,
  SelectOperation,
} from "../schema";

export async function getOperations() {
  return db
    .select()
    .from(operationWithCategoryView)
    .orderBy(desc(operationWithCategoryView.date), asc(operationWithCategoryView.sort_order));
}

export async function getOperationById(id: SelectOperation["id"]) {
  return db
    .select()
    .from(operationWithCategoryView)
    .where(eq(operationWithCategoryView.id, id))
    .get();
}


export async function deleteOperation(id: SelectOperation["id"]) {
  return db.delete(operationTable).where(eq(operationTable.id, id));
}

// ********* CONSTRUCTIVE OPERATIONS *********

export async function insertOperation(expense: InsertOperation) {
  return db.transaction(async (tx) => {
    const inserted = await tx
      .insert(operationTable)
      .values(expense)
      .returning({ id: operationTable.id });

    const id = inserted[0]?.id;
    if (id === undefined) {
      throw new Error("Falha ao inserir operação");
    }

    return tx
      .update(operationTable)
      .set({ sort_order: id })
      .where(eq(operationTable.id, id));
  });
}

export async function updateOperation(
  id: SelectOperation["id"],
  expense: Partial<Omit<SelectOperation, "id">>
) {
  return db
    .update(operationTable)
    .set(expense)
    .where(eq(operationTable.id, id));
}
