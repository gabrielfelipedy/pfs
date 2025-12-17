import React from "react";
import GenericLineChart from "./genericLineChart";
import {
  getEntradasProportion,
  getMonthlyEntradasEvolution
} from "@/lib/db";
import GenericPieChart from "./genericPieChart";
import { DataProportion } from "@/lib/definitions";

const MonthlyEntradas = async () => {
  const data = await getMonthlyEntradasEvolution();

  const transformedData = data.map((item) => ({
    ...item,
    valor_total: item.valor_total / 100,
  }));

  let transformedSaidaProportion: DataProportion[] = [];

  try {

  const saidaProportion = await getEntradasProportion();

  transformedSaidaProportion = Object.entries(saidaProportion[0])
    .filter(([key]) => key !== "soma_total")
    .map(([key, val]) => ({
      type: key,
      value: Number(
        Number(
          (val / 100 / (saidaProportion[0].soma_total / 100)) * 100
        ).toFixed(2)
      ),
    }));
  }
  catch (error) {
    console.error("Error fetching saida proportion:", error);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full justify-between">
      <GenericLineChart title="Evolução de entradas"
      description="Evolução dos meus ganhos ao longo do mês" 
      data={transformedData} />
      <GenericPieChart data={transformedSaidaProportion} />
    </div>
  );
};

export default MonthlyEntradas;