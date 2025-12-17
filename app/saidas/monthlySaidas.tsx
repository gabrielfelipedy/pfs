import React from "react";
import GenericLineChart from "./genericLineChart";
import { getMonthlySaidasEvolution } from "@/lib/db";
import { formatter } from "@/lib/utils";

const MonthlySaidas = async () => {
  const data = await getMonthlySaidasEvolution();

  const transformedData = data.map((item) => ({
    ...item,
    valor_total: item.valor_total / 100,
  }));

  return (
    <div className="w-full">
      <GenericLineChart data={transformedData} />
    </div>
  );
};

export default MonthlySaidas;
