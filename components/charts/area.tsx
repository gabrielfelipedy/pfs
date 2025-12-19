"use client";

import React from "react";
import ReactCharts from "echarts-for-react";
import { ChartData, DataProportion } from "@/lib/definitions";
import { formatter } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface Props {
  title: string;
  description: string;
  className?: string;
  data: {
    expense: ChartData[],
    income: ChartData[] ;
  }
}

const Area = ({ title, description, className, data }: Props) => {

   const result = {
    date: data.expense.map((item) =>
      new Date(item.date).toLocaleDateString("pt-BR", {
        month: "short",
        day: "numeric",
        timeZone: 'UTC'
      })
    ),
    total_value: data.expense.map((item) => item.total_value),
  };

  const result2 = {
    date: data.income.map((item) =>
      new Date(item.date).toLocaleDateString("pt-BR", {
        month: "short",
        day: "numeric",
        timeZone: 'UTC'
      })
    ),
    total_value: data.income.map((item) => item.total_value),
  };
  

  const option = {
      tooltip: {
        trigger: "axis",
        valueFormatter: (value: number) => formatter.format(value),
      },
      xAxis: {
        type: "category",
        data: result.date,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      yAxis: {
        type: "value",
        splitLine: {
          show: false,
        },
        axisLabel: {
          // Formats the axis labels
          formatter: (value: number) => formatter.format(value),
        },
      },
      series: [
        {
          data: result.total_value,
          type: "line",
          smooth: true,
          areaStyle: {},
        },
        {
          data: result2.total_value,
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
        <ReactCharts
          option={option}
          style={{ height: "300px", width: "100%" }}
        />
      </CardContent>
    </Card>
  );
};

export default Area;
