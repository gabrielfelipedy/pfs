"use client";

import * as React from "react";
import { Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toggle } from "../ui/toggle";

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
        <Palette />
      </Button>
    </div>
  );
}