"use server"

import { insertExpense, updateExpense } from "@/db/queries/expense";
import { Operation, OperationActionState, OperationSchema } from "@/lib/definitions";
import { replaceUTCTime, utcMinus3ToUtc } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createSaida(prevState: OperationActionState | undefined, formData: FormData): Promise<OperationActionState> {
  const date = formData.get("date");
  const time = formData.get("time");

  let timestamp: string;
  try {
    timestamp = replaceUTCTime(date as string, utcMinus3ToUtc(time as string));
  } catch (error) {
    return {
      success: false,
      errors: {
        date: ["Invalid date or time format"],
      },
    };
  }

  console.log(timestamp);

  const validationResult = OperationSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    date: timestamp,
    value: Number(formData.get("value")),
    is_paid: formData.get("is_paid") == "true" ? true : false,
    is_income: false,
    category_id: Number(formData.get("categoria_id")),
  });

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  console.log(validationResult.data);
  const result = await insertExpense(
    validationResult.data
  );

  if (!result) {
    return {
      success: false,
      errors: {
        name: ["Erro ao criar saída"],
      },

      message: "Erro ao criar saída",
    };
  }

  revalidatePath("/saidas");
  return { success: true, message: "Saída criada com sucesso" };
}

export async function updateSaida(prevState: OperationActionState | undefined, formData: FormData): Promise<OperationActionState> {

  const id = formData.get("id");
  const date = formData.get("date");
  const time = formData.get("time");

  const timestamp = replaceUTCTime(
      date as string,
      utcMinus3ToUtc(time as string)
  );

  console.log(timestamp);


  const validationResult = OperationSchema.safeParse({
    id: Number(id),
    name: formData.get("name"),
    description: formData.get("description"),
    date: timestamp,
    value: Number(formData.get("value")),
    is_paid: formData.get("is_paid") == "true" ? true : false,
    is_income: false,
    category_id: Number(formData.get("categoria_id")),
  });

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  console.log(validationResult.data);
  const result = await updateExpense(Number(id), validationResult.data)

  if(!result){

    return {
      success: false,
      errors: {
        name: ["Erro ao atualizar saída"],
      },

      message: 'Erro ao atualizar saída'
    };
  }

  revalidatePath("/saidas");
  return { success: true, message: 'Saída atualizada com sucesso' };
}