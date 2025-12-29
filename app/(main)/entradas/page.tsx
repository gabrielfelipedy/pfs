import FormDialog from "../../../components/dialogs/FormDialog";
import { createEntrada } from "@/actions/income-actions";
import { Operation } from "@/lib/definitions";
import OperationDataTable from "@/components/data-table/OperationDataTable";
import MonthlyEntradas from "./monthlyEntradas";
import { getIncomes } from "@/db/queries/incomes";
import ErrorLoading from "@/components/error/ErrorLoading";

const emptyOperation: Operation = {
  is_income: true,
};

const Entradas = async () => {
  let data: Operation[];

  try {
    const result = await getIncomes();
    data = result;
  } catch (error) {
    return <ErrorLoading />;
  }

  return (
    <>
      <h1 className="text-[3rem] font-bold mt-10">Entradas</h1>
      <p className="text-xl text-slate-600">Todos os registros de entradas</p>

      <MonthlyEntradas className="mt-4" />

      <div className="mt-10">
        {/* <CreateSaidaDialog /> */}
        <FormDialog
          openDialogText="Adicionar entrada"
          dialogTitle="Adicionar entrada"
          dialogDescription="Preencha as informações da entrada"
          buttonText="Adicionar"
          operation={emptyOperation}
          actionFunction={createEntrada}
        />
      </div>

      <div className="mt-2">
        <OperationDataTable operations={data} />
      </div>
    </>
  );
};

export default Entradas;
