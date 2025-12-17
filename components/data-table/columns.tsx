"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Operation } from "@/lib/db";
import { DataTable } from "../ui/data-table";

import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { formatter } from "@/lib/utils";
import UpdateSaidaDialog from "@/app/saidas/updateSaidaDialog";
import { deleteOperation } from "@/app/saidas/actions";
import { toast } from "sonner";

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
      const dateValue = row.getValue("date") as Date;

      if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
        return <div>{dateValue.toLocaleDateString()}</div>;
      }

      return <div>Invalid Date</div>;
    },
  },
  {
    accessorKey: "valor",
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
      const valor = row.getValue("valor") as number;

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
    accessorKey: "is_entrada",
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
      return <div>{row.getValue("is_entrada") === true ? "SIM" : "NÃO"}</div>;
    },
  },
  {
    accessorKey: "categoria_id",
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
      return <div>{row.getValue("categoria_id")}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => {
      return (
        <div className="flex gap-4">
          {/* <UpdateSaidaDialog operation={row.original} /> */}
          <Button
            variant="destructive"
            onClick={async () => {
              try {
                await deleteOperation(row.original.id);
                toast.success("Deleted successfully");
              } catch (error) {
                toast.error("Error on deleting");
              }
            }}
          >
            Deletar
          </Button>
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
