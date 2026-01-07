import Line from "@/components/charts/line";
import Pie from "@/components/charts/pie";
import Radar from "@/components/charts/radar";
import TreeMap from "@/components/charts/treemap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateBalancesSum } from "@/lib/utils";
import { Operation } from "@/lib/definitions";
import {
  calculateCumulativeExpenseEvolution,
  calculateExpenseEvolution,
  calculateOperationProportion,
  calculatePaymentMethodProportion,
} from "@/lib/operation";

interface Props {
  expenses: Operation[];
  className?: string;
}

const MonthlySaidas = async ({ expenses, className }: Props) => {

  const expense_proportion = calculateOperationProportion(expenses);
  const expense_proportion_total = calculateBalancesSum(expense_proportion);

  const payment_method_proportion = calculatePaymentMethodProportion(expenses);
  const payment_method_proportion_total = calculateBalancesSum(
    payment_method_proportion
  );

  return (
    <div className={`${className} flex flex-col gap-4 w-full justify-between`}>
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
        data={calculateCumulativeExpenseEvolution(expenses)}
      />
        </TabsContent>
        <TabsContent value="0">
          <Line
        title="Evolução de gastos"
        description="Ao longo do mês atual"
        chartColor="#FF5454"
        data={calculateExpenseEvolution(expenses)}
      />
        </TabsContent>
      </Tabs>
      

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Tabs defaultValue="pie">
          <TabsList>
            <TabsTrigger value="pie">Gráfico de Pizza</TabsTrigger>
            <TabsTrigger value="radar">Gráfico de Radar</TabsTrigger>
            <TabsTrigger value="tree">Gráfico de árvore</TabsTrigger>
          </TabsList>

          <TabsContent value="pie">
            <Pie
              title="Gastos por categoria"
              description="Ao longo do mês atual"
              totalValue={expense_proportion_total}
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
              totalValue={expense_proportion_total}
              data={expense_proportion}
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
              title="Gastos por método de pagamento"
              description="Ao longo do mês atual"
              totalValue={payment_method_proportion_total}
              data={payment_method_proportion}
            />
          </TabsContent>
          <TabsContent value="radar">
            <Radar
              title="Gastos por  método de pagamento"
              description="Ao longo do mês atual"
              data={payment_method_proportion}
            />
          </TabsContent>
          <TabsContent value="tree">
            <TreeMap
              title="Gastos por  método de pagamento"
              description="Ao longo do mês atual"
              totalValue={payment_method_proportion_total}
              data={payment_method_proportion}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MonthlySaidas;
