//import Image from "next/image";

import DataTablePage from "@/components/data-table/DataTablePage";
import CostsResume from "@/components/costs/costs-resume";
import EarningResumes from "@/components/earnings/earnings-resume";
import Balance from "@/components/balance/balance";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {

  const supabase = await createClient()
  const result = await supabase.from("category").select("*");
  console.log(result)

  return (
    <section className="mt-4 md:mt-20">

      <h1 className="text-[2.2rem] md:text-[4rem] font-bold">Dashboard</h1>
      <p className="text-slate-500 text-xl md:text-2xl">Visão geral das finanças</p>

      <div className="mt-8">
        <Balance />

        <div className="border-2 rounded-lg mt-8">
          <EarningResumes />
          <CostsResume />
        </div>
        <div className="mt-20">
          <p className="font-bold">Lista de gastos geral</p>

          <DataTablePage />
        </div>
      </div>
    </section>
  );
}
