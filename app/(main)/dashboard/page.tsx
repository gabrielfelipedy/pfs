"use client";

import Area from "@/components/charts/area";
import ErrorLoading from "@/components/error/ErrorLoading";
import { useOperations } from "@/components/operations/OperationsProvider";
import Resume from "@/components/resume/resume";
import Line from "@/components/charts/line";
import Bar from "@/components/charts/bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateBalanceEvolution, calculateIncomesAndExpensesEvolution } from "@/lib/operation";
import { filterOperationsByMonth, getAvaliableMonths, formatMonthYear, filterOperationsByMonthCharts, todayInUtcMinus3 } from "@/lib/date";
import ScrollableTabsList from "@/components/shared/ScrollableTabsList";

export default function Home() {
  const { operations, error } = useOperations();

  if (error) return <ErrorLoading />;

  const avaliableMonths = getAvaliableMonths(operations);
  const currentDate = todayInUtcMinus3()
  const actualMonth = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`

  return (
    <>
      <h1 className="text-[2.2rem] md:text-[3rem] font-bold">Dashboard</h1>

      <Tabs className="mt-6" defaultValue={actualMonth}>
        <ScrollableTabsList className="w-full justify-start overflow-x-auto overflow-y-hidden whitespace-nowrap h-auto p-1 scrollbar-hide">
          {avaliableMonths.map((month) => (
            <TabsTrigger key={month} value={month} className="shrink-0">
              {formatMonthYear(month)}
            </TabsTrigger>
          ))}
        </ScrollableTabsList>
        {avaliableMonths.map((month) => (
          <TabsContent key={month} value={month}>
            <Resume
              operations={filterOperationsByMonth(operations, month)}
              className="mt-2"
            />

            <div className="mt-8 flex flex-col gap-5">
              <Tabs defaultValue="area">
                <TabsList>
                  <TabsTrigger value="area">Gráfico de Área</TabsTrigger>
                  <TabsTrigger value="line">Gráfico de Linha</TabsTrigger>
                </TabsList>
                <TabsContent value="area">
                  <Line
                    variant="area"
                    title="Evolução do saldo"
                    description="Ao longo do mês atual"
                    data={calculateBalanceEvolution(
                      filterOperationsByMonthCharts(operations, month)
                    )}
                  />
                </TabsContent>

                <TabsContent value="line">
                  <Line
                    variant="line"
                    title="Evolução do saldo"
                    description="Ao longo do mês atual"
                    data={calculateBalanceEvolution(
                      filterOperationsByMonthCharts(operations, month)
                    )}
                  />
                </TabsContent>
              </Tabs>

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
                      filterOperationsByMonthCharts(operations, month)
                    )}
                  />
                </TabsContent>

                <TabsContent value="bar">
                  <Bar
                    title="Comparação de entradas e saídas"
                    description="Ao longo do mês atual"
                    data={calculateIncomesAndExpensesEvolution(
                      filterOperationsByMonthCharts(operations, month)
                    )}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
