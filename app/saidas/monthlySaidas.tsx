import React from "react";
import GenericLineChart from "./genericLineChart";
import { getMonthlySaidasEvolution, getSaidaProportion } from "@/lib/db";
import GenericPieChart from "./genericPieChart";

const MonthlySaidas = async () => {
  const data = await getMonthlySaidasEvolution();

  const transformedData = data.map((item) => ({
    ...item,
    valor_total: item.valor_total / 100,
  }));

  const saidaProportion = await getSaidaProportion();

  const transformedSaidaProportion = Object.entries(saidaProportion[0])
    .filter(([key]) => key !== "soma_total")
    .map(([key, val]) => ({
      type: key,
      value: Number(Number((val/100) / (saidaProportion[0].soma_total / 100) * 100).toFixed(2)),
    }));

  console.log(transformedSaidaProportion);

  return (
    <div className="flex gap-4 border-2 w-full justify-between">
      <GenericLineChart data={transformedData} />
      <GenericPieChart data={transformedSaidaProportion} />
    </div>
  );
};

export default MonthlySaidas;
