"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";

import { ArrowUpDown, X, Check  } from "lucide-react";
import { Button } from "../ui/button";
import { formatter } from "@/lib/utils";
import { Pencil } from "lucide-react";
import ConfirmDeleteDialog from "@/components/shared/confirmDeleteDialog";
import FormDialog from "@/components/shared/FormDialog";
import { Operation } from "@/lib/definitions";
import { updateSaida } from "@/actions/saida-actions";
import { updateIncome } from "@/actions/entrada-actions";

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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateValue = row.getValue("date") as string;

      try {
        return <div>{new Date(dateValue).toLocaleDateString('pt-BR')}</div>;
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {

      const isPaid = row.getValue("is_paid")
      const variant = isPaid ? 'text-green-600' : 'text-red-600'

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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isIncome = row.getValue("is_income")
      const variant = isIncome ? 'text-green-600' : 'text-red-600'

      return <div className={variant}>{isIncome ? <Check /> : <X />}</div>;
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.getValue("category_id")}</div>;
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
            dialogTitle="Atualizar Gasto"
            dialogDescription="Atualize as informações do gasto"
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
/* export type Operation = {
  id: number;
  name: string;
  description: string;
  date: string;
  valor: number;
  is_paid: boolean;
  is_entrada: boolean;
  category_id: number;
} */
