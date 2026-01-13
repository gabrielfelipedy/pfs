//import Image from "next/image";

import Area from "@/components/charts/area";
import ErrorLoading from "@/components/error/ErrorLoading";
import FormDialog from "@/components/dialogs/FormDialog";
import { createEntrada } from "@/actions/income-actions";
import { createSaida } from "@/actions/expense-actions";
import { Operation } from "@/lib/definitions";
import { getOperations } from "@/db/queries/operation";
import Resume from "@/components/resume/resume";
import Line from "@/components/charts/line";
import Bar from "@/components/charts/bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateBalanceEvolution, calculateIncomesAndExpensesEvolution  } from "@/lib/operation";
import OperationDataTable from "@/components/data-table/OperationDataTable";
import { filterOperationsByMonth, getAvaliableMonths, formatMonthYear } from "@/lib/date";

const emptyExpenseOperation: Operation = {
  is_income: false,
};

const emptyIncomeOperation: Operation = {
  is_income: true,
};


export default async function Home() {
  let operations;

  try {
    operations = await getOperations();
  } catch (error) {
    console.error(error);
    return <ErrorLoading />;
  }

  //console.log(transformedData)
  const avaliableMonths = getAvaliableMonths(operations);

  return (
    <>
      <h1 className="text-[2.2rem] md:text-[3rem] font-bold">Dashboard</h1>
     

      <Tabs className="mt-6" defaultValue={avaliableMonths.at(-1)}>
        <TabsList>
          {avaliableMonths.map((month) => (
            <TabsTrigger key={month} value={month}>
              {formatMonthYear(month)}
            </TabsTrigger>
          ))}
        </TabsList>
        {avaliableMonths.map((month) => (
          <TabsContent key={month} value={month}>
            
              <Resume
                operations={filterOperationsByMonth(operations, month)}
                className="mt-2"
              >
                {/* <>
                  <CardResume
                    title="Gastos semanais"
                    icon={
                      <TrendingDownIcon className="h-4 w-4 text-muted-foreground" />
                    }
                    data={weekly_expenses}
                    subtext="No último mês"
                  />

                  <CardResume
                    title="Gastos diários"
                    icon={
                      <TrendingDownIcon className="h-4 w-4 text-muted-foreground" />
                    }
                    data={daily_expenses}
                    subtext="No último mês"
                  />
                </> */}
              </Resume>
            

            <div className="mt-8 flex flex-col gap-5">
              <Line
                title="Evolução do saldo"
                description="Ao longo do mês atual"
                data={calculateBalanceEvolution(
                  filterOperationsByMonth(operations, month)
                )}
              />

              <Tabs defaultValue="area">
                <TabsList>
                  <TabsTrigger value="area">Gráfico de Área</TabsTrigger>
                  <TabsTrigger value="bar">Gráfico de Barra</TabsTrigger>
                </TabsList>
                <TabsContent value="area">
                  <Area
                    title="Comparação de entradas e saídas"
                    description="Ao longo do mês atual"
                    data={calculateIncomesAndExpensesEvolution(
                      filterOperationsByMonth(operations, month)
                    )}
                  />
                </TabsContent>

                <TabsContent value="bar">
                  <Bar
                    title="Comparação de entradas e saídas"
                    description="Ao longo do mês atual"
                    data={calculateIncomesAndExpensesEvolution(
                      filterOperationsByMonth(operations, month)
                    )}
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
                  buttonVariation="destructive"
                  operation={emptyExpenseOperation}
                  actionFunction={createSaida}
                />
              </div>

              <div className="mt-2">
                <OperationDataTable operations={filterOperationsByMonth(operations, month).reverse()} />
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}