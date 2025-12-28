"use client";

import React, { useEffect, useState } from "react";
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
}

const Line = ({ title, description, className, data }: Props) => {

  //console.log(data)
  const { theme, resolvedTheme } = useTheme()
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        setIsDark(resolvedTheme === 'dark' || theme === 'dark')
    }, [theme, resolvedTheme])

  const result = {
    date: data.map((item) =>
      new Date(item.date).toLocaleDateString("pt-BR", {
        month: "short",
        day: "numeric",
        timeZone: 'UTC'
      })
    ),
    total_value: data.map((item) => item.total_value),
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
        color: isDark ? "#ffffff" : "#333333"
      }
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    visualMap: {
        top: 50,
        right: 10,
        pieces: [
          {
            gt: 0,
            lte: 10000,
            color: '#54FF76'
          },
          {
            gt: -1000,
            lte: 0,
            color: '#FF5454'
          }
        ]
      },
    yAxis: {
      type: "value",
      splitLine: {
        show: false,
      },
      axisLabel: {
        // Formats the axis labels
        color: isDark ? "#ffffff" : "#333333",
        formatter: (value: number) => formatter.format(value),
      },
    },
    series: [
      {
        data: result.total_value,
        type: "line",
        smooth: true,
        areaStyle: {}
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
