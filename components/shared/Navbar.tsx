import Link from "next/link";
import React from "react";
import { ModeToggle } from "../theme/mode-toggler";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";

interface Props {
  linksClassName?: string;
}

const Navbar = ({ linksClassName }: Props) => {
  return (
    <nav className="fixed mt-10 z-50 w-full flex justify-between items-center px-6 md:px-40">

        <div className="items-center py-2 px-4 rounded-lg flex justify-between w-full bg-white/40 dark:bg-black/40 backdrop-blur-lg">

      <div className={`${linksClassName} text-sm md:text-md flex gap-6`}>
        <Link href={"/"}>Dashborad</Link>

        <Link href={"/entradas"}>Entradas</Link>

        <Link href={"/saidas"}>Saídas</Link>
      </div>

      <div className="flex gap-3">
        <ModeToggle />

        <Button variant="outline" size="icon">
          <Settings />
        </Button>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;