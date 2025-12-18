
import { getIncomesEvolution, getIncomesProportion } from "@/db/queries/income";
import GenericLineChart from "./genericLineChart";

import GenericPieChart from "./genericPieChart";
import { DataProportion } from "@/lib/definitions";
import { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  total_salario: {
    label: "Salário",
    color: "var(--chart-1)",
  },
  total_design: {
    label: "Design Gráfico",
    color: "var(--chart-2)",
  },
  total_musica: {
    label: "Música",
    color: "var(--chart-3)",
  },
  total_uncategorized: {
    label: "Não categorizado",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const MonthlyEntradas = async () => {
  let income_data;
  let income_proportion;

  try {
    const result_expenses = await getIncomesEvolution();
    income_data = result_expenses;

    const {rows: [saidaProportion]} = await getIncomesProportion();
    income_proportion = saidaProportion;

  } catch (error) {
    console.error(error)
    //console.log(income_proportion)
    return <div className="p-4 text-red-500">Erro ao carregar dados.</div>;
  }

  const transformedData = income_data.map((item) => ({
    ...item,
    total_value: item.total_value / 100,
  }));

  
  let transformedSaidaProportion;
  
  try {

  transformedSaidaProportion = Object.entries(income_proportion)
    .filter(([key]) => key !== "total_sum")
    .map(([key, val]) => ({
      type: key,
      value: Number(
        Number(
          (Number(val) / 100 / (Number(income_proportion.total_sum) / 100)) * 100
        ).toFixed(2)
      ),
    }));

  console.log(transformedSaidaProportion)

  }
  catch(error)
  {
    return <div className="p-4 text-red-500">Erro ao processar dados.</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full justify-between">
      <GenericLineChart
        title="Evolução de entradas"
        description="Evolução dos meus ganhos ao longo do mês"
        data={transformedData}
      />
      <GenericPieChart 
      title="Evolução das entradas"
      description="No período de um mês"
      data={transformedSaidaProportion}
      config={chartConfig}
      />
    </div>
  );
};

export default MonthlyEntradas;