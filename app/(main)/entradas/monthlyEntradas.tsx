import { getIncomesEvolution, getIncomesProportion } from "@/db/queries/income";
import Line from "@/components/charts/line";
import Pie from "@/components/charts/pie";
import ErrorLoading from "@/components/error/ErrorLoading";
import Radar from "@/components/charts/radar";
import TreeMap from "@/components/charts/treemap";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { transformOperationsProportion } from "@/lib/utils";

interface Props {
  className?: string;
}

const MonthlyEntradas = async ({ className }: Props) => {
  let income_data;
  let income_proportion;

  try {
    const result_expenses = await getIncomesEvolution();
    income_data = result_expenses;

    const {
      rows: [saidaProportion],
    } = await getIncomesProportion();
    income_proportion = saidaProportion;
  } catch (error) {
    console.error(error);
    //console.log(income_proportion)
    return <ErrorLoading />;
  }

  const transformedData = income_data.map((item) => ({
    ...item,
    total_value: item.total_value / 100,
  }));

  const transformedIncomeProportion = transformOperationsProportion(income_proportion)

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
            totalValue={Number(income_proportion.total_sum)}
            data={transformedIncomeProportion}
          />
        </TabsContent>
        <TabsContent value="radar">
          <Radar
            title="Evolução de entradas mensal"
            description="Ao longo do mês atual"
            totalValue={Number(income_proportion.total_sum)}
            data={transformedIncomeProportion}
          />
        </TabsContent>

        <TabsContent value="tree">
          <TreeMap
            title="Evolução de entradas mensal"
            description="Ao longo do mês atual"
            totalValue={Number(income_proportion.total_sum)}
            data={transformedIncomeProportion}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonthlyEntradas;
