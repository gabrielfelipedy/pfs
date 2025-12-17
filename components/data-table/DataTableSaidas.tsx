import { getSaidas } from "@/lib/db";
import OperationDataTable from "./columns";
import { Operation } from "@/lib/definitions";

export default async function DataTableSaidas() {
  const data: Operation[] = await getSaidas();

  return (
    <>
      <OperationDataTable operations={data} />
    </>
  );
}
