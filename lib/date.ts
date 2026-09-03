import { Operation, OperationArray } from "./definitions";
import {
  expandParcelamentosForMonth,
  monthStrToNumber,
  monthToNumber,
} from "./parcelamento";

export const UTC_MINUS_3_OFFSET_MS = 3 * 60 * 60 * 1000; // UTC-3 offset in milliseconds

// Converts a date entered in the UTC-3 reference (a calendar day) to its UTC-0
// representation: day D at 00:00 UTC-3 == 03:00 UTC on day D.
export function convertLocalToUtc(date: Date): Date {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) +
      UTC_MINUS_3_OFFSET_MS
  );
}

// Converts a stored UTC-0 instant to the UTC-3 wall-clock reference.
export function convertUtcToLocal(date: Date): Date {
  return new Date(date.getTime() - UTC_MINUS_3_OFFSET_MS);
}

// Snap any UTC instant to the canonical UTC-3 convention (03:00 UTC of the day
// the instant falls on in the UTC-3 reference).
export function toUtcMinus3Instant(date: Date): Date {
  const local = convertUtcToLocal(date);
  return new Date(
    Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) +
      UTC_MINUS_3_OFFSET_MS
  );
}

// Builds a local Date (browser midnight) representing the UTC-3 calendar day of
// a stored UTC-0 instant. Used to feed date pickers regardless of browser TZ.
export function toUtcMinus3Date(date: Date): Date {
  const local = convertUtcToLocal(date);
  return new Date(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
}

// Local Date (browser midnight) representing "today" in the UTC-3 reference.
export function todayInUtcMinus3(): Date {
  const ref = convertUtcToLocal(new Date());
  return new Date(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate());
}

// Formats a stored UTC-0 instant as a date in the UTC-3 reference, independent
// of the browser/server timezone.
export function formatDateBR(date: Date): string {
  return convertUtcToLocal(date).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
}

export function formatDateBRMonthYear(date: Date): string {
  return convertUtcToLocal(date).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    month: "2-digit",
    year: "2-digit",
  });
}

export function isTodayUTC(date: Date): boolean {
  const now = todayInUtcMinus3();
  const target = toUtcMinus3Date(date);
  return (
    target.getFullYear() === now.getFullYear() &&
    target.getMonth() === now.getMonth() &&
    target.getDate() === now.getDate()
  );
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
    } else if (operation.parcelas && operation.parcelas > 1 && operation.date) {
      const startDate = operation.date;
      const startMonth = monthToNumber(startDate);
      const endMonth = startMonth + (operation.parcelas - 1);
      for (let m = startMonth; m <= endMonth; m++) {
        const y = Math.floor(m / 12);
        const mo = (m % 12) + 1;
        monthsSet.add(`${y}-${mo}`);
      }
    } else if (operation.date) {
      const date = operation.date;
      const monthYear = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`;
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
        const monthYear = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`;
        return monthYear === month && operation.parcelas === 1;
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

  const parcelamentos = expandParcelamentosForMonth(operations, month);

  return [...filteredByMonth, ...fixedOperations, ...parcelamentos].sort((a, b) => {
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
        const monthYear = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`;
        return monthYear === month && operation.parcelas === 1;
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
    date: new Date(
      Date.UTC(targetYear, targetMonth - 1, o.date ? o.date.getUTCDate() : 1) +
        UTC_MINUS_3_OFFSET_MS
    ),
  }));

  const parcelamentos = expandParcelamentosForMonth(operations, month);

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
