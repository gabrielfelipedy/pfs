import { ExpenseLimit } from "@/lib/definitions";
import { ExpenseProprtion } from "../page";

import RadialBarChart from "@/components/charts/radialBarChart";

interface Props {
  className?: string;
  expenseLimits: ExpenseLimit[];
  expensesBalance: ExpenseProprtion[];
}

const LimitsResume = ({ className, expenseLimits, expensesBalance }: Props) => {
  //console.log(expenseLimits)
  //console.log(expensesBalance)

  const balanceMap = new Map(
    expensesBalance.map((item) => [item.category_id, item.total])
  );

  const mergedData = expenseLimits.map((item) => ({
    ...item,
    spend: balanceMap.get(item.category_id ?? 0) ?? 0,
  }));

  console.log(mergedData)

  return (
    <div className={`${className} w-full py-6 flex flex-col gap-5`}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full ">
        {mergedData.map((item) => (
          <RadialBarChart
            key={item.id}
            title={item.name ?? ""}
            data={item.spend}
            maxValue={item.value ?? 0}
          />
        ))}
      </div>
    </div>
  );
};

export default LimitsResume;