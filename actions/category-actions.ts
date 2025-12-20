// actions/category-actions.ts
"use server";

import { verifySession } from "@/lib/session"; // Adjust path to your session file
import { getIncomeCategories, getExpenseCategories } from "@/db/queries/category";
import { Category } from "@/lib/definitions";

export async function fetchCategoriesAction(is_income: boolean) {
  // 1. This will redirect to /login automatically if the session is invalid
  // because of your verifySession implementation.
  await verifySession();

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