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

export const dynamic = "force-dynamic";

const emptyOperation: Operation = {
  is_income: false,
};

export default async function Saidas() {
  let expenses: Operation[];

  try {
    expenses = await getExpenses();
  } catch (error) {
    return <ErrorLoading />;
  }
  //console.log(expenses)

  const avaliableMonths = getAvaliableMonths(expenses);

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

      <p className="mt-10 text-sm text-[#cecece]">FILTRAR POR MÊS</p>
      <Tabs className="mt-4" defaultValue={avaliableMonths.at(-1)}>
        <TabsList>
          {avaliableMonths.map((month) => (
            <TabsTrigger key={month} value={month}>
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

            <div className="mt-2">
              <ReducedOperationDataTable operations={filterOperationsByMonth(expenses, month).reverse()} />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};