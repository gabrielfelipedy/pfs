"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";


interface Props {
  className?: string;
}

export function ModeToggle({ className }: Props) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={className}>
      <Button variant="outline" size="icon"
      onClick={() => theme === 'light' ? setTheme('dark') : setTheme('light')}
      >
        {theme === 'light' ? <Sun /> : <Moon />}
      </Button>
    </div>
  );
}