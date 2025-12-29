import { ExpenseLimit } from "@/lib/definitions";

import RadialBarChart from "@/components/charts/radialBarChart";

interface Props {
  className?: string;
  data: ExpenseLimit[];
}

const LimitsResume = ({ className, data }: Props) => {

  console.log(data)

  return (
    <div className={`${className} w-full py-6 flex flex-col gap-5`}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full ">
        {data.map((item) => (
          <RadialBarChart
            key={item.id}
            title={item.name ?? ""}
            data={item.spend ?? 0}
            maxValue={item.value ?? 0}
          />
        ))}
      </div>
    </div>
  );
};

export default LimitsResume;