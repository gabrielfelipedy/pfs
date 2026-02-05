"use server";

import { insertOperation, updateOperation } from "@/db/queries/operation";
import { revalidatePath } from "next/cache";
import { OperationActionState, OperationSchema } from "./definitions";

const validateZodSchema = (formData: FormData) =>
  OperationSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    date: formData.get("date"),
    value: Number(formData.get("value")),
    parcelas: Number(formData.get("parcelas")),
    is_paid: formData.get("is_paid") === "true",
    is_income: true,
    category_id: Number(formData.get("category_id")),
    payment_method_id: Number(formData.get("payment_method_id")),
    period_id: formData.get("is_fixo") === "true" ? 3 : null
  });

export async function createEntrada(prevState: OperationActionState | undefined, formData: FormData): Promise<OperationActionState> {

  const validationResult = validateZodSchema(formData)

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  //console.log(validationResult.data);
  
  let result;
  try {
  result = await insertOperation(
    validationResult.data
  );
  }
  catch(error)
  {
    console.error(error)
    return {
      success: false,
      message: "Erro ao registrar entrada no banco de dados",
    };
  }

  if (!result) {
    return {
      success: false,
      errors: {
        name: ["Erro ao registrar entrada"],
      },

      message: "Erro ao registrar entrada",
    };
  }

  revalidatePath('/dashboard')
  revalidatePath('/entradas')

  return { success: true, message: "Entrada registrada com sucesso" };
}


// **************** UPDATE ***************


export async function updateIncome(prevState: OperationActionState | undefined, formData: FormData): Promise<OperationActionState> {

  const id = formData.get("id");
 
  const validationResult = validateZodSchema(formData)
  //console.log(dateFromForm)

  if (!validationResult.success) {
    //console.log(dateFromForm)
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  //console.log(validationResult.data);
  const result = await updateOperation(Number(id), validationResult.data)

  if(!result){

    return {
      success: false,
      errors: {
        name: ["Erro ao atualizar entrada"],
      },

      message: 'Erro ao atualizar entrada'
    };
  }

  revalidatePath('/dashboard')
  revalidatePath('/entradas')

  return { success: true, message: 'Entrada atualizada com sucesso' };
}