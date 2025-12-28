"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";

import { X, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { capitalizeFirstLetter, formatter } from "@/lib/utils";
import { Pencil } from "lucide-react";
import ConfirmDeleteDialog from "@/components/shared/confirmDeleteDialog";
import { ExpenseLimit } from "@/lib/definitions";
import { updateSaida } from "@/actions/saida-actions";
import { updateIncome } from "@/actions/entrada-actions";
import { Badge } from "../ui/badge";
import LimitDialog from "../shared/LimitDialog";
import { updateExpenseLimit } from "@/app/(main)/saidas/limites/actions/limits";

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
      return <div>{row.getValue("name")}</div>;
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
    accessorKey: "recursive",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Recursivo?
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const recursive = row.getValue("recursive");
      const variant = recursive ? "text-green-600" : "text-red-600";

      return <div className={variant}>{recursive ? <Check /> : <X />}</div>;
    },
  },
  {
    accessorKey: "start_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data de início
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateValue = row.getValue("start_date") as string;

      try {
        return <div>{new Date(dateValue).toLocaleDateString("pt-BR")}</div>;
      } catch (error) {
        return <div>Invalid Date</div>;
      }
    },
  },
  {
    accessorKey: "end_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data fim
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateValue = row.getValue("end_date") as string;

      try {
        return <div>{new Date(dateValue).toLocaleDateString("pt-BR")}</div>;
      } catch (error) {
        return <div>Invalid Date</div>;
      }
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
