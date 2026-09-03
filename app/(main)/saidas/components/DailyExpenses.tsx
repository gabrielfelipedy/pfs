"use client"

import CardResume from '@/components/resume/card-resume';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Operation } from '@/lib/definitions';
import { operationValue } from '@/lib/parcelamento';
import { formatter } from '@/lib/utils';
import { DialogTitle } from '@radix-ui/react-dialog';
import { isTodayUTC, formatDateBR } from '@/lib/date';
import { isAtualOperation } from '@/lib/operation';
import { TrendingDownIcon } from 'lucide-react';

const filterDailyExpenses = (operations: Operation[], paidOnly = false) => {
    return operations.filter(
        (operation) =>
            !operation.is_income && operation.date && isTodayUTC(operation.date) &&
            (!paidOnly || isAtualOperation(operation)))

}

const calculateDailyExpenses = (operations: Operation[], paidOnly = false) => {
    let total = 0;

    operations.forEach((operation) => {
        if (!operation.is_income && operation.date && isTodayUTC(operation.date) &&
            (!paidOnly || isAtualOperation(operation))) {
            total += operationValue(operation);
        }
    });
    return total;
};

interface Props {
    expenses: Operation[];
    paidOnly?: boolean;
}

export default function DailyExpenses({ expenses, paidOnly = false }: Props) {

    const total_daily_expenses = calculateDailyExpenses(expenses, paidOnly)
    const daily_expenses = filterDailyExpenses(expenses, paidOnly)

    return (
        <Dialog>
            <DialogTrigger asChild className="hover:scale-101 hover:cursor-pointer transition-all">


                <CardResume
                    title="Gastos diários"
                    icon={<TrendingDownIcon className="h-4 w-4 text-muted-foreground" />}
                    data={total_daily_expenses}
                    subtext="Total de saídas registradas"
                    is_income={false}
                />

            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Gastos diários</DialogTitle>
                </DialogHeader>
                
                <ScrollArea>
                    {daily_expenses.map((expense) => (
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