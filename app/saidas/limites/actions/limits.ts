"use server";

import { ExpenseLimitActionState, ExpenseLimitSchema } from "./definitions";
import { revalidatePath } from "next/cache";
import { InsertExpensesLimit, updateDbExpenseLimit } from "@/db/queries/limits";
import { replaceUTCTime } from "@/lib/utils";

export async function createExpenseLimit(
  prevState: ExpenseLimitActionState | undefined,
  formData: FormData
): Promise<ExpenseLimitActionState> {
  const validationResult = ExpenseLimitSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    value: Number(formData.get("value")),
    recursive: formData.get("recursive") === "true",
    start_date: replaceUTCTime(formData.get("start_date") as string, '00:00:00'),
    end_date: replaceUTCTime(formData.get("end_date") as string, '23:59:59'),
    category_id: Number(formData.get("category_id")),
  });

  if (!validationResult.success) {
    //console.log(validationResult)

    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  console.log(validationResult.data);
  const result = await InsertExpensesLimit(validationResult.data);

  if (!result) {
    return {
      success: false,
      errors: {
        name: ["Erro ao criar novo limite"],
      },

      message: "Erro ao criar novo limite",
    };
  }

  revalidatePath("/saidas/limites");

  return { success: true, message: "Limite de gastos criado com sucesso" };
}

export async function updateExpenseLimit(
  prevState: ExpenseLimitActionState | undefined,
  formData: FormData
): Promise<ExpenseLimitActionState> {

  const id = Number(formData.get("id"))

  const validationResult = ExpenseLimitSchema.safeParse({
    id: id,
    name: formData.get("name"),
    description: formData.get("description"),
    value: Number(formData.get("value")),
    recursive: formData.get("recursive") === "true",
    start_date: replaceUTCTime(formData.get("start_date") as string, '03:00:00'),
    end_date: replaceUTCTime(formData.get("end_date") as string, '03:00:00'),
    category_id: Number(formData.get("category_id")),
  });

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  console.log(validationResult.data);
  const result = await updateDbExpenseLimit(id, validationResult.data);

  if (!result) {
    return {
      success: false,
      errors: {
        name: ["Erro ao atualizar limite"],
      },

      message: "Erro ao atualizar limite",
    };
  }

  revalidatePath('/saidas/limites')

  return { success: true, message: "Limite de gastos atualizado com sucesso" };
}