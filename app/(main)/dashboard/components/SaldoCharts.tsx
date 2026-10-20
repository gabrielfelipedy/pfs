"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Line from "@/components/charts/line";
import Area from "@/components/charts/area";
import Bar from "@/components/charts/bar";
import { Operation } from "@/lib/definitions";
import { isAtualOperation, calculateBalanceEvolution, calculateIncomesAndExpensesEvolution } from "@/lib/operation";
import { filterOperationsByMonthCharts } from "@/lib/date";

interface Props {
  operations: Operation[];
  month: string;
  paidOnly?: boolean;
  className?: string;
}

export default function SaldoCharts({ operations, month, paidOnly = false, className }: Props) {
  const monthOperations = filterOperationsByMonthCharts(operations, month).filter(
    (op) => !paidOnly || isAtualOperation(op, month)
  );

  const balanceEvolution = calculateBalanceEvolution([...monthOperations]);
  const comparison = calculateIncomesAndExpensesEvolution([...monthOperations]);

  return (
    <div className={`${className} flex flex-col gap-5`}>
      <Tabs defaultValue="area">
        <TabsList>
          <TabsTrigger value="area">Gráfico de Área</TabsTrigger>
          <TabsTrigger value="line">Gráfico de Linha</TabsTrigger>
        </TabsList>
        <TabsContent value="area">
          <Line
            variant="area"
            title="Evolução do saldo"
            description="Ao longo do mês atual"
            data={balanceEvolution}
          />
        </TabsContent>
        <TabsContent value="line">
          <Line
            variant="line"
            title="Evolução do saldo"
            description="Ao longo do mês atual"
            data={balanceEvolution}
          />
        </TabsContent>
      </Tabs>

      <Tabs defaultValue="area">
        <TabsList>
          <TabsTrigger value="area">Gráfico de Área</TabsTrigger>
          <TabsTrigger value="bar">Gráfico de Barra</TabsTrigger>
        </TabsList>
        <TabsContent value="area">
          <Area
            title="Comparação de entradas e saídas"
            description="Ao longo do mês atual"
            data={comparison}
          />
        </TabsContent>
        <TabsContent value="bar">
          <Bar
            title="Comparação de entradas e saídas"
            description="Ao longo do mês atual"
            data={comparison}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
