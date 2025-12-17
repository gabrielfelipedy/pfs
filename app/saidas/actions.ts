"use server";

import { createDbRecordSaida, deleteDbOperation, Operation, updateDbRecordSaida } from "@/lib/db";
import { SaidaSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { toast } from "sonner";

export type SaidaActionState =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message?: string;
      errors: {
        name?: string[];
        description?: string[];
        date?: string[];
        valor?: string[];
        is_paid?: string[];
        categoria_id?: string[];
      };
    };

function utcMinus3ToUtc(time: string): string {
  if (!time || typeof time !== "string") {
    throw new Error("Invalid time format");
  }

  const [h, m, s] = time.split(":").map(Number);

  // Create date in UTC-3
  const date = new Date(Date.UTC(1970, 0, 1, h + 3, m, s));

  return date.toISOString().substring(11, 19);
}

function replaceUTCTime(utcTimestamp: string, time: string): string {
  const date = new Date(utcTimestamp);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid UTC timestamp");
  }

  const [hour, minute, second = 0] = time.split(":").map(Number);

  if ([hour, minute, second].some(Number.isNaN)) {
    throw new Error("Invalid time format");
  }

  date.setUTCHours(hour, minute, second, 0);

  return date.toISOString();
}

export async function createSaida(prevState: SaidaActionState | undefined, formData: FormData): Promise<SaidaActionState> {
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

  const validationResult = SaidaSchema.safeParse({
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
  const result = await createDbRecordSaida(
    validationResult.data as unknown as Operation
  );

  if (!result) {
    return {
      success: false,
      errors: {
        name: ["Error creating record"],
      },

      message: "Error creating record",
    };
  }

  revalidatePath("/saidas");
  return { success: true, message: "Record created successfully" };
}

export async function updateSaida(prevState: SaidaActionState | undefined, formData: FormData): Promise<SaidaActionState> {

  const id = formData.get("id");
  const date = formData.get("date");
  const time = formData.get("time");

  const timestamp = replaceUTCTime(
      date as string,
      utcMinus3ToUtc(time as string)
  );

  console.log(timestamp);


  const validationResult = SaidaSchema.safeParse({
    id: Number(id),
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
  const result =await updateDbRecordSaida(validationResult.data as unknown as Operation);

  if(!result){

    return {
      success: false,
      errors: {
        name: ["Error updating record"],
      },

      message: 'Error updating record'
    };
  }

  revalidatePath("/saidas");
  return { success: true, message: 'Record updated successfully' };
}

export async function deleteOperation(id: number | undefined) {
  //console.log(id)

  if(!id){
    throw new Error("Invalid ID");
  }

  const result = await deleteDbOperation(id);

  if(!result){
    throw new Error("Error deleting record");
  }

  revalidatePath("/saidas");
}