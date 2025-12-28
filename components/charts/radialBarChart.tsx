"use client";

import ReactCharts from "echarts-for-react";
import {
  Card,
  CardContent
} from "../ui/card";
import { formatter } from "@/lib/utils";
import { useTheme } from "next-themes";

interface Props {
  title: string;
  className?: string;
  data: number;
  maxValue: number;
}

const RadialBarChart = ({ title, className, data, maxValue }: Props) => {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || theme === "dark";

  const option = {
    polar: {
      radius: ["80%", "100%"],
    },
    visualMap: {
      show: false, // Hide the legend/slider
      min: 0,
      max: maxValue,
      inRange: {
        // Define colors from "low" to "high"
        color: ["#52c41a", "#fadb14", "#ff4d4f"],
      },
    },
    grid: {
      show: false,
    },
    angleAxis: {
      max: maxValue,
      startAngle: 90,
      show: false,
    },
    radiusAxis: {
      type: "category",
      show: false,
    },
    graphic: [
      {
        type: "text",
        left: "center",
        top: "middle",
        style: {
          text: `${Math.round((data / maxValue) * 100)}%`, // Your center label
          fill: isDark ? "#ffffff" : "#333333",
          textAlign: "center",
          fontSize: 18,
          fontWeight: "bold",
        },
      },
    ],
    series: {
      type: "bar",
      data: [data],
      coordinateSystem: "polar",
      showBackground: true,
      backgroundStyle: {
        color: "#f0f0f0", // Light gray color from your image
        borderRadius: 10, // Ensures the background is also rounded
      },
      // 2. Round the tips of the active bar
      roundCap: true,
      label: {
        show: false,
      },
    },
  };

  return (
    <Card className={`${className}`}>
      {/* <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader> */}
      <CardContent className="pl-0">
        <div className="grid grid-cols-2 items-center">
          <ReactCharts
            style={{ height: "90px", width: "100%" }}
            option={option}
          />

          <div>
            <p className="font-bold text-[1.2rem]">{title}</p>
            <p className="text-[0.9rem] text-black/70 dark:text-white/70">
              {formatter.format(data / 100)} de{" "}
              {formatter.format(maxValue / 100)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RadialBarChart;
