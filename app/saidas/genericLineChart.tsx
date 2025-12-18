"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { formatter } from "@/lib/utils";
import { ChartData } from "@/lib/definitions";

export const description = "A line chart with a label";


const chartConfig = {
  total_value: {
    label: "Valor",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface Props {
  title: string;
  description: string;
  data: ChartData[];
}

export default function GenericLineChart({ title, description, data }: Props) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
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
              dataKey="date"
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
              dataKey="total_value"
              type="natural"
              stroke="var(--color-total_value)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-total_value)",
              }}
              activeDot={{
                r: 6,
              }}
            ></Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
