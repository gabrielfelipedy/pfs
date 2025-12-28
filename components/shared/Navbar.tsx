import Link from "next/link";
import React from "react";
import { ModeToggle } from "../theme/mode-toggler";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";

interface Props {
  linksClassName?: string;
}

const navLinks = [
  {
    href: "/",
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
  return (
    <nav className="fixed mt-10 z-50 w-full flex justify-between items-center px-6 md:px-40">
      <div className="items-center py-2 px-4 rounded-lg flex justify-between w-full bg-white/40 dark:bg-black/40 backdrop-blur-lg">
        <div
          className={`${linksClassName} text-sm md:text-md flex gap-6 text-gray-600 dark:text-gray-300`}
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

        <div className="flex gap-3">
          <ModeToggle />

          <Link href="/settings">
            <Button variant="outline" size="icon">
              <Settings />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
