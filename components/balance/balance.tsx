import { getMonthlyBalance } from "@/db/queries/balance";
import { formatter } from "@/lib/utils";
import ErrorLoading from "../error/ErrorLoading";

interface Balance {
  saldo: number;
}

const Balance = async () => {
  let data;

  try {
    const [result] = await getMonthlyBalance();
    data = result;
  } catch (error) {
    return <ErrorLoading />
  }

  const balance = (data as Balance).saldo / 100;

  return (
    <div className="p-4 rounded-lg border-2">
      <p>Saldo Mensal</p>

      <h1
        className={`${
          balance <= 0 ? "text-red-600" : "text-green-600"
        } text-[2.2rem] md:text-[5rem] font-bold`}
      >
        {formatter.format(balance)}
      </h1>
    </div>
  );
};

export default Balance;
