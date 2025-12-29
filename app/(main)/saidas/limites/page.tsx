import LimitDialog from "@/components/shared/LimitDialog";
import { createExpenseLimit } from "./actions/limits";
import { getExpensesLimitBalance } from "@/db/queries/limits";
import { LimitsDataTable } from "@/components/data-table/LimitDataTable";
import ErrorLoading from "@/components/error/ErrorLoading";
import LimitsResume from "./components/LimitsResume";

export type ExpenseProprtion = {
  category_id: number | null;
  category_name: string;
  total: number;
};

const page = async () => {
  let data

  try {
    data = await getExpensesLimitBalance()
  } catch (error) {
    return <ErrorLoading />;
  }

  //console.log(expense_limits);

  return (
    <div>

      <h1 className="title">Limites por categoria</h1>

      <LimitsResume
      className="mt-10"
        data={data}
      />

      <LimitDialog
        className="mt-10"
        openDialogText="Novo limite de gasto"
        dialogTitle="Limite de gasto"
        dialogDescription="Preencha as informações do limite"
        buttonText="Adicionar"
        limit={undefined}
        actionFunction={createExpenseLimit}
      />

      <LimitsDataTable limits={data} />

      <p>Definir limite total</p>
      <p>Limites por categoria</p>
    </div>
  );
};

export default page;