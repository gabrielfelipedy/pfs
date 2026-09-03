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
  calculateCumulativeIncomeEvolution,
  calculateIncomeEvolution,
  calculateOperationProportion,
} from "@/lib/operation";

interface Props {
  incomes: Operation[];
  className?: string;
}

const MonthlyEntradas = ({ incomes, className }: Props) => {
  const [drill, setDrill] = useState<{ title: string; operations: Operation[] } | null>(null);
  const income_proportion = calculateOperationProportion(incomes);
  const total = calculateBalancesSum(income_proportion);

  const openCategoryDrill = (name: string | null) => {
    if (name === "Total") return;
    const key = name ?? "Sem categoria";
    setDrill({
      title: `Entradas em ${key}`,
      operations: incomes.filter(
        (op) => (op.category_name ?? "Sem categoria") === key
      ),
    });
  };

  return (
    <div
      className={`${className} grid grid-cols-1 lg:grid-cols-2 gap-4 w-full`}
    >
      <Tabs defaultValue="1">
        <TabsList>
          <TabsTrigger value="1">Cumulativo</TabsTrigger>
          <TabsTrigger value="0">Não Cumulativo</TabsTrigger>
        </TabsList>

        <TabsContent value="1">
          <Line
        title="Evolução de entradas mensal"
        description="Ao longo do mês atual"
        data={calculateCumulativeIncomeEvolution(incomes)}
      />
        </TabsContent>
        <TabsContent value="0">
          <Line
        title="Evolução de entradas mensal"
        description="Ao longo do mês atual"
        data={calculateIncomeEvolution(incomes)}
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
            title="Evolução de entradas mensal"
            description="Ao longo do mês atual"
            totalValue={total}
            data={income_proportion}
            onClick={openCategoryDrill}
          />
        </TabsContent>

        <TabsContent value="tree">
          <TreeMap
            title="Evolução de entradas mensal"
            description="Ao longo do mês atual"
            totalValue={total}
            data={income_proportion}
            onClick={openCategoryDrill}
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

export default MonthlyEntradas;
