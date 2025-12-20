import { NextResponse } from "next/server";
import { getIncomeCategories, getExpenseCategories } from "@/db/queries/category";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    const categories = type === "income" 
      ? await getIncomeCategories() 
      : await getExpenseCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}