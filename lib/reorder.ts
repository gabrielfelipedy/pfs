import { convertUtcToLocal } from "./date";

// Returns a day key (YYYY-MM-DD) in the UTC-3 reference for a stored UTC-0
// instant. Two operations only share the same display day if their keys match.
export function utcMinus3DayKey(date: Date): string {
  const local = convertUtcToLocal(date);
  return `${local.getUTCFullYear()}-${local.getUTCMonth()}-${local.getUTCDate()}`;
}

// True when both operations fall on the same day in the UTC-3 reference.
// Reordering (swapping sort_order) is only allowed between same-day rows.
export function sameUtcMinus3Day(a: Date, b: Date): boolean {
  return utcMinus3DayKey(a) === utcMinus3DayKey(b);
}
