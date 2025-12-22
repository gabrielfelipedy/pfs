"use server"



import { replaceUTCTime, utcMinus3ToUtc } from "@/lib/utils";
import { ExpenseLimitActionState, ExpenseLimitSchema } from "./definitions";
import { revalidatePath } from "next/cache";
import { InsertExpensesLimit } from "@/db/queries/limits";

export async function createExpenseLimit(prevState: ExpenseLimitActionState | undefined, formData: FormData): Promise<ExpenseLimitActionState> {
  const date = formData.get("date");
  const time = formData.get("time");

  let timestamp: string;
  try {
    timestamp = replaceUTCTime(date as string, utcMinus3ToUtc(time as string));
  } catch (error) {
    return {
      success: false,
      errors: {
        start_date: ["Invalid date or time format"],
      },
    };
  }

  console.log(timestamp);

  const validationResult = ExpenseLimitSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    value: Number(formData.get("value")),
    // lacking recursive
    start_date: timestamp,
    // lacking end date
    category_id: Number(formData.get("category_id")),
  });

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  //console.log(validationResult.data);
  const result = await InsertExpensesLimit(
    validationResult.data
  );

  if (!result) {
    return {
      success: false,
      errors: {
        name: ["Erro ao criar novo limite"],
      },

      message: "Erro ao criar novo limite",
    };
  }

  revalidatePath('/saidas/limites')

  return { success: true, message: "Limite de gastos criado com sucesso" };
}