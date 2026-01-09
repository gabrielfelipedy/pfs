import { Operation } from "./definitions";

export function convertUtcToLocal(date: Date): Date {
  const UTC_MINUS_3_OFFSET_MS = 3 * 60 * 60 * 1000; // UTC-3 offset in milliseconds
  return new Date(date.getTime() - UTC_MINUS_3_OFFSET_MS);
}

export function convertLocalToUtc(date: Date): Date {
  const UTC_MINUS_3_OFFSET_MS = 3 * 60 * 60 * 1000; // UTC-3 offset in milliseconds
  return new Date(date.getTime() + UTC_MINUS_3_OFFSET_MS);
}

export const getAvaliableMonths = (operations: Operation[]) => {
  const monthsSet = new Set<string>();
  operations.forEach((operation) => {
    if (operation.date) {
      const date = new Date(operation.date);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

      monthsSet.add(monthYear);
    }
  });
  return Array.from(monthsSet).reverse();
};

export const filterOperationsByMonth = (
  operations: Operation[],
  month: string
): Operation[] => {
  return operations
    .filter((operation) => {
      if (operation.date) {
        const date = new Date(operation.date);
        const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
        return monthYear === month;
      }
      return false;
    })
    .sort((a, b) => {
      return (
        new Date(a.date ?? "").getTime() - new Date(b.date ?? "").getTime()
      );
    });
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
