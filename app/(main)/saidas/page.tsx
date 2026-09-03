import MonthlySaidas from "./components/monthlySaidas";
import FormDialog from "../../../components/dialogs/FormDialog";
import { createSaida } from "@/actions/expense-actions";
import { ChartData, Operation, OperationArray } from "@/lib/definitions";
import { getExpenses } from "@/db/queries/expense";
import { getIncomes } from "@/db/queries/incomes";
import { operationValue } from "@/lib/parcelamento";
import ErrorLoading from "@/components/error/ErrorLoading";
import { filterOperationsByMonth, filterOperationsByMonthCharts, getAvaliableMonths } from "@/lib/date";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import ScrollableTabsList from "@/components/shared/ScrollableTabsList";
import { formatMonthYear, todayInUtcMinus3, toUtcMinus3Instant } from "@/lib/date";
import ReducedOperationDataTable from "@/components/data-table/ReducedOperationDataTable";
import ExpenseResumeCards from "./components/ExpenseResumeCards";
import { EmptyDemo } from "@/components/empty/EmptyDemo";
import FixedExpensesDataTable from "@/components/data-table/FixedExpensesDataTable";
import ImportCsvDialog from "@/components/dialogs/ImportCsvDialog";
import Heatmap from "@/components/charts/heatmap";

export const dynamic = "force-dynamic";

const emptyOperation: Operation = {
  name: '',
  value: 0,
  parcelas: 1,
  date: new Date(),
  is_income: false
};

function calculateYearlyExpenseMap(expenses: Operation[]): ChartData[] {
  const now = new Date();
  const end = toUtcMinus3Instant(now);
  const start = new Date(end);
  start.setUTCFullYear(start.getUTCFullYear() - 1);
  start.setUTCDate(start.getUTCDate() + 1);

  const expenseMap = new Map<string, number>();

  const cursor = new Date(start);
  while (cursor <= end) {
    const key = cursor.toISOString().split("T")[0];
    expenseMap.set(key, 0);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  expenses.forEach((op) => {
    if (op.is_income) return;
    const date = new Date(op.date ?? "");
    const key = date.toISOString().split("T")[0];
    if (expenseMap.has(key)) {
      expenseMap.set(key, (expenseMap.get(key) ?? 0) + operationValue(op) / 100);
    }
  });

  return Array.from(expenseMap.entries()).map(([date, value]) => ({ date, value }));
}

export default async function Saidas() {
  let expenses: Operation[];
  let incomes: Operation[];

  try {
    expenses = await getExpenses();
    incomes = await getIncomes();
  } catch (error) {
    console.error(error)
    return <ErrorLoading />;
  }

  const expensesArray = new OperationArray(expenses)
  const operations = [...expenses, ...incomes]

  const avaliableMonths = getAvaliableMonths(expenses);
  const currentDate = todayInUtcMinus3()
  const actualMonth = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`

  const heatmapData = calculateYearlyExpenseMap(expenses);

  //console.log(filterWeeklyExpenses(expenses).reverse());

  return (
    <>
      <h1 className="text-[3rem] font-bold mt-10">Saídas</h1>

      <Heatmap
        title="Expenses Activity"
        description="Total de gastos ao longo do ano"
        className="mt-10"
        data={heatmapData}
      />

      <Tabs className="mt-4" defaultValue={actualMonth}>
        <ScrollableTabsList className="w-full justify-start overflow-x-auto overflow-y-hidden whitespace-nowrap h-auto p-1 scrollbar-hide">
          {avaliableMonths.map((month) => (
            <TabsTrigger key={month} value={month} className="shrink-0">
              {formatMonthYear(month)}
            </TabsTrigger>
          ))}
        </ScrollableTabsList>
        {avaliableMonths.map((month) => (
          <TabsContent key={month} value={month}>

            <ExpenseResumeCards operations={operations} expenses={expenses} month={month} className="mt-10" />

            <MonthlySaidas expenses={filterOperationsByMonthCharts(expenses, month)} className="mt-10" />

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

                const filtered = filterOperationsByMonth(expensesArray.filterFixedOperations().getOperations(), month)

                  if (filtered.length === 0) {
                    return <EmptyDemo
                      title="Sem Gastos Fixos"
                      description="Você ainda não criou nenhum gasto fixo. Comece criando seu primeiro gasto fixo"
                      createButtonText="Criar Gasto Fixo"
                      importButtonText="Importar de CSV"
                      createButton={
                        <FormDialog
                          openDialogText="Criar Gasto Fixo"
                          dialogTitle="Adicionar Gasto"
                          dialogDescription="Preencha as informações do gasto"
                          buttonText="Adicionar"
                          operation={emptyOperation}
                          actionFunction={createSaida}
                        />
                      }
                      importButton={<ImportCsvDialog isIncome={false} />}
                    />
                  }

                return <FixedExpensesDataTable operations={filtered} />
              })()}
            </div>


            <h2 className="subtitle mt-10">Gastos variáveis</h2>

            <div className="mt-2">
              {(() => {
                const variableOps = expensesArray.filterVariableOperations().filterOperationsByMonth(month).reverse();
                if (variableOps.length === 0) {
                  return (
                    <EmptyDemo
                      title="Sem Gastos Variáveis"
                      description="Você ainda não criou nenhum gasto variável neste mês."
                      createButtonText="Criar Gasto"
                      importButtonText="Importar de CSV"
                      createButton={
                        <FormDialog
                          openDialogText="Criar Gasto"
                          dialogTitle="Adicionar Gasto"
                          dialogDescription="Preencha as informações do gasto"
                          buttonText="Adicionar"
                          operation={emptyOperation}
                          actionFunction={createSaida}
                        />
                      }
                      importButton={<ImportCsvDialog isIncome={false} />}
                    />
                  );
                }
                return <ReducedOperationDataTable operations={variableOps} />;
              })()}
            </div>


            {/* COMPRAS PARCELADAS

            <h2 className="subtitle mt-10">Meus parcelamentos</h2>

            <div className="mt-2">
              <ReducedOperationDataTable operations={expensesArray.filterComprasParceladas().getOperations()} />
            </div> */}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};