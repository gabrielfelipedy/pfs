"use client"

import { Operation } from "@/lib/definitions";
import { operationValue } from "@/lib/parcelamento";
import { isAtualOperation } from "@/lib/operation";
import { filterOperationsByMonth, formatMonthYear } from "@/lib/date";
import { formatter } from "@/lib/utils";

interface Props {
  operations: Operation[];
  month: string;
  paidOnly?: boolean;
}

export default function BalanceHeader({ operations, month, paidOnly = false }: Props) {
  const balance = filterOperationsByMonth(operations, month)
    .filter((op) => !paidOnly || isAtualOperation(op, month))
    .reduce(
      (sum, op) => sum + (op.is_income ? operationValue(op) : -operationValue(op)),
      0
    );

  return (
    <header className="mt-10">
      <h1 className="text-sm font-medium text-muted-foreground">Dashboard</h1>
      <div className="mt-2 flex flex-wrap items-baseline gap-3">
        <p
          className={`text-[2.2rem] md:text-[3.2rem] font-bold tabular-nums ${
            balance > 0
              ? "text-green-500 dark:text-green-400"
              : "text-red-500 dark:text-red-400"
          }`}
        >
          <span className="sr-only">Saldo mensal: </span>
          {formatter.format(balance / 100)}
        </p>
        <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-sm font-medium text-primary">
          {formatMonthYear(month)}
        </span>
      </div>
    </header>
  );
}
