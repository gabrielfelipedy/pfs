"use server";

import { createDbRecordEntrada } from "@/lib/db";
import { Operation, OperationActionState, OperationSchema } from "@/lib/definitions";
import { replaceUTCTime, utcMinus3ToUtc } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createEntrada(prevState: OperationActionState | undefined, formData: FormData): Promise<OperationActionState> {
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
    valor: Number(formData.get("valor")),
    is_paid: formData.get("is_paid") == "true" ? true : false,
    categoria_id: Number(formData.get("categoria_id")),
  });

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  console.log(validationResult.data);
  const result = await createDbRecordEntrada(
    validationResult.data as unknown as Operation
  );

  if (!result) {
    return {
      success: false,
      errors: {
        name: ["Erro ao registrar entrada"],
      },

      message: "Erro ao registrar entrada",
    };
  }

  revalidatePath("/entradas");
  return { success: true, message: "Entrada registrada com sucesso" };
}