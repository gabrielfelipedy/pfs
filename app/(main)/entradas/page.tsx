import FormDialog from "../../../components/dialogs/FormDialog";
import { createEntrada } from "@/actions/income-actions";
import { Operation } from "@/lib/definitions";
import MonthlyEntradas from "./monthlyEntradas";
import { getIncomes } from "@/db/queries/incomes";
import ErrorLoading from "@/components/error/ErrorLoading";
import { filterOperationsByMonth, getAvaliableMonths } from "@/lib/date";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMonthYear } from "@/lib/date";
import ReducedOperationDataTable from "@/components/data-table/ReducedOperationDataTable";

const emptyOperation: Operation = {
  is_income: true,
};

const Entradas = async () => {
  let incomes: Operation[];

  try {
    incomes = await getIncomes();
  } catch (error) {
    return <ErrorLoading />;
  }

  const avaliableMonths = getAvaliableMonths(incomes);

  return (
    <>
      <h1 className="text-[3rem] font-bold mt-10">Entradas</h1>

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
            
            <MonthlyEntradas
              incomes={filterOperationsByMonth(incomes, month)}
              className="mt-4"
            />

            <div className="mt-10">
              {/* <CreateSaidaDialog /> */}
              <FormDialog
                openDialogText="Adicionar entrada"
                dialogTitle="Adicionar entrada"
                dialogDescription="Preencha as informações da entrada"
                buttonText="Adicionar"
                operation={emptyOperation}
                actionFunction={createEntrada}
              />
            </div>

            <div className="mt-2">
              <ReducedOperationDataTable
                operations={filterOperationsByMonth(incomes, month)}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default Entradas;
