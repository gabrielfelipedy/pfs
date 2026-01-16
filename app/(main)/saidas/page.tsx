import MonthlySaidas from "./components/monthlySaidas";
import FormDialog from "../../../components/dialogs/FormDialog";
import { createSaida } from "@/actions/expense-actions";
import { Operation } from "@/lib/definitions";
import { getExpenses } from "@/db/queries/expense";
import ErrorLoading from "@/components/error/ErrorLoading";
import { filterOperationsByMonth, getAvaliableMonths } from "@/lib/date";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMonthYear } from "@/lib/date";
import ReducedOperationDataTable from "@/components/data-table/ReducedOperationDataTable";
import DailyExpenses from "./components/DailyExpenses";
import WeeklyExpenses from "./components/WeeklyExpenses";
import { filterFixedOperations, filterVariableOperations } from "@/lib/operation";
import { EmptyDemo } from "@/components/empty/EmptyDemo";
import FixedExpensesDataTable from "@/components/data-table/FixedExpensesDataTable";

export const dynamic = "force-dynamic";

const emptyOperation: Operation = {
  name: '',
  value: 0,
  parcelas: 1,
  date: new Date(),
  is_income: false
};

export default async function Saidas() {
  let expenses: Operation[];

  try {
    expenses = await getExpenses();
  } catch (error) {
    console.error(error)
    return <ErrorLoading />;
  }
  //console.log(expenses)

  const avaliableMonths = getAvaliableMonths(expenses);
  const currentDate = new Date()
  const actualMonth = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`

  //console.log(filterWeeklyExpenses(expenses).reverse());

  return (
    <>
      <h1 className="text-[3rem] font-bold mt-10">Saídas</h1>

      <div className="mt-10 grid gap-3 grid-cols-1 md:grid-cols-2 items-start">

        <div>
          <WeeklyExpenses expenses={expenses} />
        </div>

        <div>

          <DailyExpenses expenses={expenses} />
        </div>
      </div>


      <Tabs className="mt-4" defaultValue={actualMonth}>
        <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden whitespace-nowrap h-auto p-1 scrollbar-hide">
          {avaliableMonths.map((month) => (
            <TabsTrigger key={month} value={month} className="shrink-0">
              {formatMonthYear(month)}
            </TabsTrigger>
          ))}
        </TabsList>
        {avaliableMonths.map((month) => (
          <TabsContent key={month} value={month}>

            <MonthlySaidas expenses={filterOperationsByMonth(expenses, month)} className="mt-10" />

            <div className="mt-10">
              {/* <CreateSaidaDialog /> */}
              <FormDialog
                openDialogText="Adicionar Gasto"
                dialogTitle="Adicionar Gasto"
                dialogDescription="Preencha as informações do gasto"
                buttonText="Adicionar"
                operation={emptyOperation}
                actionFunction={createSaida}
              />
            </div>

            <h2 className="subtitle mt-10">Gastos fixos</h2>

            <div className="mt-2">
              {(() => {

                //console.log(expenses.filter((e) => e.period_id === 3))

                const filtered = filterFixedOperations(filterOperationsByMonth(expenses, month))

                if (filtered.length === 0) {
                  return <EmptyDemo
                    title="Sem Gastos Fixos"
                    description="Você ainda não criou nenhum gasto fixo. Comece criando seu primeiro gasto fixo"
                    createButtonText="Criar Gasto Fixo"
                    importButtonText="Importar de CSV"
                  />
                }

                return <FixedExpensesDataTable month={month} operations={filtered} />
              })()}
            </div>


            <h2 className="subtitle mt-10">Gastos variáveis</h2>

            <div className="mt-2">
              <ReducedOperationDataTable operations={filterVariableOperations(filterOperationsByMonth(expenses, month)).reverse()} />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};