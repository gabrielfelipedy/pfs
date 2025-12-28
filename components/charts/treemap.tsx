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
import { OperationBalance } from "@/lib/definitions";

interface Props {
  title: string;
  description: string;
  className?: string;
  totalValue: number;
  data: OperationBalance[];
}

const TreeMap = ({ title, description, className, totalValue, data }: Props) => {

  const result = {
    name: data.map((item) =>  item.name),
    value: data.map((item) => item.value/100),
  };
  
  console.log(result);

  const obj = data.map((item) => ({
    name: item.name,
    max: Math.max(...result.value)
  }))

  console.log(obj)

  const option = {
    tooltip: {
      valueFormatter: (value: number) => formatter.format(value/100),
    },
  series: [
    {
      type: 'treemap',
      data: [
        {
          name: 'Total',
          value: totalValue,
          children: data
        },
      ]
    }
  ]
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

export default TreeMap;
