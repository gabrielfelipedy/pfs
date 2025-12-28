import LimitDialog from "@/components/shared/LimitDialog";
import React from "react";
import { createExpenseLimit } from "./actions/limits";
import { getExpensesLimit } from "@/db/queries/limits";
import { LimitsDataTable } from "@/components/data-table/LimitDataTable";
import ErrorLoading from "@/components/error/ErrorLoading";
import LimitsResume from "./components/LimitsResume";
import { getExpensesProportion } from "@/db/queries/expense";
import { transformOperationsProportion } from "@/lib/utils";

const page = async () => {
  let expense_limits;
  let expense_proportion;

  try {
    expense_limits = await getExpensesLimit();
    const {
      rows: [saidaProportion],
    } = await getExpensesProportion();
    expense_proportion = saidaProportion;
  } catch (error) {
    return <ErrorLoading />;
  }

  //console.log(expense_limits);
  const transformedExpensesProportion =
    transformOperationsProportion(expense_proportion);

  return (
    <div>
      <LimitsResume expenseLimits={expense_limits} expensesBalance={transformedExpensesProportion}/>

      <LimitDialog
        openDialogText="Novo limite de gasto"
        dialogTitle="Limite de gasto"
        dialogDescription="Preencha as informações do limite"
        buttonText="Adicionar"
        limit={undefined}
        actionFunction={createExpenseLimit}
      />

      <LimitsDataTable limits={expense_limits} />

      <p>Definir limite total</p>
      <p>Limites por categoria</p>
    </div>
  );
};

export default page;
