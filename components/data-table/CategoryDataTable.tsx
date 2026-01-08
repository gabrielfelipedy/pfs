"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";

import { X, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { Category, ExpenseLimit } from "@/lib/definitions";
import { Badge } from "../ui/badge";
import { updateExpenseLimit } from "@/app/(main)/saidas/limites/actions/limits";
import LimitDialog from "../dialogs/LimitDialog";
import ConfirmDeleteLimitDialog from "../dialogs/confirmDeleteLimitDialog";

export const columns: ColumnDef<Category>[] = [
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
      return <div>{row.original.name}</div>;
    },
  },
  /* {
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
  }, */
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => {
      return (
        <div className="flex gap-4">
          teste
          {/* <LimitDialog
            buttonVariation="outline"
            dialogTitle="Atualizar Limite"
            dialogDescription="Atualize as informações do limite"
            buttonText="Atualizar"
            limit={row.original}
            actionFunction={updateExpenseLimit}
          >
            <Pencil />
          </LimitDialog> */}
          {/* <UpdateSaidaDialog operation={row.original} /> */}
          {/* <ConfirmDeleteLimitDialog expenseLimit={row.original} /> */}
        </div>
      );
    },
  },
];

interface Props {
  categories: Category[];
}

export function CategoryDataTable({ categories }: Props) {
  return <DataTable columns={columns} data={categories} />;
}