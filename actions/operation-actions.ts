"use server";

import { deleteOperation } from "@/db/queries/operation";
import { OperationActionState } from "@/lib/definitions";
import { revalidatePath } from "next/cache";

export async function deleteOperationAction(prevState: OperationActionState | undefined, formData: FormData): Promise<OperationActionState> {
  const id = Number(formData.get("id"));

  if(!id){
    return {
      success: false,
      errors: {
        name: ["Invalid ID"],
      },

      message: 'Invalid ID'
    };
  }

  const result = await deleteOperation(id);

  if(!result){
    return {
      success: false,
      errors: {
        name: ["Error deleting record"],
      },

      message: 'Error deleting record'
    };
  }

  // change to revalide the current path
  revalidatePath("/saidas");
  return { success: true, message: 'Record deleted successfully' };
}