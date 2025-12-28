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
  data: OperationBalance[];
}

const Radar = ({ title, description, className, data }: Props) => {

  const result = {
    name: data.map((item) =>  item.name),
    value: data.map((item) => item.value),
  };
  
  console.log(result);

  const obj = data.map((item) => ({
    name: item.name,
    max: Math.max(...result.value)
  }))

  console.log(obj)

  const option = {
    tooltip: {
    trigger: 'item',
    valueFormatter: (value: number) => formatter.format(value/100),
      
  },
    radar: {
      // shape: 'circle',
      indicator: obj
    },
    series: [
      {
        name: "Budget vs spending",
        type: "radar",
        data: [
          {
            value: result.value,
            name: 'Teste'
          }
        ],
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
        <ReactCharts
          option={option}
          style={{ height: "300px", width: "100%" }}
        />
      </CardContent>
    </Card>
  );
};

export default Radar;
