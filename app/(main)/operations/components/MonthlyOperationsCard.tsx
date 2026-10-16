"use client"

import CardResume from '@/components/resume/card-resume';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Operation } from '@/lib/definitions';
import { filterOperationsByMonth, formatDateBR } from '@/lib/date';
import { operationValue } from '@/lib/parcelamento';
import { isAtualOperation } from '@/lib/operation';
import { formatter } from '@/lib/utils';
import { DialogTitle } from '@radix-ui/react-dialog';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { OperationTabConfig } from './tabConfig';

interface Props {
    operations: Operation[];
    month: string;
    paidOnly?: boolean;
    config: OperationTabConfig;
}

export default function MonthlyOperationsCard({ operations, month, paidOnly = false, config }: Props) {

    const filtered = filterOperationsByMonth(operations, month)
        .filter((op) => !paidOnly || isAtualOperation(op, month));
    const total = filtered.reduce((sum, op) => sum + operationValue(op), 0);

    return (
        <Dialog>
            <DialogTrigger asChild className="hover:scale-101 hover:cursor-pointer transition-all">

                <CardResume
                    title={config.resume.monthly.title}
                    icon={config.isIncome
                        ? <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                        : <TrendingDownIcon className="h-4 w-4 text-muted-foreground" />}
                    data={total}
                    subtext={config.resume.monthly.subtext}
                    is_income={config.isIncome}
                />

            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{config.resume.monthly.title}</DialogTitle>
                </DialogHeader>

                <ScrollArea>
                    {filtered.map((operation) => (
                        <div key={operation.id}>
                            <div className="grid grid-cols-3 w-full "><p className="text-sm">{operation.name}</p>

                                <p className="text-sm text-center">{operation.date ? formatDateBR(operation.date) : ""}</p>

                                <p className="text-sm text-end">{formatter.format(operationValue(operation) / 100)}</p></div>

                            <Separator className="my-1" />
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
