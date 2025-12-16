//import Image from "next/image";

import DataTablePage from "@/components/data-table/DataTablePage";
import Costs from "@/components/costs/costs";
import CostsResume from "@/components/costs/costs-resume";

export default function Home() {
  return (
    <section className="mt-20">
      <h1 className="text-[4rem] font-bold">Dashboard</h1>
      <p className="text-slate-500 text-2xl">Visão geral das finanças</p>


      <div>

        <CostsResume />

      <div className="mt-20">
        <p className="font-bold">Lista de gastos geral</p>

        <DataTablePage />
      </div>
      </div>
    </section>
  );
}