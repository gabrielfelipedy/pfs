"use client";

import { Pie, PieChart, Cell } from "recharts";

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
  ChartLegend,
  type ChartConfig,
  ChartLegendContent,
} from "@/components/ui/chart";
import { DataProportion } from "@/lib/definitions";

export const description = "A simple pie chart";

interface Props {
  title: string;
  description: string;
  data: DataProportion[];
  config: ChartConfig;
}

export default function GenericPieChart({ title, description, data, config }: Props) {
  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto w-full max-h-125"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div>
                      <span className="text-muted-foreground">
                        {config[name as keyof typeof config]?.label ||
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
                    config[entry.type as keyof typeof config]
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