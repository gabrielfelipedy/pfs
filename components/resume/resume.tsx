import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ActivityIcon, DollarSignIcon, TrendingDownIcon, TrendingUpIcon, UsersIcon } from "lucide-react";
import { getMonthlyIncomes } from '@/db/queries/income';
import ErrorLoading from '../error/ErrorLoading';
import CardResume from "./card-resume";
import { getDailyExpenses, getMonthlyExpenses, getWeeklyExpenses } from "@/db/queries/expense";

const Resume = async () => {

  let total;
  let daily_data;
  let weekly_data;
  let monthly_data;

  try {
    const [result] = await getMonthlyIncomes();
    total = result;

    const [daily_result] = await getDailyExpenses();
    daily_data = daily_result;

    const [weekly_result] = await getWeeklyExpenses();
    weekly_data = weekly_result;

    const [monthly_result] = await getMonthlyExpenses();
    monthly_data = monthly_result;

  } catch (error) {
    return <ErrorLoading />
  }

  return (
    <div className="w-full py-6 flex">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl">

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
  )
}

export default Resume