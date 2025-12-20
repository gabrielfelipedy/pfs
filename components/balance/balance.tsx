import { getMonthlyBalance } from "@/db/queries/balance";
import { formatter } from "@/lib/utils";
import ErrorLoading from "../error/ErrorLoading";
import { MoveDown, MoveUp } from "lucide-react";

interface Balance {
  saldo: number;
}

interface Props {
  className: string;
}

const Balance = async ({className}: Props) => {
  let data;

  try {
    const [result] = await getMonthlyBalance();
    data = result;
  } catch (error) {
    return <ErrorLoading />
  }

  const balance = (data as Balance).saldo / 100;

  return (
    <div className={`${className} p-4 rounded-lg`}>
      <p>Saldo Mensal</p>

      <h1
        className={`${
          balance <= 0 ? "text-red-600" : "text-green-600"
        } flex items-center text-[2.2rem] md:text-[4rem] font-bold`}
      >
        {balance <= 0? <MoveDown /> : <MoveUp />}
        {formatter.format(Math.abs(balance))}
      </h1>
    </div>
  );
};

export default Balance;
