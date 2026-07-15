"use client"

import CardResume from '@/components/resume/card-resume';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Operation } from '@/lib/definitions';
import { filterOperationsByMonth } from '@/lib/date';
import { formatter } from '@/lib/utils';
import { DialogTitle } from '@radix-ui/react-dialog';
import { TrendingUpIcon } from 'lucide-react';

interface Props {
    incomes: Operation[];
    month: string;
}

export default function MonthlyIncome({ incomes, month }: Props) {

    const filteredIncomes = filterOperationsByMonth(incomes, month);
    const total = filteredIncomes.reduce((sum, op) => sum + (op.value ?? 0), 0);

    return (
        <Dialog>
            <DialogTrigger asChild className="hover:scale-101 hover:cursor-pointer transition-all">

                <CardResume
                    title="Entradas mensais"
                    icon={<TrendingUpIcon className="h-4 w-4 text-muted-foreground" />}
                    data={total}
                    subtext="Total de entradas no mês"
                    is_income={true}
                />

            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Entradas mensais</DialogTitle>
                </DialogHeader>
                
                <ScrollArea>
                    {filteredIncomes.map((income) => (
                        <div key={income.id}>
                            <div className="grid grid-cols-3 w-full "><p className="text-sm">{income.name}</p>

                                <p className="text-sm text-center">{income.date?.toLocaleDateString('pt-BR')}</p>

                                <p className="text-sm text-end">{formatter.format((income.value ?? 0) / 100)}</p></div>

                            <Separator className="my-1" />
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
