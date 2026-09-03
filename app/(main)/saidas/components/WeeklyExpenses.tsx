"use client"

import CardResume from '@/components/resume/card-resume';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Operation } from '@/lib/definitions';
import { operationValue } from '@/lib/parcelamento';
import { formatter } from '@/lib/utils';
import { DialogTitle } from '@radix-ui/react-dialog';
import { isSameWeek } from 'date-fns';
import { toUtcMinus3Date, todayInUtcMinus3, formatDateBR } from '@/lib/date';
import { isAtualOperation } from '@/lib/operation';
import { TrendingDownIcon } from 'lucide-react';

const filterWeeklyExpenses = (operations: Operation[], paidOnly = false) => {
  return operations.filter(
    (operation) =>
      !operation.is_income &&
      operation.date &&
      isSameWeek(toUtcMinus3Date(operation.date), todayInUtcMinus3(), {
        weekStartsOn: 0,
      }) &&
      (!paidOnly || isAtualOperation(operation))
  );
}

const calculateWeeklyExpenses = (operations: Operation[], paidOnly = false) => {
  let total = 0;

  operations.forEach((operation) => {
    if (
      !operation.is_income &&
      operation.date &&
      isSameWeek(toUtcMinus3Date(operation.date), todayInUtcMinus3(), {
        weekStartsOn: 0,
      }) &&
      (!paidOnly || isAtualOperation(operation))
    ) {
      total += operationValue(operation);
    }
  });
  return total;
};

interface Props {
    expenses: Operation[];
    paidOnly?: boolean;
}

export default function WeeklyExpenses({ expenses, paidOnly = false }: Props) {

    const total_weekly_expenses = calculateWeeklyExpenses(expenses, paidOnly)
    const weekly_expenses = filterWeeklyExpenses(expenses, paidOnly)

    return (
        <Dialog>
            <DialogTrigger asChild className="hover:scale-101 hover:cursor-pointer transition-all">


                <CardResume
                    title="Gastos semanais"
                    icon={<TrendingDownIcon className="h-4 w-4 text-muted-foreground" />}
                    data={total_weekly_expenses}
                    subtext="Total de saídas registradas"
                    is_income={false}
                />

            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Gastos semanais</DialogTitle>
                </DialogHeader>
                
                <ScrollArea>
                    {weekly_expenses.map((expense) => (
                        <div key={expense.id}>
                            <div className="grid grid-cols-3 w-full "><p className="text-sm">{expense.name}</p>

                                <p className="text-sm text-center">{expense.date ? formatDateBR(expense.date) : ""}</p>

                                <p className="text-sm text-end">{formatter.format(operationValue(expense) / 100)}</p></div>

                            <Separator className="my-1" />
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}