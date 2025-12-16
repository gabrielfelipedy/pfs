import { getSaidas, Operation } from "@/lib/db";
import React from "react";
import OperationDataTable from "./columns";

export default async function DataTableSaidas() {
  const data: Operation[] = await getSaidas();
  //console.log(data)

  return (
    <>
      <OperationDataTable operations={data} />
    </>
  );
}
