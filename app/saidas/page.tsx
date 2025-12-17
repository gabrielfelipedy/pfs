import DataTableSaidas from "@/components/data-table/DataTableSaidas";
import MonthlySaidas from "./monthlySaidas";
import FormDialog from "./FormDialog";
import { createSaida } from "./actions";

const Saidas = () => {
  
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
        <DataTableSaidas />
      </div>
    </div>
  );
};

export default Saidas;
