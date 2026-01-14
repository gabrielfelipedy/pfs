"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> { className?: string }

export function ModeToggle({ className, onClick, ...rest }: Props) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    theme === "light" ? setTheme("dark") : setTheme("light");


    if (onClick) {
      onClick(e);
    }
  };

  if (!mounted) {
    return <div className={className} {...rest}><div style={{ width: 23, height: 23 }} /></div>;
  }

  return (
    <div className={className} onClick={handleToggle} {...rest}>
      {(theme === 'light') ? <Sun size={23} /> : <Moon size={23} />}
    </div>
  );
}