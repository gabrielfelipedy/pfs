//import Image from "next/image";

import DataTablePage from "@/components/data-table/DataTablePage";
import Costs from "@/components/costs/costs";
import CostsResume from "@/components/costs/costs-resume";
import EarningResumes from "@/components/earnings/earnings-resume";
import Balance from "@/components/balance/balance";
import { getExpensesEvolution } from "@/db/queries/expense";
import Line from "@/components/charts/line";
import { getIncomesEvolution } from "@/db/queries/income";
import Area from "@/components/charts/area";
import ErrorLoading from "@/components/error/ErrorLoading";
import FormDialog from "@/components/shared/FormDialog";
import { createEntrada } from "@/actions/entrada-actions";
import { createSaida } from "@/actions/saida-actions";

export default async function Home() {
  let expense_data;
  let income_data;

  try {
    const data = await getExpensesEvolution();
    expense_data = data;

    const data2 = await getIncomesEvolution();
    income_data = data2;
  } catch (error) {
    console.error(error);
    return <ErrorLoading />;
  }

  const transformedData = expense_data.map((item) => ({
    ...item,
    total_value: item.total_value / 100,
  }));

  const transformedIncomes = income_data.map((item) => ({
    ...item,
    total_value: item.total_value / 100,
  }));

  const general_data = {
    expense: transformedData,
    income: transformedIncomes,
  };

  return (
    <section className="mt-4 md:mt-20">
      <h1 className="text-[2.2rem] md:text-[4rem] font-bold">Dashboard</h1>
      <p className="text-slate-500 text-xl md:text-2xl">
        Visão geral das finanças
      </p>

      <div className="mt-8">
        {/* <Area
        title="Evolução de gastos"
        description="Ao longo do mês atual"
        data={general_data}
      /> */}

        <Balance />

        <div className="border-2 rounded-lg mt-8">
          <EarningResumes />
          <CostsResume />
        </div>

        <div className="mt-10 flex gap-5">
          {/* <CreateSaidaDialog /> */}
          <FormDialog
            openDialogText="Adicionar entrada"
            dialogTitle="Adicionar entrada"
            dialogDescription="Preencha as informações da entrada"
            buttonText="Adicionar"
            operation={undefined}
            actionFunction={createEntrada}
          />

          <FormDialog
            openDialogText="Adicionar Gasto"
            dialogTitle="Adicionar Gasto"
            dialogDescription="Preencha as informações do gasto"
            buttonText="Adicionar"
            operation={undefined}
            actionFunction={createSaida}
          />
        </div>

        <div className="mt-2">
          <DataTablePage />
        </div>
      </div>
    </section>
  );
}
