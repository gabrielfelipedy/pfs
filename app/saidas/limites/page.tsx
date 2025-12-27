import LimitDialog from "@/components/shared/LimitDialog";
import React from "react";
import { createExpenseLimit } from "./actions/limits";
import { getExpensesLimit } from "@/db/queries/limits";
import { LimitsDataTable } from "@/components/data-table/LimitDataTable";
import ErrorLoading from "@/components/error/ErrorLoading";

const page = async () => {
  let data;
  try {
    data = await getExpensesLimit();
  } catch (error) {
    return <ErrorLoading />;
  }
  console.log(data);

  return (
    <div>
      <LimitDialog
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
