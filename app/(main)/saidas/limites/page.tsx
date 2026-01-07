import { getExpensesLimit } from "@/db/queries/limits";
import ErrorLoading from "@/components/error/ErrorLoading";
import LimitsResume from "./components/LimitsResume";
import { getExpenses } from "@/db/queries/expense";
import { ExpenseLimit, Operation } from "@/lib/definitions";
import { calculateOperationProportion } from "@/lib/operation";
import { filterOperationsByMonth, getAvaliableMonths } from "@/lib/date";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMonthYear } from "@/lib/date";

export type ExpenseProprtion = {
  category_id: number | null;
  category_name: string;
  total: number;
};

const page = async () => {
  let expenses: Operation[];
  let limits: ExpenseLimit[]

  try {
    expenses = await getExpenses();
    limits = await getExpensesLimit();
  } catch (error) {
    return <ErrorLoading />;
  }

  const avaliableMonths = getAvaliableMonths(expenses);
  //console.log(calculateOperationProportion(expenses))

  return (
    <div>
      <h1 className="title">Limites por categoria</h1>

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

            <LimitsResume expenseLimits={limits} expensesProportion={calculateOperationProportion(filterOperationsByMonth(expenses, month))} className="mt-10" />

         
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default page;