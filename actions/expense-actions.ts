"use server";

import { insertOperation, updateOperation } from "@/db/queries/operation";
import { replaceUTCTime, utcMinus3ToUtc } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { OperationActionState, OperationSchema } from "./definitions";

const validateZodSchema = (formData: FormData) =>
  OperationSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    date: formData.get("date"),
    value: Number(formData.get("value")),
    is_paid: formData.get("is_paid") === "true",
    is_income: false,
    category_id: Number(formData.get("category_id")),
    payment_method_id: Number(formData.get("payment_method_id")),
    period_id: formData.get("is_fixo") === "true" ? 3 : null,
  });

export async function createSaida(
  prevState: OperationActionState | undefined,
  formData: FormData
): Promise<OperationActionState> {
  const validationResult = validateZodSchema(formData);

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  //console.log(validationResult.data);
  const result = await insertOperation(validationResult.data);

  if (!result) {
    return {
      success: false,
      errors: {
        name: ["Erro ao criar saída"],
      },

      message: "Erro ao criar saída",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/saidas");
  revalidatePath("/saidas/limites");

  return { success: true, message: "Saída criada com sucesso" };
}

// **************** UPDATE ***************

export async function updateSaida(
  prevState: OperationActionState | undefined,
  formData: FormData
): Promise<OperationActionState> {
  const id = formData.get("id");

  const validationResult = validateZodSchema(formData);

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  console.log(validationResult.data);
  const result = await updateOperation(Number(id), validationResult.data);

  if (!result) {
    return {
      success: false,
      errors: {
        name: ["Erro ao atualizar saída"],
      },

      message: "Erro ao atualizar saída",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/saidas");
  revalidatePath("/saidas/limites");

  return { success: true, message: "Saída atualizada com sucesso" };
}
