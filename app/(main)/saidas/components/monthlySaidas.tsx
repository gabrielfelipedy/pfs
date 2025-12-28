import {
  getExpensesEvolution,
  getExpensesProportion
} from "@/db/queries/expense";

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

const MonthlySaidas = async ({ className }: Props) => {
  let expense_data;
  let raw_expense_proportion;
  try {
    expense_data = await getExpensesEvolution();
    raw_expense_proportion = await getExpensesProportion();
  } catch (error) {
    console.error(error);
    return <ErrorLoading />;
  }

  const transformedData = expense_data.map((item) => ({
    ...item,
    total_value: item.total_value / 100,
  }));
  //console.log(transformedData)

  const expense_proportion = raw_expense_proportion.map((item) => ({
    name: (item.category_name as string) ?? "Sem categoria",
    value: Number(item.total),
  }));
  expense_proportion.sort((a, b) => b.value - a.value);
  //console.log(expense_proportion)

  return (
    <div
      className={`${className} flex flex-col lg:flex-row gap-4 w-full justify-between`}
    >
      <Line
        title="Evolução de gastos"
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
            title="Gastos por categoria"
            description="Ao longo do mês atual"
            totalValue={calculateBalancesSum(expense_proportion)}
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
            totalValue={calculateBalancesSum(expense_proportion)}
            data={expense_proportion}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonthlySaidas;
