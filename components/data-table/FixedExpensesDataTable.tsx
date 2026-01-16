"use client";

import { useMemo } from "react"; // Added useMemo
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
  month: string;
}

export default function FixedExpensesDataTable({ operations, month }: Props) {
  // We define columns inside the component to access the 'month' prop
  const columns = useMemo<ColumnDef<Operation>[]>(() => [
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
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const originalDate = new Date(row.getValue("date"));
        
        try {
          const [year, monthIndex] = month.split("-").map(Number);
          
          const displayDate = new Date(originalDate);
          displayDate.setFullYear(year);
          displayDate.setMonth(monthIndex - 1); // JS months are 0-indexed

          return <ClientDateTime date={displayDate} />;
        } catch (error) {
          return <div>Invalid Date</div>;
        }
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
  ], [month]); // Re-render columns only if the month prop changes

  // Pass the raw operations directly
  return <DataTable columns={columns} data={operations} />;
}