"use server";

import { SaidaSchema } from "@/lib/definitions";

export async function createSaida(prevState: any, formData: FormData) {
  const date = formData.get("date");
  const time = formData.get("time");

  console.log({ date, time });

  const validationResult = SaidaSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    date: formData.get("date"),
    valor: Number(formData.get("valor")),
    is_paid: formData.get("is_paid") === "on" ? true : false,
    categoria_id: Number(formData.get("categoria_id")),
  });

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  console.log(validationResult.data);
}
