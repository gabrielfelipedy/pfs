"use server";
;
import { OperationActionState } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { deleteDbOperation } from "./db";


export async function deleteOperation(prevState: OperationActionState | undefined, formData: FormData): Promise<OperationActionState> {
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

  const result = await deleteDbOperation(id);

  if(!result){
    return {
      success: false,
      errors: {
        name: ["Error deleting record"],
      },

      message: 'Error deleting record'
    };
  }

  revalidatePath("/saidas");
  return { success: true, message: 'Record deleted successfully' };
}