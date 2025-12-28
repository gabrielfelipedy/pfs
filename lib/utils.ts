import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Row } from "@libsql/client";

export const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function capitalizeFirstLetter(text: string | null): string {
  if (!text) return ""; // Handles empty strings or null
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// converts from -3 timezone to UTC time (HH:MM:SS)

export function utcMinus3ToUtc(time: string): string {
  if (!time || typeof time !== "string") {
    throw new Error("Invalid time format");
  }

  const [h, m, s] = time.split(":").map(Number);

  // Create date in UTC-3
  const date = new Date(Date.UTC(1970, 0, 1, h + 3, m, s));

  return date.toISOString().substring(11, 19);
}


// Replaces the timem into the timestamp string from another time given in the function's paramter

export function replaceUTCTime(utcTimestamp: string, time: string): string {
  const date = new Date(utcTimestamp);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid UTC timestamp");
  }

  const [hour, minute, second = 0] = time.split(":").map(Number);

  if ([hour, minute, second].some(Number.isNaN)) {
    throw new Error("Invalid time format");
  }

  date.setUTCHours(hour, minute, second, 0);

  return date.toISOString();
}


export function transformOperationsProportion(operations_proportion: Row) {
  try {
    const transformedOperationsProportion = Object.entries(operations_proportion)
      .filter(([key]) => key !== "total_sum")
      .map(([key, val]) => ({
        name: key.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        value: Number(val),
      }));

    transformedOperationsProportion.sort((a, b) => b.value - a.value);
    return transformedOperationsProportion

    //console.log(transformedOperationsProportion);
  } catch (error) {
    return []
  }
}