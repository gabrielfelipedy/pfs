//import { createExpenseBalanceView, createIncomeBalanceView } from "@/db/queries/views";
import ErrorLoading from "../error/ErrorLoading";
import OperationDataTable from "./columns";
import { getOperations } from "@/db/queries/operation";

export default async function DataTablePage() {
  let data;

  try {
    const result = await getOperations();
    data = result;
    //await createExpenseBalanceView()
    //await createIncomeBalanceView()
  } catch (error) {
    return <ErrorLoading />
  }

  return (
    <>
      <OperationDataTable operations={data} />
    </>
  );
}