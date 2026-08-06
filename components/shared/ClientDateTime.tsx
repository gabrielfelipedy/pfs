"use client";

import { useEffect, useState } from "react";
import { formatDateBR, formatDateBRMonthYear } from "@/lib/date";

interface Props {
  date: Date | null;
  format?: "full" | "monthYear";
}

export function ClientDateTime({ date, format = "full" }: Props) {
  const [isClient, setIsClient] = useState(false);

  // This runs after the first render
  useEffect(() => {

    setTimeout(() => {
      setIsClient(true);
    }, 0);


  }, []);

  // Server-side (and first client pass): render a placeholder with the same structure
  if (!isClient) {
    return <span aria-hidden="true">-</span>;
  }

  // Second pass (Client only): render the actual date
  if (!date) return <span>-</span>;

  if (format === "monthYear") {
    return <span>{formatDateBRMonthYear(date)}</span>;
  }

  return <span>{formatDateBR(date)}</span>;
}
