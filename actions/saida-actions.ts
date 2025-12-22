"use server"

import { insertOperation, updateOperation } from "@/db/queries/operation";
import { replaceUTCTime, utcMinus3ToUtc } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { OperationActionState, OperationSchema } from "./definitions";

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
    is_paid: formData.get("is_paid") === "true",
    is_income: false,
    category_id: Number(formData.get("category_id")),
  });

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  //console.log(validationResult.data);
  const result = await insertOperation(
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

  revalidatePath('/')
  revalidatePath('/saidas')

  return { success: true, message: "Saída criada com sucesso" };
}

// **************** UPDATE ***************

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
    is_paid: formData.get("is_paid") === "true",
    is_income: false,
    category_id: Number(formData.get("category_id")),
  });

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  console.log(validationResult.data);
  const result = await updateOperation(Number(id), validationResult.data)

  if(!result){

    return {
      success: false,
      errors: {
        name: ["Erro ao atualizar saída"],
      },

      message: 'Erro ao atualizar saída'
    };
  }

  revalidatePath('/')
  revalidatePath('/saidas')

  return { success: true, message: 'Saída atualizada com sucesso' };
}