import MonthlySaidas from "./monthlySaidas";
import FormDialog from "../../components/shared/FormDialog";
import { createSaida } from "@/actions/saida-actions";
import { Operation } from "@/lib/definitions";
import OperationDataTable from "@/components/data-table/columns";
import { getExpenses } from "@/db/queries/expense";

const Saidas = async () => {
  let data: Operation[];

  try {
    const result = await getExpenses();
    data = result;
  } catch (error) {
    return <div className="p-4 text-red-500">Erro ao carregar dados.</div>;
  }
  //console.log(data)

  return (
    <>
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

      <MonthlySaidas className="mt-4" />

      <div className="mt-10">
        <OperationDataTable operations={data} />
      </div>
    </>
  );
};

export default Saidas;
