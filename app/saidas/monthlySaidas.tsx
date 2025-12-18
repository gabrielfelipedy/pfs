import React from "react";
import GenericLineChart from "./genericLineChart";

import GenericPieChart from "./genericPieChart";
import { getExpensesEvolution, getExpensesProportion } from "@/db/queries/expense";
import { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  total_contas: {
    label: "Contas",
    color: "var(--chart-1)",
  },
  total_investimentos: {
    label: "Investimentos",
    color: "var(--chart-2)",
  },
  total_educacao: {
    label: "Educação",
    color: "var(--chart-3)",
  },
  total_mercado: {
    label: "Mercado",
    color: "var(--chart-4)",
  },
  total_assinaturas: {
    label: "Assinaturas",
    color: "var(--chart-5)",
  },
  total_lanches: {
    label: "Comida",
    color: "var(--chart-6)",
  },
  total_transporte: {
    label: "Transporte",
    color: "var(--chart-8)",
  },
  total_uncategorized: {
    label: "Não categorizado",
    color: "var(--chart-7)",
  },
} satisfies ChartConfig;

const MonthlySaidas = async () => {

  let expense_data;
  let expense_proportion;
 try {
  const data = await getExpensesEvolution()
  //console.log(data)
  expense_data = data

  const {rows: [saidaProportion]} = await getExpensesProportion();
  expense_proportion = saidaProportion
  //console.log(saidaProportion)

  }
  catch (error) {
    console.error(error)
   return <div className="p-4 text-red-500">Erro ao carregar dados.</div>;
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
      type: key,
      value: Number(
        Number(
          (Number(val) / 100 / (Number(expense_proportion.total_sum) / 100)) * 100
        ).toFixed(2)
      ),
    }));

    console.log(transformedSaidaProportion)
  }
  catch(error)
  {
    return <div className="p-4 text-red-500">Erro ao processar dados.</div>; 
  }
  

  //console.log(transformedSaidaProportion);

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full justify-between">
      <GenericLineChart title="Evolução de gastos" description="Evolução"  data={transformedData} />
      <GenericPieChart 
      
      title="Evolução dos gastos"
      description="No período de um mês"
      data={transformedSaidaProportion}
      config={chartConfig}
      />
    </div>
  );
};

export default MonthlySaidas;
