"use client";

import ReactCharts from "echarts-for-react";
import { ChartData } from "@/lib/definitions";
import { formatter } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useTheme } from "next-themes";
import { useMemo } from "react";

interface Props {
  title: string;
  description: string;
  className?: string;
  data: ChartData[];
}

const Heatmap = ({ title, description, className, data }: Props) => {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || theme === "dark";

  const { startStr, endStr, maxValue } = useMemo(() => {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const start = new Date(end);
    start.setFullYear(start.getFullYear() - 1);
    start.setDate(start.getDate() + 1);

    const max = data.reduce((m, d) => Math.max(m, d.value), 0);

    return {
      startStr: start.toISOString().split("T")[0],
      endStr: end.toISOString().split("T")[0],
      maxValue: max,
    };
  }, [data]);

  const calendarData = useMemo(() => {
    return data.filter((d) => d.value > 0).map((d) => [d.date, d.value]);
  }, [data]);

  const backgroundColor = isDark ? "#25252b" : "#f0f0f0";
  const borderColor = isDark ? "#17171b" : "#ffffff";
  const textColor = isDark ? "#ffffee" : "#333333";
  const splitLineColor = isDark ? "#17171b" : "#ffffff";

  const option = {
    tooltip: {
      formatter: (params: { value: [string, number] }) => {
        const [date, value] = params.value;
        const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("pt-BR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        return `<strong>${formattedDate}</strong><br/>Gastos: ${formatter.format(value)}`;
      },
    },
    visualMap: {
      show: false,
      min: 1,
      max: maxValue || 1,
      inRange: {
        color: isDark
          ? ["#2b1020", "#7a1a1a", "#b53030", "#e83030", "#ff4040"]
          : ["#fee2e2", "#f5a3a3", "#e84040", "#c02020", "#a01010"],
      },
    },
    calendar: {
      top: 40,
      left: 40,
      right: 20,
      bottom: 10,
      cellSize: ["auto", 12],
      range: [startStr, endStr],
      itemStyle: {
        borderWidth: 3,
        borderColor: borderColor,
        color: backgroundColor,
      },
      yearLabel: { show: false },
      monthLabel: {
        color: textColor,
        fontSize: 12,
        nameMap: "pt-br",
      },
      dayLabel: {
        color: textColor,
        fontSize: 11,
        nameMap: "pt-br",
        firstDay: 0,
      },
      splitLine: {
        lineStyle: {
          color: splitLineColor,
        },
      },
    },
    series: [
      {
        type: "heatmap",
        coordinateSystem: "calendar",
        calendarIndex: 0,
        data: calendarData,
        emphasis: {
          itemStyle: {
            borderColor: textColor,
            borderWidth: 1,
          },
        },
      },
    ],
  };

  return (
    <Card className={`${className} w-full pb-6`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ReactCharts option={option} style={{ height: 180 }} />
      </CardContent>
    </Card>
  );
};

export default Heatmap;
