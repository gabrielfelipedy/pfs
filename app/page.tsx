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
import { Operation } from "@/lib/definitions";
import { getOperationEvolution } from "@/db/queries/operation";

const emptyExpenseOperation: Operation = {
  is_income: false,
};

const emptyIncomeOperation: Operation = {
  is_income: true,
};

export default async function Home() {
  let operation_data;

  try {
    operation_data = await getOperationEvolution();
  } catch (error) {
    console.error(error);
    return <ErrorLoading />;
  }

  const transformedData = operation_data.map((item) => ({
    ...item,
    total_income: item.total_income / 100,
    total_expense: item.total_expense / 100,
    balance: item.balance / 100,
  }));

  //console.log(transformedData)

  return (
    <section className="mt-4 md:mt-20">
      <h1 className="text-[2.2rem] md:text-[4rem] font-bold">Dashboard</h1>
      <p className="text-slate-500 text-xl md:text-2xl">
        Visão geral das finanças
      </p>

      <div className="mt-8">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="border-2 rounded-lg">
            <Balance className="mt-6" />
            <EarningResumes />
            <CostsResume />
          </div>

          <Area
            title="Evolução de gastos"
            description="Ao longo do mês atual"
            data={transformedData}
          />
        </div>

        <div className="mt-10 flex gap-5">
          {/* <CreateSaidaDialog /> */}
          <FormDialog
            openDialogText="Adicionar entrada"
            dialogTitle="Adicionar entrada"
            dialogDescription="Preencha as informações da entrada"
            buttonText="Adicionar"
            operation={emptyIncomeOperation}
            actionFunction={createEntrada}
          />

          <FormDialog
            openDialogText="Adicionar Gasto"
            dialogTitle="Adicionar Gasto"
            dialogDescription="Preencha as informações do gasto"
            buttonText="Adicionar"
            operation={emptyExpenseOperation}
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
