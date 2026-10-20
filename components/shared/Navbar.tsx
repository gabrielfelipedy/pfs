"use client"

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "../theme/mode-toggler";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Menu, X } from "lucide-react";
import { logout } from "@/app/(public)/(auth)/login/actions";

interface Props {
  linksClassName?: string;
  username: string;
}

const navLinks = [
  {
    href: "/dashboard",
    name: "Dashboard",
  },
  {
    href: "/operations",
    name: "Operações",
  },
  {
    href: "/operations/limites",
    name: "Limites de gastos",
  },
  {
    href: "/invest",
    name: "Investimentos",
  },
];

const Navbar = ({ linksClassName, username }: Props) => {

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full flex justify-between items-center h-22.5 px-6 md:px-20 bg-background">

      <Link href="/dashboard">
        <p translate="no" className="font-bold text-[2rem]">pfs</p>
      </Link>


      <div className="lg:hidden flex items-center">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isOpen ? <X size={35} /> : <Menu size={35} />}
        </button>
      </div>

      <div
        className={`${linksClassName} text-md md:text-md lg:flex gap-6 text-black/70 dark:text-white/70 hidden`}
      >
        {navLinks.map((item, index) => (
          <Link
            key={index}
            className="hover:text-black dark:hover:text-white"
            href={item.href}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="lg:flex items-center gap-4 hidden">
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Menu do usuário"
              aria-haspopup="menu"
              className="flex size-9 items-center justify-center rounded-full bg-primary/15 font-display font-bold uppercase text-primary transition-colors hover:bg-primary/25"
            >
              <span aria-hidden="true">{username.charAt(0)}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/profile">Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Configurações</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form action={logout}>
                <button type="submit">Sair</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full h-[calc(100vh-90px)] bg-background border-b flex flex-col justify-between p-4 animate-in slide-in-from-top-2">

          <div className="flex flex-col gap-4">
            {navLinks.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)} // Close menu on click
                className="text-lg font-medium text-gray-600 dark:text-gray-300"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-gray-600 dark:text-gray-300"
            >
              Perfil
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-gray-600 dark:text-gray-300"
            >
              Configurações
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <ModeToggle />

            <form action={logout}>
              <Button type="submit" variant="outline" size="sm">
                Sair
              </Button>
            </form>
          </div>

        </div>
      )}

    </nav>
  );
};

export default Navbar;
