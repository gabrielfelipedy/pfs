"use client";

import ReactCharts from "echarts-for-react";
import { ChartData } from "@/lib/definitions";
import { formatter } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useTheme } from "next-themes";

interface Props {
  title: string;
  description: string;
  className?: string;
  data: ChartData[];
  chartColor?: string;
}

const Line = ({ title, description, className, data, chartColor }: Props) => {
  //console.log(data)
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || theme === "dark";

  const result = {
    date: data.map((item) =>
      new Date(item.date).toLocaleDateString("pt-BR", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      })
    ),
    total_value: data.map((item) => item.value),
  };
  //console.log(result);

  const option = {
    tooltip: {
      trigger: "axis",
      valueFormatter: (value: number) => formatter.format(value),
    },
    xAxis: {
      type: "category",
      data: result.date,
      axisLabel: {
        color: isDark ? "#ffffff" : "#333333",
      },
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    visualMap: {
      show: false,
      top: 50,
      right: 10,
      pieces: [
        {
          gt: 0,
          lte: 9999999,
          color: chartColor ?? "#54FF76",
        },
        {
          gt: -9999999,
          lte: 0,
          color: chartColor ?? "#FF5454",
        },
      ],
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false
      },
    },
    series: [
      {
        data: result.total_value,
        type: "line",
        smooth: true,
        areaStyle: {},
      },
    ],
  };

  return (
    <Card className={`${className} w-full`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ReactCharts option={option} />
      </CardContent>
    </Card>
  );
};

export default Line;
