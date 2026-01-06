"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";

import { X, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { capitalizeFirstLetter, formatter } from "@/lib/utils";
import { Pencil } from "lucide-react";
import ConfirmDeleteDialog from "@/components/dialogs/confirmDeleteDialog";
import { ExpenseLimit } from "@/lib/definitions";
import { Badge } from "../ui/badge";
import { updateExpenseLimit } from "@/app/(main)/saidas/limites/actions/limits";
import LimitDialog from "../dialogs/LimitDialog";


export const columns: ColumnDef<ExpenseLimit>[] = [
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
      const valor = row.original.value as number;

      return <div>{formatter.format(valor / 100)}</div>;
    },
  },
  {
    accessorKey: "period_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Período
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const period_name = row.original.period_name;

      return <div>{period_name ?? "Não definido"}</div>;
    },
  },
  {
    accessorKey: "category_id",
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
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => {
      return (
        <div className="flex gap-4">
          <LimitDialog
            openDialogText={<Pencil />}
            buttonVariation="outline"
            dialogTitle="Atualizar Limite"
            dialogDescription="Atualize as informações do limite"
            buttonText="Atualizar"
            limit={row.original}
            actionFunction={updateExpenseLimit}
          />
          {/* <UpdateSaidaDialog operation={row.original} /> */}
          <ConfirmDeleteDialog id={row.original.id} />
        </div>
      );
    },
  },
];

interface Props {
  limits: ExpenseLimit[];
}

export function LimitsDataTable({ limits }: Props) {
  return <DataTable columns={columns} data={limits} />;
}