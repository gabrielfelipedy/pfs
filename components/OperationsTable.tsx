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

import { query } from "@/lib/db";

export default async function OperationsTable() {

    let data = []

  try {
    const sqlQuery = "SELECT * FROM operation;";
    const result = await query(sqlQuery);

    console.log(result.rows);
    data = result.rows
  } catch (error) {
    console.log("Database Query Failed");
  }

  return (
    <Table>
      <TableCaption>
        Operations
      </TableCaption>
      <TableHeader>
        <TableRow>
          {/* Update Table Headers to match the database columns */}
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead className="text-right">Valor</TableHead>{" "}
          {/* Placeholder column */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Map over the 'categories' array which now holds the DB data */}
        {data.length > 0 ? (
          data.map((operation) => (
            // Ensure you use a stable unique key (like category.id)
            <TableRow key={operation.id}>
              <TableCell className="font-medium">{operation.id}</TableCell>
              <TableCell>{operation.name}</TableCell>
              <TableCell className="text-right">{operation.valor}</TableCell>
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
      {/* You can remove or modify the TableFooter as it's not relevant for this data */}
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Categories</TableCell>
          <TableCell className="text-right">{data.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
