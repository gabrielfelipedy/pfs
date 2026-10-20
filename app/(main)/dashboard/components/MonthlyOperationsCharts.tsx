"use client"

import { useState } from "react";
import Line from "@/components/charts/line";
import Pie from "@/components/charts/pie";
import TreeMap from "@/components/charts/treemap";
import OperationsListDialog from "@/components/operations/OperationsListDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateBalancesSum } from "@/lib/utils";
import { Operation } from "@/lib/definitions";
import {
  isAtualOperation,
  calculateOperationProportion,
  calculatePaymentMethodProportion,
  calculateDailyEvolution,
  calculateCumulativeDailyEvolution,
} from "@/lib/operation";
import { OperationTabConfig } from "./tabConfig";

interface Props {
  operations: Operation[];
  className?: string;
  month: string;
  paidOnly?: boolean;
  config: OperationTabConfig;
}

export default function MonthlyOperationsCharts({ operations, className, month, paidOnly = false, config }: Props) {

  const [drill, setDrill] = useState<{ title: string; operations: Operation[] } | null>(null);

  const chartOperations = operations.filter(
    (op) => !paidOnly || isAtualOperation(op, month)
  );

  const operation_proportion = calculateOperationProportion([...chartOperations]);
  const operation_proportion_total = calculateBalancesSum(operation_proportion);

  const payment_method_proportion = calculatePaymentMethodProportion([...chartOperations]);
  const payment_method_proportion_total = calculateBalancesSum(
    payment_method_proportion
  );

  const evolution = calculateDailyEvolution(chartOperations);
  const cumulative_evolution = calculateCumulativeDailyEvolution(chartOperations);

  const openCategoryDrill = (name: string | null) => {
    if (name === "Total") return;
    const key = name ?? "Sem categoria";
    setDrill({
      title: `${config.charts.categoryDrillPrefix} ${key}`,
      operations: chartOperations.filter(
        (op) => (op.category_name ?? "Sem categoria") === key
      ),
    });
  };

  const openPaymentMethodDrill = (name: string | null) => {
    if (name === "Total") return;
    const key = name ?? "Sem método de pagamento";
    setDrill({
      title: `${config.charts.paymentMethodDrillPrefix} ${key}`,
      operations: chartOperations.filter(
        (op) => (op.payment_method_name ?? "Sem método de pagamento") === key
      ),
    });
  };

  return (
    <div className={`${className} flex flex-col gap-4 w-full justify-between`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Tabs defaultValue="pie">
          <TabsList>
            <TabsTrigger value="pie">Gráfico de Pizza</TabsTrigger>
            <TabsTrigger value="tree">Gráfico de árvore</TabsTrigger>
          </TabsList>

          <TabsContent value="pie">
            <Pie
              title={config.charts.categoryTitle}
              description="Ao longo do mês atual"
              totalValue={operation_proportion_total}
              data={operation_proportion}
              onClick={openCategoryDrill}
            />
          </TabsContent>
          <TabsContent value="tree">
            <TreeMap
              title={config.charts.categoryTitle}
              description="Ao longo do mês atual"
              totalValue={operation_proportion_total}
              data={operation_proportion}
              onClick={openCategoryDrill}
            />
          </TabsContent>
        </Tabs>

        <Tabs defaultValue="pie">
          <TabsList>
            <TabsTrigger value="pie">Gráfico de Pizza</TabsTrigger>
            <TabsTrigger value="tree">Gráfico de árvore</TabsTrigger>
          </TabsList>

          <TabsContent value="pie">
            <Pie
              title={config.charts.paymentMethodTitle}
              description="Ao longo do mês atual"
              totalValue={payment_method_proportion_total}
              data={payment_method_proportion}
              onClick={openPaymentMethodDrill}
            />
          </TabsContent>
          <TabsContent value="tree">
            <TreeMap
              title={config.charts.paymentMethodTitle}
              description="Ao longo do mês atual"
              totalValue={payment_method_proportion_total}
              data={payment_method_proportion}
              onClick={openPaymentMethodDrill}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Tabs defaultValue="1">
        <TabsList>
          <TabsTrigger value="1">Cumulativo</TabsTrigger>
          <TabsTrigger value="0">Não Cumulativo</TabsTrigger>
        </TabsList>

        <TabsContent value="1">
          <Line
            title={config.charts.evolutionTitle}
            description="Ao longo do mês atual"
            chartColor={config.charts.lineChartColor}
            data={cumulative_evolution}
          />
        </TabsContent>
        <TabsContent value="0">
          <Line
            title={config.charts.evolutionTitle}
            description="Ao longo do mês atual"
            chartColor={config.charts.lineChartColor}
            data={evolution}
          />
        </TabsContent>
      </Tabs>

      <OperationsListDialog
        open={!!drill}
        onOpenChange={(open) => !open && setDrill(null)}
        title={drill?.title ?? ""}
        operations={drill?.operations ?? []}
      />
    </div>
  );
};
