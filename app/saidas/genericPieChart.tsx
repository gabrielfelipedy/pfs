"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  type ChartConfig,
  ChartLegendContent,
} from "@/components/ui/chart";
import { DataProportion } from "@/lib/db";

export const description = "A simple pie chart";

const chartConfig = {
  total_contas: {
    label: "Contas",
    color: "var(--chart-1)",
  },
  total_investimentos: {
    label: "Investimentos",
    color: "var(--chart-2)",
  },
  total_educacao: {
    label: "Educação",
    color: "var(--chart-3)",
  },
  total_mercado: {
    label: "Mercado",
    color: "var(--chart-4)",
  },
  total_assinaturas: {
    label: "Assinaturas",
    color: "var(--chart-5)",
  },
  total_lanches: {
    label: "Comida",
    color: "var(--chart-6)",
  },
  total_sem_categoria: {
    label: "Não categorizado",
    color: "var(--chart-7)",
  },
  total_transporte: {
    label: "Transporte",
    color: "var(--chart-8)",
  },
} satisfies ChartConfig;

interface Props {
  data: DataProportion[];
}

export default function GenericPieChart({ data }: Props) {
  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Proporção de gastos</CardTitle>
        <CardDescription>Período atual</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full max-h-[500px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div>
                      <span className="text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig]?.label ||
                          name}
                        :
                      </span>
                      <span className="font-mono font-medium tabular-nums text-foreground">
                        {value} %
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Pie data={data} dataKey="value" nameKey="type">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    chartConfig[entry.type as keyof typeof chartConfig]
                      ?.color || "var(--chart-1)"
                  }
                />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="type" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}