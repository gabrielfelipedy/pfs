"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Operation } from "@/lib/definitions";
import BalanceCard from "@/components/resume/balance-card";
import MonthlyOperationsCard from "./MonthlyOperationsCard";
import WeeklyOperationsCard from "./WeeklyOperationsCard";
import DailyOperationsCard from "./DailyOperationsCard";
import { OperationTabConfig } from "./tabConfig";

interface Props {
  operations: Operation[];
  filtered: Operation[];
  month: string;
  className?: string;
  mode: "atual" | "previsto";
  onModeChange: (mode: "atual" | "previsto") => void;
  config: OperationTabConfig;
}

export default function OperationsResumeCards({ operations, filtered, month, className, mode, onModeChange, config }: Props) {
  const paidOnly = mode === "atual";

  return (
    <div className={`${className} flex flex-col gap-4 w-full`}>
      <Tabs value={mode} onValueChange={(v) => onModeChange(v as "atual" | "previsto")}>
        <TabsList>
          <TabsTrigger value="atual">Atual</TabsTrigger>
          <TabsTrigger value="previsto">Previsto</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-start">
        <BalanceCard operations={operations} month={month} paidOnly={paidOnly} />
        <MonthlyOperationsCard operations={filtered} month={month} paidOnly={paidOnly} config={config} />
        <WeeklyOperationsCard operations={filtered} paidOnly={paidOnly} config={config} />
        <DailyOperationsCard operations={filtered} paidOnly={paidOnly} config={config} />
      </div>
    </div>
  );
}
