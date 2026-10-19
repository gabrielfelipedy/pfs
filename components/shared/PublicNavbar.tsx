"use client"

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "../theme/mode-toggler";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";

interface Props {
  linksClassName?: string;
}

const navLinks = [
  {
    href: "/",
    name: "Início",
  },
  {
    href: "/#recursos",
    name: "Recursos",
  },
  {
    href: "/#como-funciona",
    name: "Como funciona",
  },
];

export default function PublicNavbar ({ linksClassName }: Props) {

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <nav className="fixed z-50 w-full top-0 left-0 flex justify-between items-center h-22.5 px-6 md:px-20 bg-background border-b">

      <Link href="/" onClick={() => setIsOpen(false)}>
        <p className="font-bold text-[2rem]" translate="no">pfs</p>
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

        <Button variant="outline" size="sm" asChild>
          <Link href="/login">Entrar</Link>
        </Button>
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
          </div>

          <div className="flex items-center justify-between">
            <ModeToggle />

            <Button variant="outline" size="sm" asChild>
              <Link href="/login" onClick={() => setIsOpen(false)}>
                Entrar
              </Link>
            </Button>
          </div>

        </div>
      )}

    </nav>
  );
};
