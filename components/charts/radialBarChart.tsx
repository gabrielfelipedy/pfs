"use client";

import ReactCharts from "echarts-for-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatter } from "@/lib/utils";
import { useTheme } from "next-themes";
import LimitDialog from "../dialogs/LimitDialog";
import { updateExpenseLimit } from "@/app/(main)/saidas/limites/actions/limits";
import { Pencil } from "lucide-react";
import { ExpenseLimit } from "@/lib/definitions";
import ConfirmDeleteDialog from "../dialogs/confirmDeleteDialog";
import ConfirmDeleteLimitDialog from "../dialogs/confirmDeleteLimitDialog";

interface Props {
  title: string;
  className?: string;
  expenseLimit: ExpenseLimit;
}

const RadialBarChart = ({ title, className, expenseLimit }: Props) => {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || theme === "dark";

  const option = {
    polar: {
      radius: ["80%", "100%"],
    },
    visualMap: {
      show: false, // Hide the legend/slider
      min: 0,
      max: expenseLimit.value,
      inRange: {
        // Define colors from "low" to "high"
        color: ["#52c41a", "#fadb14", "#ff4d4f"],
      },
    },
    grid: {
      show: false,
    },
    angleAxis: {
      max: expenseLimit.value,
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
          text: `${Math.round(
            ((expenseLimit.spend ?? 0) / (expenseLimit.value ?? 1)) * 100
          )}%`, // Your center label
          fill: isDark ? "#ffffff" : "#333333",
          textAlign: "center",
          fontSize: 18,
          fontWeight: "bold",
        },
      },
    ],
    series: {
      type: "bar",
      data: [expenseLimit.spend ?? 0],
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

  const restante = (expenseLimit.value ?? 0) - (expenseLimit.spend ?? 0);

  return (
    <Card className={`${className}`}>
      <CardContent className="pl-0">
        <div className="grid grid-cols-2 items-center">
          <ReactCharts
            style={{ height: "90px", width: "100%" }}
            option={option}
          />

          <div>
            <p className="font-bold text-[1.2rem]">{title}</p>
            <p className="text-[1rem] font-bold text-black/70 dark:text-white/70">
              {formatter.format((expenseLimit.spend ?? 0) / 100)} /{" "}
              {formatter.format((expenseLimit.value ?? 0) / 100)}
            </p>
            <p className="text-[0.9rem] text-black/70 dark:text-white/70">
              {formatter.format(restante / 100)}{" "}
              {restante >= 0 ? "restantes" : "negativo"}
            </p>
          </div>
        </div>

        <div className="w-full flex justify-end gap-4 mt-8">
           <LimitDialog
            buttonVariation="outline"
            dialogTitle="Atualizar Limite"
            dialogDescription="Atualize as informações do limite"
            buttonText="Atualizar"
            limit={expenseLimit}
            actionFunction={updateExpenseLimit}
          >
            <Pencil />
          </LimitDialog>

          <ConfirmDeleteLimitDialog expenseLimit={expenseLimit} />
          </div>
      </CardContent>
    </Card>
  );
};

export default RadialBarChart;
