import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ActivityIcon,
  DollarSignIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { getMonthlyIncomes } from "@/db/queries/incomes";
import ErrorLoading from "../error/ErrorLoading";
import CardResume from "./card-resume";
import {
  getDailyExpenses,
  getMonthlyExpenses,
  getWeeklyExpenses,
} from "@/db/queries/expense";
import { getMonthlyBalance } from "@/db/queries/balance";

interface Props {
  className?: string;
}

const Resume = async ({ className }: Props) => {
  let total;
  let daily_data;
  let weekly_data;
  let monthly_data;
  let balance;

  try {
    const [result] = await getMonthlyIncomes();
    total = result;

    const [daily_result] = await getDailyExpenses();
    daily_data = daily_result;

    const [weekly_result] = await getWeeklyExpenses();
    weekly_data = weekly_result;

    const [monthly_result] = await getMonthlyExpenses();
    monthly_data = monthly_result;

    const [balance_data] = await getMonthlyBalance();
    balance = balance_data;
  } catch (error) {
    return <ErrorLoading />;
  }

  console.log(balance);

  return (
    <div className={`${className} w-full py-6 flex flex-col gap-5`}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full ">
        <CardResume
          title="Saldo mensal"
          icon={<TrendingUpIcon className="h-4 w-4 text-muted-foreground" />}
          data={balance.balance}
          subtext="No último mês"
          is_income={balance.balance > 0}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
        <CardResume
          title="Entradas mensais"
          icon={<TrendingUpIcon className="h-4 w-4 text-muted-foreground" />}
          data={total.total_incomes}
          subtext="No último mês"
          is_income={true}
        />

        <CardResume
          title="Gastos mensais"
          icon={<TrendingDownIcon className="h-4 w-4 text-muted-foreground" />}
          data={monthly_data.total_value}
          subtext="No último mês"
        />

        <CardResume
          title="Gastos semanais"
          icon={<TrendingDownIcon className="h-4 w-4 text-muted-foreground" />}
          data={weekly_data.total_value}
          subtext="No último mês"
        />

        <CardResume
          title="Gastos diários"
          icon={<TrendingDownIcon className="h-4 w-4 text-muted-foreground" />}
          data={daily_data.total_value}
          subtext="No último mês"
        />
      </div>
    </div>
  );
};

export default Resume;
