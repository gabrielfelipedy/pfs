"use client"

import { useState } from "react";
import Line from "@/components/charts/line";
import Pie from "@/components/charts/pie";
import TreeMap from "@/components/charts/treemap";
import OperationsListDialog from "@/components/operations/OperationsListDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateBalancesSum } from "@/lib/utils";
import { ChartData, Operation } from "@/lib/definitions";
import { operationValue } from "@/lib/parcelamento";
import { isAtualOperation } from "@/lib/operation";
import {
  calculateOperationProportion,
  calculatePaymentMethodProportion,
} from "@/lib/operation";

const calculateExpenseEvolution = (operations: Operation[]) => {
  //console.log(operations)

  const expenseMap = new Map<string, ChartData>();

  operations.forEach((operation) => {
    const date = new Date(operation.date ?? "");
    const key = date.toISOString().split("T")[0];

    const current_value = expenseMap.get(key) ?? { date: key, value: 0 };
    const value = operationValue(operation);

    if (!operation.is_income) {
      expenseMap.set(key, {
        date: key,
        value: current_value.value + value / 100,
      });
    }
  });

  //console.log(Array.from(expenseMap.values()));
  return Array.from(expenseMap.values());
};

const calculateCumulativeExpenseEvolution = (operations: Operation[]): ChartData[] => {
  //console.log(operations)

  const expenseMap = new Map<string, ChartData>();
  let total = 0;

  operations.forEach((operation) => {
    if (operation.is_income) return;

    const date = new Date(operation.date ?? "");
    const key = date.toISOString().split("T")[0];
    // const current_value = expenseMap.get(key) ?? { date: key, value: 0 };
    const value = operationValue(operation);

    total += value / 100;

    expenseMap.set(key, {
      date: key,
      value: total,
    });
  });

  return Array.from(expenseMap.values());
}

interface Props {
  expenses: Operation[];
  className?: string;
  month: string;
  paidOnly?: boolean;
}

export default function MonthlySaidas  ({ expenses, className, month, paidOnly = false }: Props)  {

  const [drill, setDrill] = useState<{ title: string; operations: Operation[] } | null>(null);

  const chartOperations = expenses.filter(
    (op) => !paidOnly || isAtualOperation(op, month)
  );

  // FOR BAR CHARTS
  const expense_proportion = calculateOperationProportion(chartOperations);
  const expense_proportion_total = calculateBalancesSum(expense_proportion);

  const payment_method_proportion = calculatePaymentMethodProportion(chartOperations);
  const payment_method_proportion_total = calculateBalancesSum(
    payment_method_proportion
  );


  const expense_evolution = calculateExpenseEvolution(chartOperations)
  const cumulative_expense_evolution = calculateCumulativeExpenseEvolution(chartOperations)

  const openCategoryDrill = (name: string | null) => {
    if (name === "Total") return;
    const key = name ?? "Sem categoria";
    setDrill({
      title: `Gastos em ${key}`,
      operations: chartOperations.filter(
        (op) => (op.category_name ?? "Sem categoria") === key
      ),
    });
  };

  const openPaymentMethodDrill = (name: string | null) => {
    if (name === "Total") return;
    const key = name ?? "Sem método de pagamento";
    setDrill({
      title: `Gastos por ${key}`,
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
              title="Gastos por categoria"
              description="Ao longo do mês atual"
              totalValue={expense_proportion_total}
              data={expense_proportion}
              onClick={openCategoryDrill}
            />
          </TabsContent>
          <TabsContent value="tree">
            <TreeMap
              title="Gastos por categoria"
              description="Ao longo do mês atual"
              totalValue={expense_proportion_total}
              data={expense_proportion}
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
              title="Gastos por método de pagamento"
              description="Ao longo do mês atual"
              totalValue={payment_method_proportion_total}
              data={payment_method_proportion}
              onClick={openPaymentMethodDrill}
            />
          </TabsContent>
          <TabsContent value="tree">
            <TreeMap
              title="Gastos por  método de pagamento"
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
        title="Evolução de gastos"
        description="Ao longo do mês atual"
        chartColor="#FF5454"
        data={cumulative_expense_evolution}
      />
        </TabsContent>
        <TabsContent value="0">
          <Line
        title="Evolução de gastos"
        description="Ao longo do mês atual"
        chartColor="#FF5454"
        data={expense_evolution}
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