import { Operation, OperationArray } from "./definitions";

function monthToNumber(date: Date): number {
  return date.getFullYear() * 12 + date.getMonth();
}

function monthStrToNumber(month: string): number {
  const [y, m] = month.split("-").map(Number);
  return y * 12 + (m - 1);
}

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
    if (operation.period_id === 3 && (operation.start_date || operation.date)) {
      const startDate = operation.start_date || operation.date;
      const endDate = operation.end_date || new Date();
      const startMonth = monthToNumber(startDate);
      const endMonth = monthToNumber(endDate);
      for (let m = startMonth; m <= endMonth; m++) {
        const y = Math.floor(m / 12);
        const mo = (m % 12) + 1;
        monthsSet.add(`${y}-${mo}`);
      }
    } else if (operation.date) {
      const date = operation.date;
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      monthsSet.add(monthYear);
    }
  });

  const array = Array.from(monthsSet).sort((a, b) => {
    return monthStrToNumber(a) - monthStrToNumber(b);
  });
  //console.log(array)

  if (array.length > 12) {
    return array.slice(0, 12);
  }

  while (array.length < 12) {
    const earliest = array[0];
    const [year, month] = earliest.split("-").map(Number);

    const prevDate = new Date(year, month - 2, 1);
    const prevMonthStr = `${prevDate.getFullYear()}-${prevDate.getMonth() + 1}`;

    array.unshift(prevMonthStr);
  }

  return array;
};

export const filterOperationsByMonth = (
  operations: Operation[],
  month: string,
): Operation[] => {

  const operationsArray = new OperationArray(operations)

  const filteredByMonth = operationsArray.filterVariableOperations().getOperations()
    .filter((operation) => {
      if (operation.date) {
        const date = operation.date;
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
        return monthYear === month;
      }
      return false;
    });

  const targetNum = monthStrToNumber(month);
  const fixedOperations = operationsArray.filterFixedOperations().getOperations().filter((o) => {
    const startDate = o.start_date || o.date;
    const startNum = monthToNumber(startDate);
    const endNum = o.end_date ? monthToNumber(o.end_date) : null;
    return startNum <= targetNum && (endNum === null || targetNum <= endNum);
  });

  return [...filteredByMonth, ...fixedOperations].sort((a, b) => {
    return new Date(a.date ?? "").getTime() - new Date(b.date ?? "").getTime();
  });
};

export const filterOperationsByMonthCharts = (
  operations: Operation[],
  month: string,
): Operation[] => {

  const operationsArray = new OperationArray(operations)
  const [targetYear, targetMonth] = month.split("-").map(Number);

  const filteredByMonth = operationsArray
    .filterVariableOperations().getOperations()
    .filter((operation) => {
      if (operation.date) {
        const date = operation.date;
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
        return monthYear === month;
      }
      return false;
    });

  const targetNum = monthStrToNumber(month);
  const fixedOperations = operationsArray.filterFixedOperations().getOperations().filter((o) => {
    const startDate = o.start_date || o.date;
    const startNum = monthToNumber(startDate);
    const endNum = o.end_date ? monthToNumber(o.end_date) : null;
    return startNum <= targetNum && (endNum === null || targetNum <= endNum);
  }).map((o) => ({
    ...o,
    date: new Date(targetYear, targetMonth - 1, 1),
  }));

  const parcelamentos = operationsArray
    .filterComprasParceladas()
    .getOperations()
    .filter((o) => {
      const numParcelas = o.parcelas ?? 1;
      const date = new Date(o.date);

      const startMonthIndex = date.getFullYear() * 12 + date.getMonth();
      const endMonthIndex = startMonthIndex + (numParcelas - 1);
      const targetMonthIndex = targetYear * 12 + (targetMonth - 1);

      return targetMonthIndex >= startMonthIndex && targetMonthIndex <= endMonthIndex;
    })
    .map((o) => {
      const originalDate = new Date(o.date);
      const day = Math.min(originalDate.getDate(), 28);
      return {
        ...o,
        date: new Date(targetYear, targetMonth - 1, day),
      };
    });

  return [...filteredByMonth, ...fixedOperations, ...parcelamentos].sort((a, b) => {
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
