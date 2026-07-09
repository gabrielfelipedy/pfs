"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";

import { ChevronsUpDown, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { capitalizeFirstLetter, formatter } from "@/lib/utils";
import ConfirmDeleteDialog from "@/components/dialogs/confirmDeleteDialog";
import FormDialog from "@/components/dialogs/FormDialog";
import { Operation } from "@/lib/definitions";
import { updateSaida } from "@/actions/expense-actions";
import { updateIncome } from "@/actions/income-actions";
import { Badge } from "../ui/badge";
import { ClientDateTime } from "../shared/ClientDateTime";

interface Props {
  operations: Operation[];
}

export const columns: ColumnDef<Operation>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nome
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "start_date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Início
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const startDate = row.original.start_date ?? row.original.date;
      return <ClientDateTime date={startDate} format="monthYear" />;
    },
  },
  {
    accessorKey: "end_date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Fim
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const endDate = row.original.end_date;
      if (!endDate) return <span>&mdash;</span>;
      return <ClientDateTime date={endDate} format="monthYear" />;
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Valor
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const valor = row.getValue("value") as number;
      return <div>{formatter.format(valor / 100)}</div>;
    },
  },
  {
    accessorKey: "category_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Categoria
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Badge variant="secondary">
        {capitalizeFirstLetter(row.original.category_name ?? "sem categoria")}
      </Badge>
    ),
  },
  {
    accessorKey: "payment_method_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Meio de pagamento
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Badge variant="secondary">
        {capitalizeFirstLetter(
          row.original.payment_method_name ?? "sem método de pagamento"
        )}
      </Badge>
    ),
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <div className="flex gap-4">
        <FormDialog
          openDialogText={<Pencil />}
          buttonVariation="outline"
          dialogTitle={`Atualizar ${row.original.is_income ? "Entrada" : "Gasto"}`}
          dialogDescription={`Atualize as informações ${row.original.is_income ? "da Entrada" : "do Gasto"}`}
          buttonText="Atualizar"
          operation={row.original}
          actionFunction={row.original.is_income ? updateIncome : updateSaida}
        />
        <ConfirmDeleteDialog operation={row.original} />
      </div>
    ),
  },
];

export default function FixedExpensesDataTable({ operations }: Props) {
  return <DataTable columns={columns} data={operations} />;
}
