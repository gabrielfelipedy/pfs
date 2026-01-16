"use client";

import { useEffect, useState } from "react";

export function ClientDateTime({ date }: { date: Date | null }) {
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
  return <span>{date?.toLocaleDateString('pt-BR') || "-"}</span>;
}