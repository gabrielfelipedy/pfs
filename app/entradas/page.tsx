import FormDialog from "../saidas/FormDialog";
import { createEntrada } from "@/actions/entrada-actions";
import { getEntradas } from "@/lib/db";
import { Operation } from "@/lib/definitions";
import OperationDataTable from "@/components/data-table/columns";
import MonthlyEntradas from "../saidas/monthlyEntradas";


const Entradas = async () => {

  const data: Operation[] = await getEntradas();

  return (
    <div>
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

      <div className="mt-8">
        <MonthlyEntradas />
      </div>

      <div className="mt-10">
        <OperationDataTable operations={data} />
      </div>
    </div>
  );
};

export default Entradas;
