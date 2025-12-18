import React from "react";
import GenericLineChart from "./genericLineChart";
import { getEntradasProportion, getMonthlyEntradasEvolution } from "@/lib/db";
import GenericPieChart from "./genericPieChart";
import { DataProportion } from "@/lib/definitions";

const MonthlyEntradas = async () => {
  let expense_data;
  let expense_proportion;

  try {
    const result_expenses = await getMonthlyEntradasEvolution();
    expense_data = result_expenses;

    const saidaProportion = await getEntradasProportion();
    expense_proportion = saidaProportion;
  } catch (error) {
    return <div className="p-4 text-red-500">Erro ao carregar dados.</div>;
  }

  const transformedData = expense_data.map((item) => ({
    ...item,
    valor_total: item.valor_total / 100,
  }));

  let transformedSaidaProportion: DataProportion[] = [];

  transformedSaidaProportion = Object.entries(expense_proportion[0])
    .filter(([key]) => key !== "soma_total")
    .map(([key, val]) => ({
      type: key,
      value: Number(
        Number(
          (val / 100 / (expense_proportion[0].soma_total / 100)) * 100
        ).toFixed(2)
      ),
    }));

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full justify-between">
      <GenericLineChart
        title="Evolução de entradas"
        description="Evolução dos meus ganhos ao longo do mês"
        data={transformedData}
      />
      <GenericPieChart data={transformedSaidaProportion} />
    </div>
  );
};

export default MonthlyEntradas;