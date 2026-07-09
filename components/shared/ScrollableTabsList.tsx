"use client";

import { useEffect, useRef } from "react";
import { TabsList } from "@/components/ui/tabs";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function ScrollableTabsList({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollLeft = ref.current.scrollWidth;
    }
  }, []);

  return <TabsList ref={ref} className={className}>{children}</TabsList>;
}
