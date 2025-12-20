"use server";

import { deleteOperation } from "@/db/queries/operation";
import { revalidatePath } from "next/cache";
import { OperationActionState } from "./definitions";

export async function deleteOperationAction(
  prevState: OperationActionState | undefined,
  formData: FormData
): Promise<OperationActionState> {
  const id = Number(formData.get("id"));

  if (!id) {
    return {
      success: false,
      errors: {
        name: ["Invalid ID"],
      },

      message: "Invalid ID",
    };
  }

  const result = await deleteOperation(id);

  if (!result) {
    return {
      success: false,
      errors: {
        name: ["Error deleting record"],
      },

      message: "Error deleting record",
    };
  }

  revalidatePath("/");
  revalidatePath("/saidas");
  revalidatePath("/entradas");

  return { success: true, message: "Record deleted successfully" };
}
