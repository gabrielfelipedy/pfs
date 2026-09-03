"use client"

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Operation } from "@/lib/definitions";
import BalanceCard from "@/components/resume/balance-card";
import MonthlyExpenses from "./MonthlyExpenses";
import WeeklyExpenses from "./WeeklyExpenses";
import DailyExpenses from "./DailyExpenses";

interface Props {
  operations: Operation[];
  expenses: Operation[];
  month: string;
  className?: string;
}

export default function ExpenseResumeCards({ operations, expenses, month, className }: Props) {
  const [mode, setMode] = useState<"atual" | "previsto">("atual");
  const paidOnly = mode === "atual";

  return (
    <div className={`${className} flex flex-col gap-4 w-full`}>
      <Tabs defaultValue="atual" onValueChange={(v) => setMode(v as "atual" | "previsto")}>
        <TabsList>
          <TabsTrigger value="atual">Atual</TabsTrigger>
          <TabsTrigger value="previsto">Previsto</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-start">
        <BalanceCard operations={operations} month={month} paidOnly={paidOnly} />
        <MonthlyExpenses expenses={expenses} month={month} paidOnly={paidOnly} />
        <WeeklyExpenses expenses={expenses} paidOnly={paidOnly} />
        <DailyExpenses expenses={expenses} paidOnly={paidOnly} />
      </div>
    </div>
  );
}
