import { getMonthlyIncomes } from "@/db/queries/income";
import { formatter } from "@/lib/utils";
import ErrorLoading from "../error/ErrorLoading";
import { MoveUp } from "lucide-react";

interface TotalIncomes {
  total_incomes: number;
}

const EarningResumes = async () => {
  let total;

  try {
    const [result] = await getMonthlyIncomes();
    total = result;
  } catch (error) {
    return <ErrorLoading />
  }

  return (
    <div className="p-4">
      <p>Ganhos mensais</p>

      <h1 className="text-[2.2rem] md:text-[4rem] font-bold text-green-600 flex items-center">
        <MoveUp />
        {formatter.format((total as TotalIncomes).total_incomes / 100)}
      </h1>
    </div>
  );
};

export default EarningResumes;
