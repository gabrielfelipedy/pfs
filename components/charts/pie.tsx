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
  totalValue: number;
  data: DataProportion[];
}

const Pie = ({ title, description, totalValue, data }: Props) => {
  
  const option = {
  tooltip: {
    trigger: 'item',
    valueFormatter: (value: number) => formatter.format(value/100)
  },
  legend: {
    bottom: 'bottom',
    left: 'center'
  },
  toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
  series: [
    {
      type: 'pie',
      radius: ['60%', '100%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center',
        alignTo: 'none',
        overflow: 'breakAll',
        formatter: (data: DataProportion) => `${((data.value/totalValue) * 100).toFixed(2)} %`
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          formatter: (data: DataProportion) => `${((data.value/totalValue) * 100).toFixed(2)} %`
        }
      },
      data: data,
      startAngle: 185,
      endAngle: 355,
    }
  ]
};

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ReactCharts option={option} style={{ height: '300px', width: '100%' }} />
      </CardContent>
    </Card>
  );
};

export default Pie;
