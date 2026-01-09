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
import CardResume from "@/components/resume/card-resume";
import { TrendingDownIcon } from "lucide-react";
import { calculateDailyExpenses, calculateWeeklyExpenses, filterDailyExpenses, filterWeeklyExpenses } from "@/lib/operation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { formatter } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogTitle } from "@radix-ui/react-dialog";

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
  const weekly_expenses = calculateWeeklyExpenses(expenses);
  const daily_expenses = calculateDailyExpenses(expenses);

  //console.log(filterWeeklyExpenses(expenses).reverse());

  return (
    <>
      <h1 className="text-[3rem] font-bold mt-10">Saídas</h1>

      <div className="mt-10 grid gap-3 grid-cols-1 md:grid-cols-2 items-start">

        <div>

        <Dialog>
          <DialogTitle></DialogTitle>
          <DialogTrigger asChild className="hover:cursor-pointer transition-all">
            <CardResume
              title="Gastos semanais"
              icon={<TrendingDownIcon className="h-4 w-4 text-muted-foreground" />}
              data={weekly_expenses}
              subtext="Total de saídas registradas"
              is_income={false}
            />
          </DialogTrigger>
          <DialogContent className="w-screen">
            <p>Gastos semanais</p>
            <ScrollArea>
              {filterWeeklyExpenses(expenses).map((weekExpense) => (
                <div key={weekExpense.id}>
                  <div className="grid grid-cols-3 w-full "><p className="text-sm">{weekExpense.name}</p>

                    <p className="text-sm text-center">{weekExpense.date?.toLocaleDateString('pt-BR')}</p>

                    <p className="text-sm text-end">{formatter.format((weekExpense.value ?? 0) / 100)}</p></div>

                  <Separator className="my-1" />
                </div>
              ))}
            </ScrollArea>
          </DialogContent>
        </Dialog>
        </div>

        <div>

        <Dialog>
          <DialogTrigger asChild className="hover:scale-101 hover:cursor-pointer transition-all">
            <CardResume
              title="Gastos diários"
              icon={<TrendingDownIcon className="h-4 w-4 text-muted-foreground" />}
              data={daily_expenses}
              subtext="Total de saídas registradas"
              is_income={false}
            />
          </DialogTrigger>
          <DialogContent>
            <p>Gastos diários</p>
            <ScrollArea>
              {filterDailyExpenses(expenses).map((weekExpense) => (
                <div key={weekExpense.id}>
                  <div className="grid grid-cols-3 w-full "><p className="text-sm">{weekExpense.name}</p>

                    <p className="text-sm text-center">{weekExpense.date?.toLocaleDateString('pt-BR')}</p>

                    <p className="text-sm text-end">{formatter.format((weekExpense.value ?? 0) / 100)}</p></div>

                  <Separator className="my-1" />
                </div>
              ))}
            </ScrollArea>
          </DialogContent>
        </Dialog>
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

export default Saidas;
