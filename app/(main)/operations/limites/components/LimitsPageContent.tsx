"use client";

import { useState } from "react";
import { ExpenseLimit } from "@/lib/definitions";
import ErrorLoading from "@/components/error/ErrorLoading";
import { useExpenses, useOperations } from "@/components/operations/OperationsProvider";
import { calculateOperationProportion, isAtualOperation } from "@/lib/operation";
import { filterOperationsByMonth, getAvaliableMonths } from "@/lib/date";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMonthYear } from "@/lib/date";
import ScrollableTabsList from "@/components/shared/ScrollableTabsList";
import LimitsResume from "./LimitsResume";

export default function LimitsPageContent({
  limits,
  className,
}: {
  limits: ExpenseLimit[];
  className?: string;
}) {
  const { error } = useOperations();
  const expenses = useExpenses();
  const [mode, setMode] = useState<"atual" | "previsto">("atual");

  if (error) return <ErrorLoading />;

  const avaliableMonths = getAvaliableMonths(expenses);
  const paidOnly = mode === "atual";

  return (
    <Tabs className={className} defaultValue={avaliableMonths.at(-1)}>
      <ScrollableTabsList className="w-full justify-start overflow-x-auto overflow-y-hidden whitespace-nowrap h-auto p-1 scrollbar-hide">
        {avaliableMonths.map((month) => (
          <TabsTrigger key={month} value={month} className="shrink-0">
            {formatMonthYear(month)}
          </TabsTrigger>
        ))}
      </ScrollableTabsList>
      {avaliableMonths.map((month) => (
        <TabsContent key={month} value={month}>
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as "atual" | "previsto")}
            className="mt-4"
          >
            <TabsList>
              <TabsTrigger value="atual">Atual</TabsTrigger>
              <TabsTrigger value="previsto">Previsto</TabsTrigger>
            </TabsList>
          </Tabs>

          <LimitsResume
            expenseLimits={limits}
            expensesProportion={calculateOperationProportion(
              (() => {
                const monthExpenses = filterOperationsByMonth(expenses, month);
                return paidOnly
                  ? monthExpenses.filter((op) => isAtualOperation(op, month))
                  : monthExpenses;
              })()
            )}
            className="mt-10"
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
