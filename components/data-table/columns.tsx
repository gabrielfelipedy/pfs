"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";

import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { formatter } from "@/lib/utils";
import { Pencil } from "lucide-react";
import ConfirmDeleteDialog from "@/app/saidas/confirmDeleteDialog";
import FormDialog from "@/app/saidas/FormDialog";
import { Operation } from "@/lib/definitions";
import { updateSaida } from "@/actions/saida-actions";

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

      // need to convert from UTC to -3 timezone
      const dateValue = row.getValue("date") as string;

      try {
      return <div>{new Date(dateValue).toLocaleDateString()}</div>;
      }
      catch (error) {
        return <div>Invalid date</div>;
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
      return <div>{row.getValue("is_paid") === true ? "SIM" : "NÃO"}</div>;
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
      return <div>{row.getValue("is_income") === true ? "SIM" : "NÃO"}</div>;
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
            buttonVariation='outline'
            dialogTitle="Atualizar Gasto"
            dialogDescription="Atualize as informações do gasto"
            buttonText="Atualizar"
            operation={undefined}
            actionFunction={updateSaida}
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
