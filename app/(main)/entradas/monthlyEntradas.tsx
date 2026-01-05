import {
  getIncomesEvolution,
  getIncomesProportion,
} from "@/db/queries/incomes";
import Line from "@/components/charts/line";
import Pie from "@/components/charts/pie";
import ErrorLoading from "@/components/error/ErrorLoading";
import Radar from "@/components/charts/radar";
import TreeMap from "@/components/charts/treemap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateBalancesSum } from "@/lib/utils";
import { Operation } from "@/lib/definitions";
import {
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
  const income_evolution = calculateIncomeEvolution(incomes);

  return (
    <div
      className={`${className} flex flex-col lg:flex-row gap-4 w-full justify-between`}
    >
      <Line
        title="Evolução de entradas mensal"
        description="Ao longo do mês atual"
        data={income_evolution}
      />

      <Tabs defaultValue="pie" className="lg:w-1/2">
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
