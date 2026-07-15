"use client"

import CardResume from '@/components/resume/card-resume';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Operation } from '@/lib/definitions';
import { filterOperationsByMonth } from '@/lib/date';
import { formatter } from '@/lib/utils';
import { DialogTitle } from '@radix-ui/react-dialog';
import { TrendingDownIcon } from 'lucide-react';

interface Props {
    expenses: Operation[];
    month: string;
}

export default function MonthlyExpenses({ expenses, month }: Props) {

    const filteredExpenses = filterOperationsByMonth(expenses, month);
    const total = filteredExpenses.reduce((sum, op) => sum + (op.value ?? 0), 0);

    return (
        <Dialog>
            <DialogTrigger asChild className="hover:scale-101 hover:cursor-pointer transition-all">

                <CardResume
                    title="Gastos mensais"
                    icon={<TrendingDownIcon className="h-4 w-4 text-muted-foreground" />}
                    data={total}
                    subtext="Total de gastos no mês"
                    is_income={false}
                />

            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Gastos mensais</DialogTitle>
                </DialogHeader>
                
                <ScrollArea>
                    {filteredExpenses.map((expense) => (
                        <div key={expense.id}>
                            <div className="grid grid-cols-3 w-full "><p className="text-sm">{expense.name}</p>

                                <p className="text-sm text-center">{expense.date?.toLocaleDateString('pt-BR')}</p>

                                <p className="text-sm text-end">{formatter.format((expense.value ?? 0) / 100)}</p></div>

                            <Separator className="my-1" />
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
