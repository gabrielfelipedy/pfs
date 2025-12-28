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

interface Props {
  className?: string;
}

const MonthlyEntradas = async ({ className }: Props) => {
  let income_data;
  let raw_income_proportion;

  try {
    income_data = await getIncomesEvolution();
    raw_income_proportion = await getIncomesProportion();
  } catch (error) {
    console.error(error);
    //console.log(income_proportion)
    return <ErrorLoading />;
  }

  const transformedData = income_data.map((item) => ({
    ...item,
    total_value: item.total_value / 100,
  }));

  const income_proportion = raw_income_proportion.map((item) => ({
    name: (item.category_name as string) ?? "Sem categoria",
    value: Number(item.total),
  }));
  income_proportion.sort((a, b) => b.value - a.value);

  return (
    <div
      className={`${className} flex flex-col lg:flex-row gap-4 w-full justify-between`}
    >
      <Line
        title="Evolução de entradas mensal"
        description="Ao longo do mês atual"
        data={transformedData}
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
            totalValue={calculateBalancesSum(income_proportion)}
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
            totalValue={calculateBalancesSum(income_proportion)}
            data={income_proportion}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonthlyEntradas;
