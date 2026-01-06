// actions/category-actions.ts
"use server";

import { getIncomeCategories, getExpenseCategories } from "@/db/queries/category";
import { Category } from "@/lib/definitions";
import { getPaymentMethods } from "@/db/queries/payment_method";
import { PaymentMethod } from "@/lib/definitions";
import { getPeriods } from "@/db/queries/period";

export async function fetchCategoriesAction(is_income: boolean) {
  try {
    const categories = is_income 
      ? await getIncomeCategories() 
      : await getExpenseCategories();
      
    return categories as Category[];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch categories.");
  }
}

export async function fetchPaymentMethodsAction() {
  try {
    const data = await getPaymentMethods();

    return data as PaymentMethod[];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch payment Methods.");
  }
}

export async function fetchPeriodsAction() {
  try {
    const data = await getPeriods();

    return data as PaymentMethod[];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch periods.");
  }
}