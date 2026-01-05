import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { getMonthlyIncomes } from "@/db/queries/incomes";
import ErrorLoading from "../error/ErrorLoading";
import CardResume from "./card-resume";
import {
  getDailyExpenses,
  getMonthlyExpenses,
  getWeeklyExpenses,
} from "@/db/queries/expense";
import { getMonthlyBalance } from "@/db/queries/balance";
import { Operation } from "@/lib/definitions";
import { isSameWeek, isToday } from "date-fns";
import { calculateIncomes } from "@/lib/date";

interface Props {
  operations: Operation[];
  className?: string;
  children?: React.ReactNode;
}

const calculateBalance = (operations: Operation[]) => {
  let balance = 0;
  operations.forEach((operation) => {
    if (operation.is_income) {
      balance += operation.value ?? 0;
    } else {
      balance -= operation.value ?? 0;
    }
  });
  return balance;
};

const calculateExpenses = (operations: Operation[]) => {
  let total = 0;
  operations.forEach((operation) => {
    if (!operation.is_income) {
      total += operation.value ?? 0;
    }
  });
  return total;
};

const Resume = async ({ operations, className, children }: Props) => {
  //console.log(balance);
  const balance = calculateBalance(operations);
  const incomes = calculateIncomes(operations);
  const expenses = calculateExpenses(operations);

  return (
    <div className={`${className} w-full py-6 flex flex-col gap-5`}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full ">
        <CardResume
          title="Saldo mensal"
          icon={<TrendingUpIcon className="h-4 w-4 text-muted-foreground" />}
          data={balance}
          subtext="No último mês"
          is_income={balance > 0}
        />

        <CardResume
          title="Entradas mensais"
          icon={<TrendingUpIcon className="h-4 w-4 text-muted-foreground" />}
          data={incomes}
          subtext="No último mês"
          is_income={true}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
        <CardResume
          title="Gastos mensais"
          icon={<TrendingDownIcon className="h-4 w-4 text-muted-foreground" />}
          data={expenses}
          subtext="No último mês"
        />

        {children}
      </div>
    </div>
  );
};

export default Resume;
