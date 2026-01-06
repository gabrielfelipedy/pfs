import { ExpenseLimit, Operation, OperationBalance } from "@/lib/definitions";

import RadialBarChart from "@/components/charts/radialBarChart";

interface Props {
  className?: string;
  expensesProportion?: OperationBalance[];
  expenseLimits?: ExpenseLimit[];
}

// HERE IS THE HEART OF THE LOGIC TO MERGE LIMITS AND PROPORTIONS, MORE COMPLEX LOGIC CAN BE ADDED HERE
const mergeData = (
  limits: ExpenseLimit[],
  expensesProportion: OperationBalance[]
): ExpenseLimit[] => {
  return limits.map((limit) => {
    const proportion = expensesProportion.find(
      (prop) => prop.name === limit.category_name
    );

    return {
      ...limit,
      spend: proportion?.value ?? 0,
    };
  });
};

const LimitsResume = ({
  className,
  expensesProportion,
  expenseLimits,
}: Props) => {
  //console.log(data)
  //console.log(expenseLimits)
  //console.log(expensesProportion)
  const data = mergeData(expenseLimits ?? [], expensesProportion ?? []);

  return (
    <div className={`${className} w-full py-6 flex flex-col gap-5`}>

      <h1 className="text-2xl font-medium">Limites diários</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full ">

        {data.filter((item) => item.period_id === 1).map((item) => (
          <RadialBarChart
            key={item.id}
            title={item.name ?? ""}
            expenseLimit={item}
          />
        ))}
      </div>

      <h1 className="text-2xl font-medium">Limites semanais</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full ">

        {data.filter((item) => item.period_id === 2).map((item) => (
          <RadialBarChart
            key={item.id}
            title={item.name ?? ""}
            expenseLimit={item}
          />
        ))}
      </div>

      <h1 className="text-2xl font-medium">Limites mensais</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full ">

        {data.filter((item) => item.period_id === 3).map((item) => (
          <RadialBarChart
            key={item.id}
            title={item.name ?? ""}
            expenseLimit={item}
          />
        ))}
      </div>
    </div>
  );
};

export default LimitsResume;
