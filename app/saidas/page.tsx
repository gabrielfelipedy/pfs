import DataTableSaidas from "@/components/data-table/DataTableSaidas";
import MonthlySaidas from "./monthlySaidas";
import FormDialog from "./FormDialog";
import { createSaida } from "@/actions/saida-actions";
import { Operation } from "@/lib/definitions";
import { getSaidas } from "@/lib/db";
import OperationDataTable from "@/components/data-table/columns";

const Saidas = async () => {

  const data: Operation[] = await getSaidas();

  return (
    <div>
      <h1 className="text-[3rem] font-bold mt-10">Saídas</h1>
      <p className="text-xl text-slate-600">Todos os registros de saídas</p>

      <div className="mt-10">
        {/* <CreateSaidaDialog /> */}
        <FormDialog
          openDialogText="Adicionar Gasto"
          dialogTitle="Adicionar Gasto"
          dialogDescription="Preencha as informações do gasto"
          buttonText="Adicionar"
          operation={undefined}
          actionFunction={createSaida}
        />
      </div>

      <div className="mt-8">
        <MonthlySaidas />
      </div>

      <div className="mt-10">
        <OperationDataTable operations={data} />
      </div>
    </div>
  );
};

export default Saidas;
