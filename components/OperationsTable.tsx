import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOperations, Operation } from "@/lib/db";

//import { query } from "@/lib/db";

const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default async function OperationsTable() {
  let data: Operation[] = [];

  try {
    //const sqlQuery = "SELECT * FROM operation;";
    //const result = await query(sqlQuery);

    const result = await getOperations();
    console.log(result);
    data = result;
  } catch (error) {
    console.error("Database Query Failed", error);
  }

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      accessorKey: "description",
      header: "Descrição",
    },
    {
      accessorKey: "date",
      header: "Data",
    },
    {
      acessorKey: "valor",
      header: "Valor",
    },
    {
      acessorKey: "is_paid",
      header: "Pago?",
    },
    {
      acessorKey: "is_entrada",
      header: "Entrada?",
    },
    {
      acessorKey: "category_id",
      header: "Categoria",
    },
  ];

  return (
    <Table>
      <TableCaption>Operations</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead>Data</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((operation) => (
            // Ensure you use a stable unique key (like category.id)
            <TableRow key={operation.id}>
              <TableCell className="font-medium">{operation.id}</TableCell>
              <TableCell>{operation.name}</TableCell>
              <TableCell className="text-right">
                {formatter.format(operation.valor / 100)}
              </TableCell>
              <TableCell>{operation.date.toLocaleDateString()}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4">
              No operations.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}