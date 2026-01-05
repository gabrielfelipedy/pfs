import { isSameWeek, isToday } from "date-fns";
import { Operation } from "./definitions";

export const calculateIncomes = (operations: Operation[]) => {
  let total = 0;
  operations.forEach((operation) => {
    if (operation.is_income) {
      total += operation.value ?? 0;
    }
  });
  return total;
};

export const calculateWeeklyExpenses = (operations: Operation[]) => {
  let total = 0;

  operations.forEach((operation) => {
    if (
      !operation.is_income &&
      isSameWeek(new Date(operation.date ?? ""), new Date(), {
        weekStartsOn: 0,
      })
    ) {
      total += operation.value ?? 0;
    }
  });
  return total;
};

export const calculateDailyExpenses = (operations: Operation[]) => {
  let total = 0;

  operations.forEach((operation) => {
    if (!operation.is_income && isToday(new Date(operation.date ?? ""))) {
      total += operation.value ?? 0;
    }
  });
  return total;
};

export function formatMonthYear(input: string): string {
  // Split "12-2025" into [12, 2025]
  const [month, year] = input.split("-").map(Number);

  // Create a date object (Note: months are 0-indexed in JS, so subtract 1)
  const date = new Date(year, month - 1);

  // Format using Intl for Portuguese (pt-BR)
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}