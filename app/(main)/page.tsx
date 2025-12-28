//import Image from "next/image";

import DataTablePage from "@/components/data-table/DataTablePage";
import Area from "@/components/charts/area";
import ErrorLoading from "@/components/error/ErrorLoading";
import FormDialog from "@/components/shared/FormDialog";
import { createEntrada } from "@/actions/entrada-actions";
import { createSaida } from "@/actions/saida-actions";
import { Operation } from "@/lib/definitions";
import { getBalanceEvolution, getOperationEvolution } from "@/db/queries/operation";
import Resume from "@/components/resume/resume";
import Line from "@/components/charts/line";
import Bar from "@/components/charts/bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const emptyExpenseOperation: Operation = {
  is_income: false,
};

const emptyIncomeOperation: Operation = {
  is_income: true,
};

export default async function Home() {
  let operation_data;
  let balance_evolution;

  try {
    operation_data = await getOperationEvolution();
    balance_evolution = await getBalanceEvolution()

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

  const transformedBalanceEvolution = balance_evolution.map((item) => ({
    date: item.day,
    total_value: item.balance / 100
  }));

  //console.log(transformedData)

  return (
    <section className="mt-4 md:mt-20">
      <h1 className="text-[2.2rem] md:text-[3.2rem] font-bold">Dashboard</h1>
      <p className="text-slate-500 dark:text-gray-300 text-xl md:text-xl">
        Visão geral das finanças
      </p>

      <Resume className="mt-10" />

      <div className="mt-8 flex flex-col gap-5">

        <Line
        title="Evolução do saldo"
        description="Ao longo do mês atual"
        data={transformedBalanceEvolution}
      />

      <Tabs defaultValue="area">
        <TabsList>
          <TabsTrigger value="area">Gráfico de Área</TabsTrigger>
          <TabsTrigger value="bar">Gráfico de Barra</TabsTrigger>
        </TabsList>
        <TabsContent value="area">
            <Area
          title="Evolução de gastos"
          description="Ao longo do mês atual"
          data={transformedData}
        />
        </TabsContent>

        <TabsContent value="bar">
          <Bar
          title="Evolução de gastos"
          description="Ao longo do mês atual"
          data={transformedData}
        />
        </TabsContent>
        </Tabs>

      
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
