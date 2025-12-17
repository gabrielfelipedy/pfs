import CreateSaidaDialog from "@/app/saidas/createSaidaDialog";
import DataTableSaidas from "@/components/data-table/DataTableSaidas";
import React from "react";

const Saidas = () => {
  return (
    <div>
      <h1 className="text-[3rem] font-bold mt-10">Saídas</h1>
      <p className="text-xl text-slate-600">Todos os registros de saídas</p>

      <div className="mt-10">
        <CreateSaidaDialog />
      </div>

      <div className="mt-10">
        <DataTableSaidas />
      </div>
    </div>
  );
};

export default Saidas;
