"use server";

import { insertOperation } from "@/db/queries/operation";
import { revalidatePath } from "next/cache";
import { OperationActionState, OperationSchema } from "./definitions";
import { toUtcMinus3Instant } from "@/lib/date";

const validateZodSchema = (formData: FormData) =>
  OperationSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    date: toUtcMinus3Instant(new Date(formData.get("date") as string)),
    value: Number(formData.get("value")),
    parcelas: formData.get("parcelas") ? Number(formData.get("parcelas")) : 1,
    is_paid: formData.get("is_paid") === "true",
    is_income: false,
    category_id: Number(formData.get("category_id")),
    payment_method_id: Number(formData.get("payment_method_id")),
    period_id: formData.get("is_fixo") === "true" ? 3 : null,
    start_date: formData.get("start_date") ? toUtcMinus3Instant(new Date(formData.get("start_date") as string)) : null,
    end_date: formData.get("end_date") ? toUtcMinus3Instant(new Date(formData.get("end_date") as string)) : null,
  });

export async function createSaida(
  prevState: OperationActionState | undefined,
  formData: FormData
): Promise<OperationActionState> {
  const validationResult = validateZodSchema(formData);

  if (!validationResult.success) {
    return {
      success: false,
      message: "Erro de validação. Verifique os campos.",
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
  revalidatePath("/dashboard/limites");

  return { success: true, message: "Saída criada com sucesso" };
}
