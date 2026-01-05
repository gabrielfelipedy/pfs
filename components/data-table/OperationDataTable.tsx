"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";

import { X, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { capitalizeFirstLetter, formatter } from "@/lib/utils";
import { Pencil } from "lucide-react";
import ConfirmDeleteDialog from "@/components/shared/confirmDeleteDialog";
import FormDialog from "@/components/dialogs/FormDialog";
import { Operation } from "@/lib/definitions";
import { updateSaida } from "@/actions/expense-actions";
import { updateIncome } from "@/actions/income-actions";
import { Badge } from "../ui/badge";

export const columns: ColumnDef<Operation>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateValue = row.getValue("date") as string;

      try {
        return <div>{new Date(dateValue).toLocaleDateString("pt-BR")}</div>;
      } catch (error) {
        return <div>Invalid Date</div>;
      }
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Valor
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const valor = row.getValue("value") as number;

      return <div>{formatter.format(valor / 100)}</div>;
    },
  },
  {
    accessorKey: "is_paid",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pago?
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isPaid = row.getValue("is_paid");
      const variant = isPaid ? "text-green-600" : "text-red-600";

      return <div className={variant}>{isPaid ? <Check /> : <X />}</div>;
    },
  },
  {
    accessorKey: "is_income",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Entrada?
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isIncome = row.getValue("is_income");
      const variant = isIncome ? "text-green-600" : "text-red-600";

      return <div className={variant}>{isIncome ? <Check /> : <X />}</div>;
    },
  },
  {
    accessorKey: "category_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Categoria
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Badge>
          {capitalizeFirstLetter(row.original.category_name ?? "sem categoria")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "payment_method_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Meio de pagamento
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Badge>
          {capitalizeFirstLetter(
            row.original.payment_method_name ?? "sem método de pagamento"
          )}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => {
      return (
        <div className="flex gap-4">
          <FormDialog
            openDialogText={<Pencil />}
            buttonVariation="outline"
            dialogTitle={`Atualizar ${
              row.original.is_income ? "Entrada" : "Gasto"
            }`}
            dialogDescription={`Atualize as informações ${
              row.original.is_income ? "da Entrada" : "do Gasto"
            }`}
            buttonText="Atualizar"
            operation={row.original}
            actionFunction={row.original.is_income ? updateIncome : updateSaida}
          />
          {/* <UpdateSaidaDialog operation={row.original} /> */}
          <ConfirmDeleteDialog id={row.original.id} />
        </div>
      );
    },
  },
];

interface Props {
  operations: Operation[];
}

export default function OperationDataTable({ operations }: Props) {
  return <DataTable columns={columns} data={operations} />;
}
