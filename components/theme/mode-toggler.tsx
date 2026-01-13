"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> { className?: string }

export function ModeToggle({ className, onClick, ...rest }: Props) {
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


      {(theme === 'light') ? <Sun size={23} /> : <Moon size={23} />}

    </div>
  );
}