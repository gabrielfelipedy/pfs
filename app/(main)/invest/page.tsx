import Line from "@/components/charts/line";
import ErrorLoading from "@/components/error/ErrorLoading";
import { getInvestments } from "@/db/queries/invest";
import { Operation } from "@/lib/definitions";
import {
  calculateCumulativeOperationEvolution,
  calculateOperationEvolution,
  sumValuesOfOperations,
} from "@/lib/operation";
import { formatter } from "@/lib/utils";
import React from "react";

const page = async () => {
  let investments: Operation[];

  try {
    investments = await getInvestments();
  } catch (error) {
    return <ErrorLoading />;
  }

  const total = sumValuesOfOperations(investments);

  return (
    <div>
      <p>Total investido: {formatter.format(total / 100)}</p>
      <p className="text-2xl font-medium">Metas de investimento</p>

      <p className="text-2xl font-medium">Histórico de investimentos</p>

      <Line
        title="Evolução dos investimentos"
        description="Ao longo do mês atual"
        data={calculateCumulativeOperationEvolution(investments)}
      />

      <p>renda fixa e renda variável</p>
    </div>
  );
};

export default page;