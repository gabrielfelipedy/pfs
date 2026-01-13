"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement>{className?: string}

export function ModeToggle({className, onClick, ...rest }: Props) {
  const { theme, setTheme } = useTheme();

  const handleToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    // 1. Execute the theme change logic
    theme === "light" ? setTheme("dark") : setTheme("light");
    
    // 2. Execute the onClick prop passed from the Navbar (to close the menu)
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className={className} onClick={handleToggle} {...rest}>
      <Button
        variant="outline"
        size="icon"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </div>
  );
}