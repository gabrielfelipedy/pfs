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
import { Operation } from "@/lib/definitions";
import { OperationActionState } from "@/actions/definitions";
import { useRouter } from "next/navigation";
import CategorySelector from "../selectors/categorySelector";
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";
import PaymentMethodSelector from "../selectors/paymentMethodSelector";
import { ClientDateTime } from "../shared/ClientDateTime";
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Currency } from "../shared/Currency";
// Defines the props for the FormDialog component

interface Props {
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
  operation: Operation;
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
  //console.log(operation)

  // States used by calendar selector propover
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(
    operation?.date ?? new Date()
  );

  const [pagoSelected, setPagoSelected] = useState(operation?.is_paid ?? true);
  const [fixoSelected, setFixoSelected] = useState((operation?.period_id ?? true) === 3);

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

  const router = useRouter();

  // handles the success or erros afer action is performed

  useEffect(() => {
    if (state && state.success) {
      console.log("Action successful, closing dialog.");
      toast.success(state.message);

      router.refresh();

      setTimeout(() => {
        setRawValor(0)
        setDate(new Date())
        setPagoSelected(true)
        setFixoSelected(false)
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
      key={operation?.id || "new"}
      open={dialogOpen}
      onOpenChange={setDialogOpen}
    >
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

            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-3">
                <Label htmlFor="valor_display">Valor</Label>

                <Input
                  id="valor_display"
                  type="text"
                  value={formatter.format(rawValor / 100)}
                  onChange={handleValorChange}
                  onSelect={handleSelect}
                  className="w-full text-right"
                />
                {/* 2. DATA INPUT: Hidden, has the "name", sends the raw integer */}
                <input type="hidden" name="value" value={rawValor} />
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="parcelas">Nº de parcelas</Label>

                <Select name="parcelas" defaultValue={operation?.parcelas.toString()}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Ver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Parcelas</SelectLabel>


                      {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                        <SelectItem key={n} value={n.toString()}>
                          <span>{n}x de </span>
                          <Currency value={rawValor / n} />
                        </SelectItem>
                      ))}

                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {!state?.success && (
                <>
                  <p className="text-sm text-red-500">
                    {state?.errors?.value || ""}
                  </p>
                </>
              )}

            </div>

            <div className="md:grid gap-3">
              <input type="hidden" name="id" value={operation?.id || ""} />

              <Label htmlFor="name">Nome</Label>
              <Input
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
              <div className="grid grid-cols-3 gap-5 place-items-center">

                <div className="flex flex-col gap-3">
                  <Label htmlFor="date" className="px-1">
                    Data
                  </Label>
                  <input
                    type="hidden"
                    name="date"
                    value={date.toISOString()}
                  />
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className="w-full justify-between font-normal"
                      >
                        <ClientDateTime date={date} />

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
                        toYear={2030}
                        onSelect={(date) => {
                          setDate(date ?? new Date());
                          setOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col gap-3">
                  <Label htmlFor="is_paid_switch">Pago</Label>

                  <Switch
                    name="is_paid_switch"
                    checked={pagoSelected}
                    onCheckedChange={(checked) => setPagoSelected(checked)}
                    id="is_paid"
                  />

                  <input
                    type="hidden"
                    name="is_paid"
                    value={pagoSelected ? "true" : "false"}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <Label htmlFor="is_fixo_switch">Fixo</Label>

                  <Switch
                    name="is_fixo_switch"
                    checked={fixoSelected}
                    onCheckedChange={(checked) => setFixoSelected(checked)}
                    id="is_paid"
                  />

                  <input
                    type="hidden"
                    name="is_fixo"
                    value={fixoSelected ? "true" : "false"}
                  />
                </div>


                {!state?.success && (
                  <>
                    <p className="text-sm text-red-500">
                      {state?.errors?.date || ""}
                    </p>

                    <p className="text-sm text-red-500">
                      {state?.errors?.is_paid || ""}
                    </p>

                    <p className="text-sm text-red-500">
                      {state?.errors?.period_id || ""}
                    </p>

                  </>)}
              </div>
            </div>
          </div>

          <div className="grid gap-3 mt-4">

            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-3">
                <Label htmlFor="category_id">Categoria</Label>

                <CategorySelector
                  category_id={operation?.category_id || undefined}
                  is_income={operation?.is_income ?? true}
                />
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="payment_method_id">Método de pagamento</Label>

                <PaymentMethodSelector
                  payment_method_id={operation?.payment_method_id || undefined}
                />
              </div>
            </div>

            {!state?.success && (
              <>
                <p className="text-sm text-red-500">
                  {state?.errors?.category_id || ""}
                </p>

                <p className="text-sm text-red-500">
                  {state?.errors?.payment_method_id || ""}
                </p>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
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
