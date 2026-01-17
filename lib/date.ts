import { Operation } from "./definitions";
import { filterFixedOperations, filterVariableOperations } from "./operation";

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
      const date = operation.date;
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;

      monthsSet.add(monthYear);
    }
  });

  const array = Array.from(monthsSet);
  //console.log(array)

  if (array.length > 12) {
    return array.slice(0, 12);
  }

  while (array.length < 12) {
    const latest =
      array[0] || `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
    const [year, month] = latest.split("-").map(Number);

    const nextDate = new Date(year, month, 1);
    const nextMonthStr = `${nextDate.getFullYear()}-${nextDate.getMonth() + 1}`;

    array.unshift(nextMonthStr);
  }

  return array.reverse();
};

export const replaceMonth = (operations: Operation[], monthStr: string) => {
  const targetDate = new Date(monthStr);
  const targetMonth = targetDate.getMonth();
  const targetYear = targetDate.getFullYear();

  // Calculate the last day of the target month once to use for all operations
  const lastDayOfTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

  return operations.map((op) => {
    const oldDate = new Date(op.date);
    const originalDay = oldDate.getDate();

    // 1. Create the new date instance
    const newDate = new Date(oldDate);

    // 2. Decide the day: 
    // Keep originalDay UNLESS it's greater than the target month's capacity
    const safeDay = originalDay <= lastDayOfTargetMonth 
      ? originalDay 
      : lastDayOfTargetMonth;

    /** * To prevent accidental rollover during the setMonth() call,
     * we set the day to the safe value FIRST if the target month is "shorter" 
     * than the current month.
     */
    newDate.setDate(1); // Temporary safety reset
    newDate.setFullYear(targetYear);
    newDate.setMonth(targetMonth);
    newDate.setDate(safeDay); // Apply the preserved or "clamped" day

    return {
      ...op,
      date: newDate,
    };
  });
};

export const filterOperationsByMonth = (
  operations: Operation[],
  month: string
): Operation[] => {
  const filteredByMonth = filterVariableOperations(operations).filter(
    (operation) => {
      if (operation.date) {
        const date = operation.date;
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
        return monthYear === month;
      }
      return false;
    }
  );

  const fixedOperations = filterFixedOperations(operations).filter((o) => `${o.date.getFullYear()}-${o.date.getMonth() + 1}` <= month);

  //const replacedMonth = replaceMonth(fixedOperations, month)

  return [...filteredByMonth, ...fixedOperations].sort((a, b) => {
    return new Date(a.date ?? "").getTime() - new Date(b.date ?? "").getTime();
  });
};

export const filterOperationsByMonthCharts = (
  operations: Operation[],
  month: string
): Operation[] => {
  
  const filteredByMonth = filterVariableOperations(operations).filter(
    (operation) => {
      if (operation.date) {
        const date = operation.date;
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
        return monthYear === month;
      }
      return false;
    }
  );

  const fixedOperations = filterFixedOperations(operations).filter((o) => `${o.date.getFullYear()}-${o.date.getMonth() + 1}` <= month);

  const replacedMonth = replaceMonth(fixedOperations, month)

  return [...filteredByMonth, ...replacedMonth].sort((a, b) => {
    return new Date(a.date ?? "").getTime() - new Date(b.date ?? "").getTime();
  });
};

export function formatMonthYear(input: string): string {
  // Split "12-2025" into [12, 2025]
  const [year, month] = input.split("-").map(Number);

  // Create a date object (Note: months are 0-indexed in JS, so subtract 1)
  const date = new Date(year, month - 1);

  // Format using Intl for Portuguese (pt-BR)
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
