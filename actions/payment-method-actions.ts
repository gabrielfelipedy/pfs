// actions/category-actions.ts
"use server";

import { getPaymentMethods } from "@/db/queries/payment_method";
import { PaymentMethod } from "@/lib/definitions";

export async function fetchPaymentMethodsAction() {
  try {
    const data = await getPaymentMethods();

    return data as PaymentMethod[];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch payment Methods.");
  }
}
