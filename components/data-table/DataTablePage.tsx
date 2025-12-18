import OperationDataTable from "./columns";
import { getOperations } from "@/db/queries/expenses";

export default async function DataTablePage() {
  //const data: Operation[] = await getOperations();
  const data = await getOperations()

  return (
    <>
      <OperationDataTable operations={data} />
    </>
  );
}