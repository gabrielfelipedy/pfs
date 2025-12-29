import MonthlySaidas from "./components/monthlySaidas";
import FormDialog from "../../../components/dialogs/FormDialog";
import { createSaida } from "@/actions/expense-actions";
import { Operation } from "@/lib/definitions";
import OperationDataTable from "@/components/data-table/OperationDataTable";
import { getExpenses } from "@/db/queries/expense";
import ErrorLoading from "@/components/error/ErrorLoading";

export const dynamic = "force-dynamic";

const emptyOperation: Operation = {
  is_income: false,
};

const Saidas = async () => {
  let data: Operation[];

  try {
    const result = await getExpenses();
    data = result;
  } catch (error) {
    return <ErrorLoading />;
  }
  //console.log(data)

  return (
    <>
      <h1 className="text-[3rem] font-bold mt-10">Saídas</h1>
      <p className="text-xl text-slate-600">Todos os registros de saídas</p>

      <MonthlySaidas className="mt-4" />

      <div className="mt-10">
        {/* <CreateSaidaDialog /> */}
        <FormDialog
          openDialogText="Adicionar Gasto"
          dialogTitle="Adicionar Gasto"
          dialogDescription="Preencha as informações do gasto"
          buttonText="Adicionar"
          operation={emptyOperation}
          actionFunction={createSaida}
        />
      </div>

      <div className="mt-2">
        <OperationDataTable operations={data} />
      </div>
    </>
  );
};

export default Saidas;
