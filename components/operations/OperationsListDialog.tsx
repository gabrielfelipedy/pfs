"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Operation } from "@/lib/definitions";
import { operationValue } from "@/lib/parcelamento";
import { formatDateBR } from "@/lib/date";
import { formatter } from "@/lib/utils";

interface Props {
  title: string;
  operations: Operation[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OperationsListDialog({
  title,
  operations,
  open,
  onOpenChange,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <ScrollArea>
          {operations.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma operação encontrada.</p>
          ) : (
            operations.map((operation) => (
              <div key={operation.id}>
                <div className="grid grid-cols-3 w-full ">
                  <p className="text-sm">{operation.name}</p>
                  <p className="text-sm text-center">
                    {operation.date ? formatDateBR(operation.date) : ""}
                  </p>
                  <p className="text-sm text-end">
                    {formatter.format(operationValue(operation) / 100)}
                  </p>
                </div>
                <Separator className="my-1" />
              </div>
            ))
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
