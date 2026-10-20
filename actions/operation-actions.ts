"use server";

import { deleteOperation, getOperationById, insertOperation, updateOperation } from "@/db/queries/operation";
import { revalidatePath } from "next/cache";
import { OperationActionState, OperationSchema } from "./definitions";
import { sameUtcMinus3Day } from "@/lib/reorder";
import { db } from "@/db/queries";
import { eq } from "drizzle-orm";
import { operationTable } from "@/db/schema";
import { toUtcMinus3Instant } from "@/lib/date";

const validateZodSchema = (formData: FormData, is_income: boolean) =>
  OperationSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    date: toUtcMinus3Instant(new Date(formData.get("date") as string)),
    value: Number(formData.get("value")),
    parcelas: formData.get("parcelas") ? Number(formData.get("parcelas")) : 1,
    is_paid: formData.get("is_paid") === "true",
    is_income,
    category_id: Number(formData.get("category_id")),
    payment_method_id: Number(formData.get("payment_method_id")),
    period_id: formData.get("is_fixo") === "true" ? 3 : null,
    start_date: formData.get("start_date") ? toUtcMinus3Instant(new Date(formData.get("start_date") as string)) : null,
    end_date: formData.get("end_date") ? toUtcMinus3Instant(new Date(formData.get("end_date") as string)) : null,
  });

export async function duplicateOperationAction(
  prevState: OperationActionState | undefined,
  formData: FormData
): Promise<OperationActionState> {
  const id = Number(formData.get("id"));

  if (!id) {
    return {
      success: false,
      message: "Invalid ID",
    };
  }

  const operation = await getOperationById(id);

  if (!operation) {
    return {
      success: false,
      message: "Transação não encontrada",
    };
  }

  const result = await insertOperation({
    name: `${operation.name} (1)`,
    description: operation.description,
    value: operation.value,
    parcelas: operation.parcelas,
    date: operation.date,
    is_paid: operation.is_paid,
    is_income: operation.is_income,
    category_id: operation.category_id,
    payment_method_id: operation.payment_method_id,
    period_id: operation.period_id,
    start_date: operation.start_date,
    end_date: operation.end_date,
  });

  if (!result) {
    return {
      success: false,
      errors: {
        name: ["Erro ao duplicar transação"],
      },
      message: "Erro ao duplicar transação",
    };
  }

  revalidatePath("/dashboard");

  return { success: true, message: "Transação duplicada com sucesso" };
}

export async function updateOperationAction(
  prevState: OperationActionState | undefined,
  formData: FormData
): Promise<OperationActionState> {
  const id = Number(formData.get("id"));

  if (!id) {
    return {
      success: false,
      message: "Transação inválida",
    };
  }

  const existing = await getOperationById(id);

  if (!existing) {
    return {
      success: false,
      message: "Transação não encontrada",
    };
  }

  // is_income is derived from the persisted record, never from the client / the
  // bound action, so editing can never flip a transaction between income/expense.
  const validationResult = validateZodSchema(formData, existing.is_income ?? false);

  if (!validationResult.success) {
    return {
      success: false,
      message: "Erro de validação. Verifique os campos.",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const result = await updateOperation(id, validationResult.data);

  if (!result) {
    return {
      success: false,
      errors: {
        name: ["Erro ao atualizar transação"],
      },
      message: "Erro ao atualizar transação",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/limites");

  return { success: true, message: "Transação atualizada com sucesso" };
}

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

  revalidatePath("/dashboard");

  return { success: true, message: "Saída deletada com sucesso" };
}

export async function moveOperationAction(
  prevState: OperationActionState | undefined,
  formData: FormData
): Promise<OperationActionState> {
  const id = Number(formData.get("id"));
  const neighborId = Number(formData.get("neighborId"));

  if (!id || !neighborId || id === neighborId) {
    return {
      success: false,
      message: "Transação inválida para reordenação",
    };
  }

  const operation = await getOperationById(id);
  const neighbor = await getOperationById(neighborId);

  if (!operation || !neighbor) {
    return {
      success: false,
      message: "Transação não encontrada",
    };
  }

  if (!sameUtcMinus3Day(operation.date, neighbor.date)) {
    return {
      success: false,
      message: "Só é possível reordenar transações do mesmo dia",
    };
  }

  await db.transaction(async (tx) => {
    await tx
      .update(operationTable)
      .set({ sort_order: neighbor.sort_order })
      .where(eq(operationTable.id, id));

    await tx
      .update(operationTable)
      .set({ sort_order: operation.sort_order })
      .where(eq(operationTable.id, neighborId));
  });

  revalidatePath("/dashboard");

  return { success: true, message: "Ordem atualizada com sucesso" };
}
