//import { createExpenseBalanceView, createIncomeBalanceView } from "@/db/queries/views";
import OperationDataTable from "./columns";
import { getOperations } from "@/db/queries/operation";

export default async function DataTablePage() {
  
  const data = await getOperations()
  //await createExpenseBalanceView()
  //await createIncomeBalanceView()

  return (
    <>
      <OperationDataTable operations={data} />
    </>
  );
}