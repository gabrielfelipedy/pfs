"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Operation } from "@/lib/db"
import { DataTable } from "../ui/data-table"

import { ArrowUpDown } from "lucide-react"
import { Button } from "../ui/button"

const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const columns: ColumnDef<Operation>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
        return <div>{row.getValue("id")}</div>
    }
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
        return <div>{row.getValue("name")}</div>
    }
  },
  {
    accessorKey: 'description',
    header: 'Descrição',
    cell: ({row}) => {
        return <div>{row.getValue("description")}</div>
    }
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
        return <div>{row.getValue("date").toLocaleDateString()}</div>
    }
  },
  {
    accessorKey: 'valor',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Valor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
        return <div>{formatter.format(row.getValue("valor") / 100)}</div>
    }
  },
  {
    accessorKey: 'is_paid',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pago?
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
        return <div>{(row.getValue("is_paid") === true ? 'SIM' : 'NÃO')}</div>
    }
  },
  {
    accessorKey: 'is_entrada',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Entrada?
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
        return <div>{(row.getValue("is_entrada") === true ? 'SIM' : 'NÃO')}</div>
    }
  },
  {
    accessorKey: 'categoria_id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Categoria
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
        return <div>{row.getValue("categoria_id")}</div>
    }
  }
]

interface Props {
    operations: Operation[];
}

export default function OperationDataTable({operations}: Props){
    return <DataTable columns={columns} data={operations} />
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