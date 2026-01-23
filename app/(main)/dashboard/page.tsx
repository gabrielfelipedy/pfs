//import Image from "next/image";

import Area from "@/components/charts/area";
import ErrorLoading from "@/components/error/ErrorLoading";
// import { Operation } from "@/lib/definitions";
import { getOperations } from "@/db/queries/operation";
import Resume from "@/components/resume/resume";
import Line from "@/components/charts/line";
import Bar from "@/components/charts/bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateBalanceEvolution, calculateIncomesAndExpensesEvolution  } from "@/lib/operation";
import { filterOperationsByMonth, getAvaliableMonths, formatMonthYear, filterOperationsByMonthCharts } from "@/lib/date";


/* const emptyExpenseOperation: Operation = {
  name: "",
  date: new Date(),
  value: 0,
  parcelas: 1,
  is_income: false,
};

const emptyIncomeOperation: Operation = {
  name: "",
  value: 0,
  parcelas: 1,
  date: new Date(),
  is_income: true
}; */


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
  //console.log(avaliableMonths)
  const currentDate = new Date()
  const actualMonth = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`

  return (
    <>
      <h1 className="text-[2.2rem] md:text-[3rem] font-bold">Dashboard</h1>
     

      <Tabs className="mt-6" defaultValue={actualMonth}>
        <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden whitespace-nowrap h-auto p-1 scrollbar-hide">
          
          {avaliableMonths.map((month) => (

            
            <TabsTrigger key={month} value={month} className="shrink-0">
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
                  filterOperationsByMonthCharts(operations, month)
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

              {/* <div className="mt-10 flex gap-5">
                
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
              </div> */}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}