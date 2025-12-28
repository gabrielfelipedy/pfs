"use client";

import ReactCharts from "echarts-for-react";
import { OperationBalance } from "@/lib/definitions";
import { formatter } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";


interface Props {
  title: string;
  description: string;
  className?: string;
  totalValue: number;
  data: OperationBalance[];
}

const Pie = ({ title, description, className, totalValue, data }: Props) => {

  const { theme, resolvedTheme } = useTheme()
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        setIsDark(resolvedTheme === 'dark' || theme === 'dark')
    }, [theme, resolvedTheme])

  const option = {
    tooltip: {
      trigger: "item",
      valueFormatter: (value: number) => formatter.format(value / 100),
    },
    legend: {
      bottom: "bottom",
      left: "center",
      textStyle: {
      color: isDark ? "#ffffff" : "#333333",
    },
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    series: [
      {
        type: "pie",
        radius: ["60%", "100%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
          alignTo: "none",
          overflow: "breakAll",
          formatter: (data: OperationBalance) =>
            `${((data.value / totalValue) * 100).toFixed(2)} %`,
        },
        emphasis: {
          scale: false,
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
            textBorderWidth: 0, 
          color: isDark ? "#ffffff" : "#333333",
            formatter: (data: OperationBalance) =>
              `${((data.value / totalValue) * 100).toFixed(2)} %`,
          },
        },
        data: data,
        startAngle: 185,
        endAngle: 355,
      },
    ],
  };

  //console.log(totalValue)
  //console.log(data)

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

export default Pie;
