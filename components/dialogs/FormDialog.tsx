"use client";

import { useActionState, useState, useEffect, useRef, ReactNode } from "react";
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

  const [fixoStartInput, setFixoStartInput] = useState<string>(
    operation.start_date
      ? `${String(operation.start_date.getMonth() + 1).padStart(2, '0')}/${String(operation.start_date.getFullYear()).slice(-2)}`
      : operation.date
        ? `${String(operation.date.getMonth() + 1).padStart(2, '0')}/${String(operation.date.getFullYear()).slice(-2)}`
        : ""
  );
  const [fixoEndInput, setFixoEndInput] = useState<string>(
    operation.end_date
      ? `${String(operation.end_date.getMonth() + 1).padStart(2, '0')}/${String(operation.end_date.getFullYear()).slice(-2)}`
      : ""
  );
  const [fixoStartError, setFixoStartError] = useState<string | null>(null);
  const [fixoEndError, setFixoEndError] = useState<string | null>(null);

  // State to control dialog open/close
  const [dialogOpen, setDialogOpen] = useState(false);

  // controls the currency formatin of valor field
  const [rawValor, setRawValor] = useState<number>(operation?.value || 0);

  // Sync internal state with the operation prop when the dialog opens for editing.
  // Prevents stale hidden inputs from corrupting data after router.refresh() reuses
  // the same FormDialog component instance with a different operation.
  const prevDialogOpen = useRef(dialogOpen);

  useEffect(() => {
    if (dialogOpen && !prevDialogOpen.current && operation?.id) {
      setRawValor(operation.value ?? 0);
      setDate(operation.date ?? new Date());
      setPagoSelected(operation.is_paid ?? true);
      setFixoSelected((operation.period_id ?? undefined) === 3);
      setFixoStartInput(
        operation.start_date
          ? `${String(operation.start_date.getMonth() + 1).padStart(2, '0')}/${String(operation.start_date.getFullYear()).slice(-2)}`
          : operation.date
            ? `${String(operation.date.getMonth() + 1).padStart(2, '0')}/${String(operation.date.getFullYear()).slice(-2)}`
            : ""
      );
      setFixoEndInput(
        operation.end_date
          ? `${String(operation.end_date.getMonth() + 1).padStart(2, '0')}/${String(operation.end_date.getFullYear()).slice(-2)}`
          : ""
      );
    }
    prevDialogOpen.current = dialogOpen;
  }, [dialogOpen, operation?.id]);

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setRawValor(Number(value));
  };
  const handleSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const len = input.value.length;
    input.setSelectionRange(len, len);
  };

  const formatMonthInput = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return digits.slice(0, 2) + "/" + digits.slice(2);
  };

  const parseMonthInput = (value: string): { month: number; year: number } | null => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length !== 4) return null;
    const month = parseInt(cleaned.slice(0, 2), 10);
    const year = 2000 + parseInt(cleaned.slice(2, 4), 10);
    if (month < 1 || month > 12) return null;
    return { month, year };
  };

  const handleStartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMonthInput(e.target.value);
    setFixoStartInput(formatted);
    const parsed = parseMonthInput(formatted);
    if (formatted.length === 5 && !parsed) {
      setFixoStartError("Data inválida. Use MM/AA");
    } else {
      setFixoStartError(null);
    }
  };

  const handleEndInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMonthInput(e.target.value);
    setFixoEndInput(formatted);
    const parsed = parseMonthInput(formatted);
    if (formatted.length === 5 && !parsed) {
      setFixoEndError("Data inválida. Use MM/AA");
    } else {
      setFixoEndError(null);
    }
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
        setFixoStartInput("")
        setFixoEndInput("")
        setFixoStartError(null)
        setFixoEndError(null)
        setDialogOpen(false);
      }, 0);
    } else {
      if (state) {
        toast.error(state.message || "Erro desconhecido. Verifique os campos.");
      }
    }
  }, [state, router]);

  const parsedStart = parseMonthInput(fixoStartInput);
  const parsedEnd = fixoEndInput ? parseMonthInput(fixoEndInput) : null;

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

            <div className={`grid ${fixoSelected ? 'grid-cols-1' : 'grid-cols-2'} gap-5`}>
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

              {!fixoSelected && (
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
              )}

              {!state?.success && (
                <>
                  <p className="text-sm text-red-500">
                    {state?.errors?.value || ""}
                  </p>
                  <p className="text-sm text-red-500">
                    {state?.errors?.parcelas || ""}
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
              {fixoSelected ? (
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-3">
                    <Label>Mês de início</Label>
                    <Input
                      value={fixoStartInput}
                      onChange={handleStartInputChange}
                      placeholder="MM/AA"
                      className={fixoStartError ? "border-red-500" : ""}
                    />
                    {fixoStartError && (
                      <p className="text-sm text-red-500">{fixoStartError}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label>Mês de fim (opcional)</Label>
                    <Input
                      value={fixoEndInput}
                      onChange={handleEndInputChange}
                      placeholder="MM/AA"
                      className={fixoEndError ? "border-red-500" : ""}
                    />
                    {fixoEndError && (
                      <p className="text-sm text-red-500">{fixoEndError}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="date">Data</Label>
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
                  {!state?.success && (
                    <p className="text-sm text-red-500">
                      {state?.errors?.date || ""}
                    </p>
                  )}
                </div>
              )}

              <input
                type="hidden"
                name="date"
                value={
                  fixoSelected && parsedStart
                    ? new Date(parsedStart.year, parsedStart.month - 1, 1).toISOString()
                    : date.toISOString()
                }
              />
              {fixoSelected && (
                <>
                  <input
                    type="hidden"
                    name="start_date"
                    value={
                      parsedStart
                        ? new Date(parsedStart.year, parsedStart.month - 1, 1).toISOString()
                        : ""
                    }
                  />
                  <input
                    type="hidden"
                    name="end_date"
                    value={
                      parsedEnd
                        ? new Date(parsedEnd.year, parsedEnd.month - 1, 1).toISOString()
                        : ""
                    }
                  />
                </>
              )}

              <div className="flex flex-col gap-3 mt-4">
                <Label>Tipo</Label>
                <div className={`grid ${fixoSelected ? 'grid-cols-1' : 'grid-cols-2'} rounded-lg border overflow-hidden`}>
                  {!fixoSelected && (
                  <button
                    type="button"
                    onClick={() => setPagoSelected(!pagoSelected)}
                    className={`py-3 text-sm font-medium transition-all ${
                      pagoSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    Pago
                  </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setFixoSelected(!fixoSelected)}
                    className={`py-3 text-sm font-medium transition-all ${
                      fixoSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    Fixo
                  </button>
                </div>
                <input type="hidden" name="is_paid" value={pagoSelected ? "true" : "false"} />
                <input type="hidden" name="is_fixo" value={fixoSelected ? "true" : "false"} />
              </div>

              {!state?.success && (
                <>
                  <p className="text-sm text-red-500">
                    {state?.errors?.is_paid || ""}
                  </p>
                  <p className="text-sm text-red-500">
                    {state?.errors?.period_id || ""}
                  </p>
                </>
              )}
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
