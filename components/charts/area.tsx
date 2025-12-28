"use client";

import ReactCharts from "echarts-for-react";
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
  data: {
    day: string;
    total_income: number;
    total_expense: number;
    balance: number;
  }[];
}

const Area = ({ title, description, className, data }: Props) => {
  const days: string[] = [];
  const totalIncomes: number[] = [];
  const totalExpenses: number[] = [];
  const balances: number[] = [];

  data.forEach((item) => {
    days.push(
      new Date(item.day).toLocaleDateString("pt-BR", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      })
    );
    totalIncomes.push(item.total_income);
    totalExpenses.push(item.total_expense);
    balances.push(item.balance);
  });

  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || theme === "dark";

  const option = {
    tooltip: {
      trigger: "axis",
      valueFormatter: (value: number) => formatter.format(value),
    },
    xAxis: {
      type: "category",
      data: days,
      axisLabel: {
        color: isDark ? "#ffffff" : "#333333",
      },
    },
    legend: {
      data: [
        {
          name: "Entradas",
          textStyle: {
            color: isDark ? "#ffffff" : "#333333",
          },
          itemStyle: {
            color: "#54FF76", // Specifically sets the icon color
          },
          icon: "circle",
        },
        {
          name: "Gastos",
          textStyle: {
            color: isDark ? "#ffffff" : "#333333",
          },
          itemStyle: {
            color: "#FF5454",
          },
          icon: "circle",
        },
      ],
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    yAxis: {
      type: "value",
      show: true,
      splitLine: {
        show: false,
      },

      axisLabel: {
        color: isDark ? "#ffffff" : "#333333",
        // format value as currency
        formatter: (value: number) => formatter.format(value),
      },
    },
    series: [
      {
        name: "Entradas",
        data: totalIncomes,
        type: "line",
        color: "#54FF76",
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 0, // This removes the line
        },
        areaStyle: {
          opacity: 0.6,
        },
      },
      {
        name: "Gastos",
        data: totalExpenses,
        type: "line",
        color: "#FF5454",
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 0, // This removes the line
        },
        areaStyle: {
          opacity: 0.6,
        },
      } /* ,
      {
        data: balances,
        type: "line",
        smooth: true,
        areaStyle: {},
      }, */,
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
