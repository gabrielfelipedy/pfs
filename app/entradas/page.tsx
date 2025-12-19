import FormDialog from "../../components/shared/FormDialog";
import { createEntrada } from "@/actions/entrada-actions";
import { Operation } from "@/lib/definitions";
import OperationDataTable from "@/components/data-table/columns";
import MonthlyEntradas from "./monthlyEntradas";
import { getIncomes } from "@/db/queries/income";

const Entradas = async () => {
  let data: Operation[];

  try {
    const result = await getIncomes();
    data = result;
  } catch (error) {
    return <div className="p-4 text-red-500">Erro ao carregar dados.</div>;
  }

  return (
    <>
      <h1 className="text-[3rem] font-bold mt-10">Entradas</h1>
      <p className="text-xl text-slate-600">Todos os registros de entradas</p>

      <div className="mt-10">
        {/* <CreateSaidaDialog /> */}
        <FormDialog
          openDialogText="Adicionar entrada"
          dialogTitle="Adicionar entrada"
          dialogDescription="Preencha as informações da entrada"
          buttonText="Adicionar"
          operation={undefined}
          actionFunction={createEntrada}
        />
      </div>

      <MonthlyEntradas className="mt-4" />

      <div className="mt-10">
        <OperationDataTable operations={data} />
      </div>
    </>
  );
};

export default Entradas;
