"use client"

import CardResume from '@/components/resume/card-resume';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Operation } from '@/lib/definitions';
import { formatter } from '@/lib/utils';
import { DialogTitle } from '@radix-ui/react-dialog';
import { isToday } from 'date-fns';
import { TrendingDownIcon } from 'lucide-react';

export const filterDailyExpenses = (operations: Operation[]) => {
    return operations.filter(
        (operation) =>
            !operation.is_income && isToday(operation.date ?? ""))

}

export const calculateDailyExpenses = (operations: Operation[]) => {
    let total = 0;

    operations.forEach((operation) => {
        if (!operation.is_income && isToday(operation.date ?? "")) {
            total += operation.value ?? 0;
        }
    });
    return total;
};

interface Props {
    expenses: Operation[];
}

export default function DailyExpenses({ expenses }: Props) {

    const daily_expenses = calculateDailyExpenses(expenses)

    return (
        <Dialog>
            <DialogTrigger asChild className="hover:scale-101 hover:cursor-pointer transition-all">


                <CardResume
                    title="Gastos diários"
                    icon={<TrendingDownIcon className="h-4 w-4 text-muted-foreground" />}
                    data={daily_expenses}
                    subtext="Total de saídas registradas"
                    is_income={false}
                />

            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Gastos diários</DialogTitle>
                </DialogHeader>
                
                <ScrollArea>
                    {filterDailyExpenses(expenses).map((dayExpense) => (
                        <div key={dayExpense.id}>
                            <div className="grid grid-cols-3 w-full "><p className="text-sm">{dayExpense.name}</p>

                                <p className="text-sm text-center">{dayExpense.date?.toLocaleDateString('pt-BR')}</p>

                                <p className="text-sm text-end">{formatter.format((dayExpense.value ?? 0) / 100)}</p></div>

                            <Separator className="my-1" />
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}