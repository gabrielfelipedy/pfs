import LimitDialog from "@/components/shared/LimitDialog";
import React from "react";
import { createExpenseLimit } from "./actions/limits";
import { getExpensesLimit } from "@/db/queries/limits";
import { LimitsDataTable } from "@/components/data-table/LimitDataTable";
import ErrorLoading from "@/components/error/ErrorLoading";
import LimitsResume from "./components/LimitsResume";
import { getExpensesProportion } from "@/db/queries/expense";
import { OperationBalance } from "@/lib/definitions";

export type ExpenseProprtion = {
  category_id: number | null;
  category_name: string;
  total: number;
};

const page = async () => {
  let expense_limits;
  let expense_proportion;

  try {
    expense_limits = await getExpensesLimit();
    expense_proportion = await getExpensesProportion();
  } catch (error) {
    return <ErrorLoading />;
  }

  //console.log(expense_limits);

  return (
    <div>

      <h1 className="title">Limites por categoria</h1>

      <LimitsResume
      className="mt-10"
        expenseLimits={expense_limits}
        expensesBalance={expense_proportion}
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

      <LimitsDataTable limits={expense_limits} />

      <p>Definir limite total</p>
      <p>Limites por categoria</p>
    </div>
  );
};

export default page;
