import { Category } from "./definitions";

export const filterIncomeCategories = (categories: Category[]) => {
  return categories.filter((category) => category.is_income);
}

export const filterExpenseCategories = (categories: Category[]) => {
  return categories.filter((category) => !category.is_income);
}