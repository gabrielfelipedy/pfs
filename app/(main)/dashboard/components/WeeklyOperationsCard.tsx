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
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { ResumeTabConfig } from './tabConfig';

const filterWeeklyOperations = (operations: Operation[], paidOnly = false) => {
    return operations.filter(
        (operation) =>
            operation.date &&
            isSameWeek(toUtcMinus3Date(operation.date), todayInUtcMinus3(), {
                weekStartsOn: 0,
            }) &&
            (!paidOnly || isAtualOperation(operation))
    );
}

const calculateWeeklyOperations = (operations: Operation[], paidOnly = false) => {
    let total = 0;

    operations.forEach((operation) => {
        if (
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
    operations: Operation[];
    paidOnly?: boolean;
    config: ResumeTabConfig;
}

export default function WeeklyOperationsCard({ operations, paidOnly = false, config }: Props) {

    const total_weekly = calculateWeeklyOperations(operations, paidOnly)
    const weekly_operations = filterWeeklyOperations(operations, paidOnly)

    return (
        <Dialog>
            <DialogTrigger asChild className="hover:scale-101 hover:cursor-pointer transition-all">


                <CardResume
                    title={config.resume.weekly.title}
                    icon={config.isIncome
                        ? <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                        : <TrendingDownIcon className="h-4 w-4 text-muted-foreground" />}
                    data={total_weekly}
                    subtext={config.resume.weekly.subtext}
                    is_income={config.isIncome}
                />

            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{config.resume.weekly.title}</DialogTitle>
                </DialogHeader>

                <ScrollArea>
                    {weekly_operations.map((operation) => (
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
