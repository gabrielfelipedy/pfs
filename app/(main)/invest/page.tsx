import Line from "@/components/charts/line";
import ErrorLoading from "@/components/error/ErrorLoading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInvestments } from "@/db/queries/invest";
import { Operation, OperationArray } from "@/lib/definitions";
import {
  calculateCumulativeOperationEvolution,
  calculateOperationEvolution,
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

  const investmentsArray = new OperationArray(investments)

  const total = investmentsArray.calcSum()

  const cumulativeOperations = calculateCumulativeOperationEvolution(investments)

  const operations = calculateOperationEvolution(investments)

  return (
    <div>
      <p>Total investido: {formatter.format(total / 100)}</p>
      <p className="text-2xl font-medium">Metas de investimento</p>

      <p className="text-2xl font-medium">Histórico de investimentos</p>

      <Tabs defaultValue="1">
        <TabsList>
          <TabsTrigger value="1">Cumulativo</TabsTrigger>
          <TabsTrigger value="0">Não Cumulativo</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <Line
            title="Evolução dos investimentos"
            description="Ao longo do mês atual"
            data={cumulativeOperations}
          />
        </TabsContent>
        <TabsContent value="0">
          <Line
            title="Evolução dos investimentos"
            description="Ao longo do mês atual"
            data={operations}
          />
        </TabsContent>
      </Tabs>



      <p>renda fixa e renda variável</p>
    </div>
  );
};

export default page;