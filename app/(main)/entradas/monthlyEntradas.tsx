import Line from "@/components/charts/line";
import Pie from "@/components/charts/pie";
import Radar from "@/components/charts/radar";
import TreeMap from "@/components/charts/treemap";
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

const MonthlyEntradas = async ({ incomes, className }: Props) => {
  const income_proportion = calculateOperationProportion(incomes);
  const total = calculateBalancesSum(income_proportion);

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
          <TabsTrigger value="radar">Gráfico de Radar</TabsTrigger>
          <TabsTrigger value="tree">Gráfico de árvore</TabsTrigger>
        </TabsList>
        <TabsContent value="pie">
          <Pie
            title="Evolução de entradas mensal"
            description="Ao longo do mês atual"
            totalValue={total}
            data={income_proportion}
          />
        </TabsContent>
        <TabsContent value="radar">
          <Radar
            title="Evolução de entradas mensal"
            description="Ao longo do mês atual"
            data={income_proportion}
          />
        </TabsContent>

        <TabsContent value="tree">
          <TreeMap
            title="Evolução de entradas mensal"
            description="Ao longo do mês atual"
            totalValue={total}
            data={income_proportion}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonthlyEntradas;
