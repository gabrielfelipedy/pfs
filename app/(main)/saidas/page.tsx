import MonthlySaidas from "./components/monthlySaidas";
import FormDialog from "../../../components/dialogs/FormDialog";
import { createSaida } from "@/actions/expense-actions";
import { Operation } from "@/lib/definitions";
import OperationDataTable from "@/components/data-table/OperationDataTable";
import { getExpenses } from "@/db/queries/expense";
import ErrorLoading from "@/components/error/ErrorLoading";
import { filterOperationsByMonth, getAvaliableMonths } from "@/lib/operation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMonthYear } from "@/lib/date";

export const dynamic = "force-dynamic";

const emptyOperation: Operation = {
  is_income: false,
};

const Saidas = async () => {
  let expenses: Operation[];

  try {
    expenses = await getExpenses();
  } catch (error) {
    return <ErrorLoading />;
  }
  //console.log(expenses)

  const avaliableMonths = getAvaliableMonths(expenses);

  return (
    <>
      <h1 className="text-[3rem] font-bold mt-10">Saídas</h1>
      <p className="text-xl text-slate-600">Todos os registros de saídas</p>

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
            <MonthlySaidas expenses={filterOperationsByMonth(expenses, month)} className="mt-4" />

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
              <OperationDataTable operations={expenses} />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default Saidas;
