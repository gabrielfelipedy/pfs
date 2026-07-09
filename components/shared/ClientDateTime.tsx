"use client";

import { useEffect, useState } from "react";

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
    return <span>{date.toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' })}</span>;
  }

  return <span>{date.toLocaleDateString('pt-BR')}</span>;
}