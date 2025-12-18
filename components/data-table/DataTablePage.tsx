import { getOperations } from "@/lib/db";
import React from "react";
import OperationDataTable from "./columns";
import { Operation } from "@/lib/definitions";

export default async function DataTablePage() {
  const data: Operation[] = await getOperations();
  console.log(data)

  return (
    <>
      <OperationDataTable operations={data} />
    </>
  );
}
