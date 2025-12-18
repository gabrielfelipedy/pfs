"use client";

import { useActionState, useState, useEffect, ReactNode } from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

import { toast } from "sonner";
import { formatter } from "@/lib/utils";
import { Operation } from "@/lib/definitions";
import { OperationActionState } from "@/actions/definitions";

// Defines the props for the FormDialog component

interface Props {
  openDialogText: string | ReactNode;
  buttonVariation?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
  dialogTitle: string;
  dialogDescription: string;
  buttonText: string;
  operation: Operation | undefined;
  actionFunction: (
    prevState: OperationActionState | undefined,
    formData: FormData
  ) => Promise<OperationActionState>;
}

export default function FormDialog({
  openDialogText,
  buttonVariation,
  dialogTitle,
  dialogDescription,
  buttonText,
  operation,
  actionFunction,
}: Props) {
  // States used by calendar selector propover
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    operation?.date ? new Date(operation?.date) : new Date()
  );

  // State to control dialog open/close
  const [dialogOpen, setDialogOpen] = useState(false);

  // controls the currency formatin of valor field
  const [rawValor, setRawValor] = useState<number>(operation?.value || 0);

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

  // handles the success or erros afer action is performed

  useEffect(() => {
    if (state && state.success) {
      console.log("Action successful, closing dialog.");
      toast.success(state.message);
      setTimeout(() => {
        setDialogOpen(false);
      }, 0);
    } else {
      if (state && state.message) {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
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
              <input type="hidden" name="id" value={operation?.id || ""} />

              <Label htmlFor="name">Nome</Label>
              <Input
                className="mt-4"
                id="name"
                name="name"
                defaultValue={operation?.name || ""}
              />
              {!state?.success && (
                <p className="text-sm text-red-500">
                  {state?.errors?.name || ""}
                </p>
              )}
            </div>
            <div className="md:grid gap-3">
              <Label htmlFor="description">Descrição</Label>
              <Input
                className="mt-4"
                id="description"
                name="description"
                defaultValue={operation?.description || ""}
              />
              {!state?.success && (
                <p className="text-sm text-red-500">
                  {state?.errors?.description || ""}
                </p>
              )}
            </div>
            <div className="md:grid gap-3">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="date" className="px-1">
                    Data
                  </Label>
                  <input
                    type="hidden"
                    name="date"
                    value={date?.toLocaleDateString()}
                  />
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className="md:w-48 justify-between font-normal"
                      >
                        {date?.toLocaleDateString() || "Selecione a data"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setDate(date);
                          setOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {!state?.success && (
                  <p className="text-sm text-red-500">
                    {state?.errors?.date || ""}
                  </p>
                )}
                <div className="flex flex-col gap-3">
                  <Label htmlFor="time" className="px-1">
                    Hora
                  </Label>
                  <Input
                    type="time"
                    name="time"
                    defaultValue={
                      operation
                        ? new Date(operation?.date || "").toLocaleTimeString(
                            "pt-BR",
                            { hour12: false }
                          )
                        : new Date().toLocaleTimeString("pt-BR", {
                            hour12: false,
                          })
                    }
                    id="time"
                    step="1"
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-3">
                <Label htmlFor="value">Valor</Label>
                {/* <Input className="max-w-[150px]" id="valor" name="valor" /> */}

                <Input
                  id="valor_display"
                  type="text"
                  value={formatter.format(rawValor / 100)}
                  onChange={handleValorChange}
                  onSelect={handleSelect}
                  className="max-w-28 md:max-w-37.5 text-right"
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
                <Label htmlFor="is_paid">Pago</Label>
                <NativeSelect
                  name="is_paid"
                  defaultValue={
                    operation ? (operation?.is_paid ? "true" : "false") : "true"
                  }
                >
                  <NativeSelectOption value="true">Sim</NativeSelectOption>
                  <NativeSelectOption value="false">Não</NativeSelectOption>
                </NativeSelect>
                {!state?.success && (
                  <p className="text-sm text-red-500">
                    {state?.errors?.is_paid || ""}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="categoria_id">Categoria</Label>
                <NativeSelect
                  name="categoria_id"
                  defaultValue={operation?.category_id || 1}
                >
                  <NativeSelectOption value="1">1</NativeSelectOption>
                  <NativeSelectOption value="2">2</NativeSelectOption>
                  <NativeSelectOption value="3">3</NativeSelectOption>
                  <NativeSelectOption value="4">4</NativeSelectOption>
                  <NativeSelectOption value="5">5</NativeSelectOption>
                  <NativeSelectOption value="6">6</NativeSelectOption>
                  <NativeSelectOption value="7">7</NativeSelectOption>
                </NativeSelect>
                {!state?.success && (
                  <p className="text-sm text-red-500">
                    {state?.errors?.category_id || ""}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-12">
            <Button className="w-full" disabled={pending}>
              {pending ? "Validando" : buttonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
