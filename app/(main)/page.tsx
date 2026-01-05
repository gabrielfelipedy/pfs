//import Image from "next/image";

import DataTablePage from "@/components/data-table/DataTablePage";
import Area from "@/components/charts/area";
import ErrorLoading from "@/components/error/ErrorLoading";
import FormDialog from "@/components/dialogs/FormDialog";
import { createEntrada } from "@/actions/income-actions";
import { createSaida } from "@/actions/expense-actions";
import { ChartData, Operation } from "@/lib/definitions";
import { getOperationEvolution, getOperations } from "@/db/queries/operation";
import Resume from "@/components/resume/resume";
import Line from "@/components/charts/line";
import Bar from "@/components/charts/bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { startOfDay } from "date-fns";
import CardResume from "@/components/resume/card-resume";
import { TrendingDownIcon } from "lucide-react";
import { calculateDailyExpenses, calculateWeeklyExpenses } from "@/lib/date";
import OperationDataTable from "@/components/data-table/OperationDataTable";

const emptyExpenseOperation: Operation = {
  is_income: false,
};

const emptyIncomeOperation: Operation = {
  is_income: true,
};

const getAvaliableMonths = (operations: Operation[]) => {
  const monthsSet = new Set<string>();
  operations.forEach((operation) => {
    if (operation.date) {
      const date = new Date(operation.date);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

      monthsSet.add(monthYear);
    }
  });
  return Array.from(monthsSet).reverse();
};

const filterOperationsByMonth = (
  operations: Operation[],
  month: string
): Operation[] => {
  return operations.filter((operation) => {
    if (operation.date) {
      const date = new Date(operation.date);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
      return monthYear === month;
    }
    return false;
  });
};

function formatMonthYear(input: string): string {
  // Split "12-2025" into [12, 2025]
  const [month, year] = input.split("-").map(Number);

  // Create a date object (Note: months are 0-indexed in JS, so subtract 1)
  const date = new Date(year, month - 1);

  // Format using Intl for Portuguese (pt-BR)
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

const calculateBalanceEvolution = (operations: Operation[]) => {
  //console.log(operations)

  const balanceMap = new Map<string, ChartData>();
  let total_incomes = 0;

  operations.reverse().forEach((operation) => {
    const date = startOfDay(new Date(operation.date ?? ""));
    const key = date.toISOString().split("T")[0];

    const value = operation.value ?? 0;

    if (operation.is_income) {
      total_incomes += value;
    } else {
      total_incomes -= value;
    }

    balanceMap.set(key, { date: key, value: total_incomes / 100 });
  });

  //console.log(Array.from(balanceMap.values()));
  return Array.from(balanceMap.values());
};

const calculateOperationEvolution = (operations: Operation[]) => {
  //console.log(operations)

  const balanceMap = new Map<
    string,
    { date: string; total_incomes: number; total_expenses: number }
  >();

  operations.reverse().forEach((operation) => {
    const date = startOfDay(new Date(operation.date ?? ""));
    const key = date.toISOString().split("T")[0];

    const current_value = balanceMap.get(key) ?? {
      date: key,
      total_incomes: 0,
      total_expenses: 0,
    };

    const value = operation.value ?? 0;

    if (operation.is_income) {
      balanceMap.set(key, {
        date: key,
        total_incomes: current_value.total_incomes + value,
        total_expenses: current_value.total_expenses,
      });
    } else {
      balanceMap.set(key, {
        date: key,
        total_incomes: current_value.total_incomes,
        total_expenses: current_value.total_expenses + value,
      });
    }
  });

  console.log(Array.from(balanceMap.values()));
  return Array.from(balanceMap.values());
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
  const weekly_expenses = calculateWeeklyExpenses(operations);
  const daily_expenses = calculateDailyExpenses(operations);

  return (
    <section className="mt-4 md:mt-20">
      <h1 className="text-[2.2rem] md:text-[3.2rem] font-bold">Dashboard</h1>
      <p className="text-slate-500 dark:text-gray-300 text-xl md:text-xl">
        Visão geral das finanças
      </p>

      <Tabs className="mt-10" defaultValue={avaliableMonths.at(-1)}>
        <TabsList>
          {avaliableMonths.map((month) => (
            <TabsTrigger key={month} value={month}>
              {formatMonthYear(month)}
            </TabsTrigger>
          ))}
        </TabsList>
        {avaliableMonths.map((month) => (
          <TabsContent key={month} value={month}>
            <p className="text-slate-500 dark:text-gray-300 text-md md:text-md">
              <Resume
                operations={filterOperationsByMonth(operations, month)}
                className="mt-10"
              >
                <>
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
                </>
              </Resume>
            </p>

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
                    data={calculateOperationEvolution(
                      filterOperationsByMonth(operations, month)
                    )}
                  />
                </TabsContent>

                <TabsContent value="bar">
                  <Bar
                    title="Comparação de entradas e saídas"
                    description="Ao longo do mês atual"
                    data={calculateOperationEvolution(
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
                  operation={emptyExpenseOperation}
                  actionFunction={createSaida}
                />
              </div>

              <div className="mt-2">
                <OperationDataTable operations={filterOperationsByMonth(operations, month)} />
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}