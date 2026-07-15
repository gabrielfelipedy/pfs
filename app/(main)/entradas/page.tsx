import FormDialog from "../../../components/dialogs/FormDialog";
import { createEntrada } from "@/actions/income-actions";
import { Operation, OperationArray } from "@/lib/definitions";
import MonthlyEntradas from "./monthlyEntradas";
import MonthlyIncome from "./MonthlyIncome";
import { getIncomes } from "@/db/queries/incomes";
import ErrorLoading from "@/components/error/ErrorLoading";
import { filterOperationsByMonth, filterOperationsByMonthCharts, getAvaliableMonths } from "@/lib/date";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { formatMonthYear } from "@/lib/date";
import ReducedOperationDataTable from "@/components/data-table/ReducedOperationDataTable";
import FixedExpensesDataTable from "@/components/data-table/FixedExpensesDataTable";
import { EmptyDemo } from "@/components/empty/EmptyDemo";
import ImportCsvDialog from "@/components/dialogs/ImportCsvDialog";
import ScrollableTabsList from "@/components/shared/ScrollableTabsList";

const emptyOperation: Operation = {
  name: "",
  value: 0,
  parcelas: 1,
  date: new Date(),
  is_income: true
};


const Entradas = async () => {
  let incomes: Operation[];

  try {
    incomes = await getIncomes();
  } catch (error) {
    console.error(error)
    return <ErrorLoading />;
  }

  const incomesArray = new OperationArray(incomes)

  const avaliableMonths = getAvaliableMonths(incomes);
  const currentDate = new Date()
  const actualMonth = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`

  return (
    <>
      <h1 className="text-[3rem] font-bold mt-10">Entradas</h1>

      <Tabs className="mt-10" defaultValue={actualMonth}>
        <ScrollableTabsList className="w-full justify-start overflow-x-auto overflow-y-hidden whitespace-nowrap h-auto p-1 scrollbar-hide">
          {avaliableMonths.map((month) => (
            <TabsTrigger key={month} value={month} className="shrink-0">
              {formatMonthYear(month)}
            </TabsTrigger>
          ))}
        </ScrollableTabsList>
        {avaliableMonths.map((month) => (
          <TabsContent key={month} value={month}>

            <div className="mt-10 grid gap-3 grid-cols-1 lg:grid-cols-3 items-start">
              <MonthlyIncome incomes={incomes} month={month} />
            </div>

            <MonthlyEntradas
              incomes={filterOperationsByMonthCharts(incomes, month)}
              className="mt-4"
            />

            <h2 className="subtitle mt-10">Entradas fixas</h2>

            <div className="mt-2">
              {(() => {
                const filtered = filterOperationsByMonth(incomesArray.filterFixedOperations().getOperations(), month)


                  if (filtered.length === 0) {
                    return <EmptyDemo
                      title="Sem Entradas Fixas"
                      description="Você ainda não criou nenhuma entrada fixa. Comece criando sua primeira entrada"
                      createButtonText="Criar Entrada Fixo"
                      importButtonText="Importar de CSV"
                      createButton={
                        <FormDialog
                          openDialogText="Criar Entrada Fixo"
                          dialogTitle="Adicionar entrada"
                          dialogDescription="Preencha as informações da entrada"
                          buttonText="Adicionar"
                          operation={emptyOperation}
                          actionFunction={createEntrada}
                        />
                      }
                      importButton={<ImportCsvDialog isIncome={true} />}
                    />
                  }

                return <FixedExpensesDataTable operations={filtered} />
              })()}
            </div>

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
              {(() => {
                const variableOps = filterOperationsByMonth(incomesArray.filterVariableOperations().getOperations(), month).reverse();
                if (variableOps.length === 0) {
                  return (
                    <EmptyDemo
                      title="Sem Entradas Variáveis"
                      description="Você ainda não criou nenhuma entrada variável neste mês."
                      createButtonText="Criar Entrada"
                      importButtonText="Importar de CSV"
                      createButton={
                        <FormDialog
                          openDialogText="Criar Entrada"
                          dialogTitle="Adicionar entrada"
                          dialogDescription="Preencha as informações da entrada"
                          buttonText="Adicionar"
                          operation={emptyOperation}
                          actionFunction={createEntrada}
                        />
                      }
                      importButton={<ImportCsvDialog isIncome={true} />}
                    />
                  );
                }
                return <ReducedOperationDataTable operations={variableOps} />;
              })()}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default Entradas;