//import Image from "next/image";

import DataTablePage from "@/components/data-table/DataTablePage";
import Costs from "@/components/costs/costs";

export default function Home() {
  return (
    <section className="mt-20">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-slate-500">Visão geral das finanças</p>

      <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-20 border-2 rounded-lg p-4">
        <div className="row-span-2">
          <Costs title="Gastos Diários" currencyValue={30} currencyTextClassName="text-[5rem]" />
        </div>
        <div className="text-center">
          <Costs title="Gastos da semana" currencyValue={100} currencyTextClassName="text-4xl" />
        </div>
        <div className="col-start-2 row-start-2 text-center">
          <Costs title="Gastos do mês" currencyValue={370} currencyTextClassName="text-4xl" />
        </div>
      </div>

      <div className="mt-20">
        <p className="font-bold">Lista de gastos geral</p>

        <DataTablePage />
      </div>
    </section>
  );
}