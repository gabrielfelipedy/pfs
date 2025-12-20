import ErrorLoading from "../error/ErrorLoading";
import Costs from "./costs";
import {
  getDailyExpenses,
  getMonthlyExpenses,
  getWeeklyExpenses,
} from "@/db/queries/expense";

import { MoveDown } from "lucide-react";

interface Data {
  total_value: number | null;
}

interface Props {
  className?: string;
}

const CostsResume = async ({ className }: Props) => {
  let daily_data;
  let weekly_data;
  let monthly_data;

  try {
    const [daily_result] = await getDailyExpenses();
    daily_data = daily_result;

    const [weekly_result] = await getWeeklyExpenses();
    weekly_data = weekly_result;

    const [monthly_result] = await getMonthlyExpenses();
    monthly_data = monthly_result;
  } catch (error) {
    return <ErrorLoading />;
  }

  return (
    <div className={`${className} gap-4 p-4`}>
      <div className="flex flex-col md:flex-row justify-between gap-5">
        <Costs
          title="Gastos Diários"
          currencyValue={daily_data.total_value / 100}
        />

        <Costs
          title="Gastos da semana"
          currencyValue={weekly_data.total_value / 100}
        />

        <Costs
          title="Gastos do mês"
          currencyValue={monthly_data.total_value / 100}
        />
      </div>
    </div>
  );
};

export default CostsResume;
