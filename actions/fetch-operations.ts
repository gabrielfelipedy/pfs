"use server";

import { getOperations } from "@/db/queries/operation";

export async function fetchOperationsAction() {
  return getOperations();
}
