//import Image from "next/image";
import OperationDataTable from "@/components/data-table/columns";
import Navbar from "../components/Navbar";
import OperationsTable from "@/components/OperationsTable";
import DataTablePage from "@/components/data-table/DataTablePage";

export default function Home() {
  return (
    <section className="mt-20">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-slate-500">Visão geral das finanças</p>

      <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-20">
        <div className="row-span-2">Gastos diários</div>
        <div>Gastos da Semana</div>
        <div className="col-start-2 row-start-2">Gastos do Mês</div>
      </div>

      <div className="mt-20">
        <p className="font-bold">Lista de gastos geral</p>

        <DataTablePage />
      </div>
    </section>
  );
}
