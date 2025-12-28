"use client";

import { useActionState, useState, useEffect, ReactNode } from "react";
import { ChevronDownIcon } from "lucide-react";
import { addDays } from 'date-fns';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { toast } from "sonner";
import { formatter } from "@/lib/utils";
import { ExpenseLimit } from "@/lib/definitions";
import { OperationActionState } from "@/actions/definitions";
import { useRouter } from "next/navigation";
import CategorySelector from "./categorySelector";
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";
import { ExpenseLimitActionState } from "@/app/(main)/saidas/limites/actions/definitions";
import { DateRange } from "react-day-picker";

// Defines the props for the FormDialog component

interface Props {
  className?: string,
  openDialogText: string | ReactNode;
  buttonVariation?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  dialogTitle: string;
  dialogDescription: string;
  buttonText: string;
  limit: ExpenseLimit | undefined;
  actionFunction: (
    prevState: ExpenseLimitActionState | undefined,
    formData: FormData
  ) => Promise<ExpenseLimitActionState>;
}

export default function LimitDialog({
  className,
  openDialogText,
  buttonVariation,
  dialogTitle,
  dialogDescription,
  buttonText,
  limit,
  actionFunction,
}: Props) {
  //console.log(operation)

  // States used by calendar selector propover
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    {
      from: limit?.start_date ? new Date(limit?.start_date) : new Date(),
      to: limit?.end_date ? new Date(limit?.end_date) : addDays(new Date(), 1)
    }
  );

  // State for switch for is_paid field
  const [selected, setSelected] = useState(limit?.recursive ?? true);

  // State to control dialog open/close
  const [dialogOpen, setDialogOpen] = useState(false);

  // controls the currency formatin of valor field
  const [rawValor, setRawValor] = useState<number>(limit?.value || 0);

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setRawValor(Number(value));
  };
  const handleSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const len = input.value.length;
    input.setSelectionRange(len, len);
  };

  //defines the action to be used based on whether operation is defined

  const [state, formAction, pending] = useActionState<
    OperationActionState | undefined,
    FormData
  >(actionFunction, undefined);

  const router = useRouter();

  // handles the success or erros afer action is performed

  useEffect(() => {
    if (state && state.success) {
      console.log("Action successful, closing dialog.");
      toast.success(state.message);

      //router.refresh();

      setTimeout(() => {
        setDialogOpen(false);
      }, 0);
    } else {
      if (state && state.message) {
        toast.error(state.message);
      }
    }
  }, [state, router]);

  return (
    <Dialog
      key={limit?.id || "new"}
      open={dialogOpen}
      onOpenChange={setDialogOpen}
    >
      <DialogTrigger className={className} asChild>
        <Button variant={buttonVariation}>{openDialogText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col md:grid gap-4 mt-10">
            <div className="md:grid gap-3">
              <input type="hidden" name="id" value={limit?.id || ""} />

              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" defaultValue={limit?.name || ""} />
              {!state?.success && (
                <p className="text-sm text-red-500">
                  {state?.errors?.name || ""}
                </p>
              )}
            </div>

            <div className="md:grid gap-3">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="start_date" className="px-1">
                    Invervalo de tempo
                  </Label>
                  <input
                    type="hidden"
                    name="start_date"
                    value={
                      dateRange?.from ? dateRange?.from.toISOString().split("T")[0] : ""
                    }
                  />

                  <input
                    type="hidden"
                    name="end_date"
                    value={dateRange?.to ? dateRange?.to.toISOString().split("T")[0] : ""}
                  />

                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="start_date"
                        className="w-full justify-between font-normal"
                      >
                        {dateRange
                          ? `${dateRange?.from?.toLocaleDateString("pt-BR")}   -   ${dateRange?.to?.toLocaleDateString("pt-BR")}`
                          : "Selecione o intervalo"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        captionLayout="dropdown"
                        onSelect={setDateRange}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {!state?.success && (
                  <p className="text-sm text-red-500">
                    {state?.errors?.date || ""}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-3 mt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-3">
                <Label htmlFor="value">Valor</Label>
                {/* <Input className="max-w-[150px]" id="valor" name="valor" /> */}

                <Input
                  id="valor_display"
                  type="text"
                  value={formatter.format(rawValor / 100)}
                  onChange={handleValorChange}
                  onSelect={handleSelect}
                  className="max-w-28 md:max-w-30 text-right"
                />
                {/* 2. DATA INPUT: Hidden, has the "name", sends the raw integer */}
                <input type="hidden" name="value" value={rawValor} />

                {!state?.success && (
                  <p className="text-sm text-red-500">
                    {state?.errors?.value || ""}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="category_id">Categoria</Label>

                <CategorySelector
                  category_id={limit?.category_id || undefined}
                  is_income={false}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="recursive_switch">Recursivo</Label>

                <Switch
                  name="recursive_switch"
                  checked={selected}
                  onCheckedChange={(checked) => setSelected(checked)}
                  id="recursive"
                />

                <input
                  type="hidden"
                  name="recursive"
                  value={selected ? "true" : "false"}
                />
              </div>
            </div>

            {!state?.success && (
              <p className="text-sm text-red-500">
                {state?.errors?.category_id || ""}
              </p>
            )}

            {!state?.success && (
              <p className="text-sm text-red-500">
                {state?.errors?.is_paid || ""}
              </p>
            )}
          </div>

          <div className="md:grid gap-3">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Input
              id="description"
              name="description"
              defaultValue={limit?.description || ""}
            />
            {!state?.success && (
              <p className="text-sm text-red-500">
                {state?.errors?.description || ""}
              </p>
            )}
          </div>

          <DialogFooter className="mt-12 w-full">
            <DialogClose className="w-full md:w-1/2" asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button className="w-full md:w-1/2" disabled={pending}>
              {pending && <Spinner />}
              {pending ? "Validando" : buttonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
