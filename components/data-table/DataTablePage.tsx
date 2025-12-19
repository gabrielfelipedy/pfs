//import { createExpenseBalanceView, createIncomeBalanceView } from "@/db/queries/views";
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
    return <div className="p-4 text-red-500">Erro ao carregar dados.</div>;
  }

  return (
    <>
      <OperationDataTable operations={data} />
    </>
  );
}