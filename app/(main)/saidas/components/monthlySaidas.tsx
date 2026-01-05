import Line from "@/components/charts/line";
import Pie from "@/components/charts/pie";
import Radar from "@/components/charts/radar";
import TreeMap from "@/components/charts/treemap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateBalancesSum } from "@/lib/utils";
import { Operation } from "@/lib/definitions";
import { calculateExpenseEvolution, calculateOperationProportion } from "@/lib/operation";

interface Props {
  expenses: Operation[];
  className?: string;
}

const MonthlySaidas = async ({ expenses, className }: Props) => {
  const expense_proportion = calculateOperationProportion(expenses);
    const total = calculateBalancesSum(expense_proportion);
    const expense_evolution = calculateExpenseEvolution(expenses);

  return (
    <div
      className={`${className} flex flex-col lg:flex-row gap-4 w-full justify-between`}
    >
      <Line
        title="Evolução de gastos"
        description="Ao longo do mês atual"
        data={expense_evolution}
      />

      <Tabs defaultValue="pie" className="lg:w-1/2">
        <TabsList>
          <TabsTrigger value="pie">Gráfico de Pizza</TabsTrigger>
          <TabsTrigger value="radar">Gráfico de Radar</TabsTrigger>
          <TabsTrigger value="tree">Gráfico de árvore</TabsTrigger>
        </TabsList>

        <TabsContent value="pie">
          <Pie
            title="Gastos por categoria"
            description="Ao longo do mês atual"
            totalValue={total}
            data={expense_proportion}
          />
        </TabsContent>
        <TabsContent value="radar">
          <Radar
            title="Gastos por categoria"
            description="Ao longo do mês atual"
            data={expense_proportion}
          />
        </TabsContent>
        <TabsContent value="tree">
          <TreeMap
            title="Gastos por categoria"
            description="Ao longo do mês atual"
            totalValue={total}
            data={expense_proportion}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonthlySaidas;
