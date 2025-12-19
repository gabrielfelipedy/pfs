import ErrorLoading from "../error/ErrorLoading";
import Costs from "./costs";
import {
  getDailyExpenses,
  getMonthlyExpenses,
  getWeeklyExpenses,
} from "@/db/queries/expense";

interface Data {
  total_value: number | null;
}

const CostsResume = async () => {
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
    return <ErrorLoading />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 grid-rows-3 gap-4 mt-4 p-4">
      <div className="md:row-span-2">
        <Costs
          title="Gastos Diários"
          currencyValue={daily_data.total_value / 100}
          currencyTextClassName="text-[2.2rem] md:text-[5rem]"
        />
      </div>
      <div className="md:text-right">
        <Costs
          title="Gastos da semana"
          currencyValue={weekly_data.total_value / 100}
          currencyTextClassName="text-[2.2rem] md:text-4xl text-slate-500"
        />
      </div>
      <div className="md:col-start-2 md:row-start-2 md:text-right">
        <Costs
          title="Gastos do mês"
          currencyValue={monthly_data.total_value / 100}
          currencyTextClassName="text-[2.2rem] md:text-4xl text-slate-500"
        />
      </div>
    </div>
  );
};

export default CostsResume;
