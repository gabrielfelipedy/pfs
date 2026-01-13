"use client"

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "../theme/mode-toggler";
import { Button } from "../ui/button";
import { Menu, Settings, X } from "lucide-react";

interface Props {
  linksClassName?: string;
}

const navLinks = [
  {
    href: "/dashboard",
    name: "Dashboard",
  },
  {
    href: "/entradas",
    name: "Entradas",
  },
  {
    href: "/saidas",
    name: "Saídas",
  },
  {
    href: "/saidas/limites",
    name: "Limites de gastos",
  },
  {
    href: "/invest",
    name: "Investimentos",
  },
];

const Navbar = ({ linksClassName }: Props) => {

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <nav className="fixed z-50 w-full flex justify-between items-center h-22.5 px-6 md:px-20 bg-background">

      <Link href="/dashboard">
        <h1 className="font-bold text-[2rem]">pfs</h1>
      </Link>


      <div className="md:hidden flex items-center">
        <div onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={35} /> : <Menu size={35} />}
        </div>
      </div>

      <div
        className={`${linksClassName} text-sm md:text-md md:flex gap-6 text-gray-600 dark:text-gray-300 hidden`}
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

      <div className="md:flex gap-3 hidden">
        <ModeToggle />

        <Link href="/settings">
          <Button variant="outline" size="icon">
            <Settings />
          </Button>
        </Link>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full h-[calc(100vh-90px)] bg-background border-b flex flex-col justify-between p-4 animate-in slide-in-from-top-2">

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

          <div className="flex justify-between">
            <ModeToggle/>

            <Link href="/settings"
            onClick={() => setIsOpen(false)}>
              <Button variant="outline" size="icon">
                <Settings />
              </Button>
            </Link>
          </div>

        </div>
      )}

    </nav>
  );
};

export default Navbar;