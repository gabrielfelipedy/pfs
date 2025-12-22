import {
  getExpensesEvolution,
  getExpensesProportion,
} from "@/db/queries/expense";

import Line from "@/components/charts/line";
import Pie from "@/components/charts/pie";
import ErrorLoading from "@/components/error/ErrorLoading";
import Radar from "@/components/charts/radar";
import TreeMap from "@/components/charts/treemap";

interface Props {
  className?: string;
}

const MonthlySaidas = async ({className}: Props) => {
  let expense_data;
  let expense_proportion;
  try {
    const data = await getExpensesEvolution();
    //console.log(data)
    expense_data = data;

    const {
      rows: [saidaProportion],
    } = await getExpensesProportion();
    expense_proportion = saidaProportion;
    //console.log(saidaProportion)
  } catch (error) {
    console.error(error);
    return <ErrorLoading />
  }

  const transformedData = expense_data.map((item) => ({
    ...item,
    total_value: item.total_value / 100,
  }));
  //console.log(transformedData)

  let transformedSaidaProportion;

  try {
    transformedSaidaProportion = Object.entries(expense_proportion)
      .filter(([key]) => key !== "total_sum")
      .map(([key, val]) => ({
        name: key.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        value: Number(val)
      }));

      transformedSaidaProportion.sort((a, b) => b.value - a.value) 

    //console.log(transformedSaidaProportion);
  } catch (error) {
    return <ErrorLoading />
  }

  //console.log(transformedSaidaProportion);

  return (
    <div className={`${className} flex flex-col lg:flex-row gap-4 w-full justify-between`}>
      <Line
        title="Evolução de gastos"
        description="Ao longo do mês atual"
        data={transformedData}
      />

      <Pie
        title="Gastos por categoria"
        description="Ao longo do mês atual"
        totalValue={Number(expense_proportion.total_sum)}
        data={transformedSaidaProportion}
      />

      <Radar
        title="Gastos por categoria"
        description="Ao longo do mês atual"
        totalValue={Number(expense_proportion.total_sum)}
        data={transformedSaidaProportion}
      />

      <TreeMap
        title="Gastos por categoria"
        description="Ao longo do mês atual"
        totalValue={Number(expense_proportion.total_sum)}
        data={transformedSaidaProportion}
      />

    </div>
  );
};

export default MonthlySaidas;
