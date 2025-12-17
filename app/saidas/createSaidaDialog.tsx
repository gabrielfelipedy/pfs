"use client";

import React, { useActionState } from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { createSaida } from "./actions";
import { toast } from "sonner";

export default function CreateSaidaDialog() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [state, createSaidaAction, pending] = React.useActionState(
    createSaida,
    undefined
  );

  React.useEffect(() => {
    if (state && !state.errors) {
      console.log('Action successful, closing dialog.');
      toast.success(state.message);
      setDialogOpen(false);
    }
    else{
      if(state && state.message){
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Adicionar novo gasto</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={createSaidaAction}>
          <DialogHeader>
            <DialogTitle>Adicionar novo gasto</DialogTitle>
            <DialogDescription>
              Preencha os campos de acordo com as informações
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-10">
            <div className="grid gap-3">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" />
              {state?.errors?.name && (
                <p className="text-sm text-red-500">{state.errors.name}</p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" name="description" />
              {state?.errors?.description && (
                <p className="text-sm text-red-500">
                  {state.errors.description}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <div className="flex justify-between gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="date" className="px-1">
                    Data
                  </Label>
                  <input
                    type="hidden"
                    name="date"
                    value={date ? date.toISOString() : ""}
                  />
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className="w-48 justify-between font-normal"
                      >
                        {date ? date.toLocaleDateString() : "Selecione a data"}
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
                {state?.errors?.date && (
                  <p className="text-sm text-red-500">{state.errors.date}</p>
                )}
                <div className="flex flex-col gap-3">
                  <Label htmlFor="time" className="px-1">
                    Hora
                  </Label>
                  <Input
                    type="time"
                    name="time"
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
                <Label htmlFor="valor">Valor</Label>
                <Input className="max-w-[150px]" id="valor" name="valor" />
                {state?.errors?.valor && (
                  <p className="text-sm text-red-500">{state.errors.valor}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="is_paid">Pago</Label>
                <NativeSelect name="is_paid">
                  <NativeSelectOption value="true">Sim</NativeSelectOption>
                  <NativeSelectOption value="false">Não</NativeSelectOption>
                </NativeSelect>
                {state?.errors?.is_paid && (
                  <p className="text-sm text-red-500">{state.errors.is_paid}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="categoria_id">Categoria</Label>
                <NativeSelect name="categoria_id">
                  <NativeSelectOption value="1">1</NativeSelectOption>
                  <NativeSelectOption value="2">2</NativeSelectOption>
                  <NativeSelectOption value="3">3</NativeSelectOption>
                  <NativeSelectOption value="4">4</NativeSelectOption>
                  <NativeSelectOption value="5">5</NativeSelectOption>
                  <NativeSelectOption value="6">6</NativeSelectOption>
                  <NativeSelectOption value="7">7</NativeSelectOption>
                </NativeSelect>
                {state?.errors?.categoria_id && (
                  <p className="text-sm text-red-500">
                    {state.errors.categoria_id}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-12">
            <Button className="w-full" disabled={pending}>
              {pending ? "Validando" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
