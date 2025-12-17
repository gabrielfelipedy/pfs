"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

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
  type ChartConfig,
} from "@/components/ui/chart";
import { ChartData } from "@/lib/db";
import { formatter } from "@/lib/utils";

export const description = "A line chart with a label";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  valor_total: {
    label: "Valor Total",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface Props {
  data: ChartData[];
}

export default function GenericLineChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução dos gastos do mês</CardTitle>
        <CardDescription>Período atual</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dia"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line"
                
                
                formatter={(value, name) => (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig]?.label || name}:
                      </span>
                      <span className="font-mono font-medium tabular-nums text-foreground">
                        {formatter.format(Number(value))}
                      </span>
                    </div>
                  )}
                />}
            />
          
            <Line
              dataKey="valor_total"
              type="natural"
              stroke="var(--color-valor_total)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-valor_total)",
              }}
              activeDot={{
                r: 6,
              }}
            ></Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Veja a análise <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Realizar análise
        </div>
      </CardFooter>
    </Card>
  );
}
