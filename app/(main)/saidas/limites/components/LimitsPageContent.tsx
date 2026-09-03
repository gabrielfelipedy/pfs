"use client";

import { ExpenseLimit } from "@/lib/definitions";
import ErrorLoading from "@/components/error/ErrorLoading";
import { useExpenses, useOperations } from "@/components/operations/OperationsProvider";
import { calculateOperationProportion } from "@/lib/operation";
import { filterOperationsByMonth, getAvaliableMonths } from "@/lib/date";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMonthYear } from "@/lib/date";
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

  if (error) return <ErrorLoading />;

  const avaliableMonths = getAvaliableMonths(expenses);

  return (
    <Tabs className={className} defaultValue={avaliableMonths.at(-1)}>
      <TabsList>
        {avaliableMonths.map((month) => (
          <TabsTrigger key={month} value={month}>
            {formatMonthYear(month)}
          </TabsTrigger>
        ))}
      </TabsList>
      {avaliableMonths.map((month) => (
        <TabsContent key={month} value={month}>
          <LimitsResume
            expenseLimits={limits}
            expensesProportion={calculateOperationProportion(
              filterOperationsByMonth(expenses, month)
            )}
            className="mt-10"
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
