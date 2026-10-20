import { ExpenseLimit, Operation, OperationBalance } from "@/lib/definitions";

import RadialBarChart from "@/components/charts/radialBarChart";
import LimitDialog from "@/components/dialogs/LimitDialog";
import { createExpenseLimit } from "../actions/limits";

interface Props {
  className?: string;
  expensesProportion?: OperationBalance[];
  expenseLimits?: ExpenseLimit[];
}

// HERE IS THE HEART OF THE LOGIC TO MERGE LIMITS AND PROPORTIONS, MORE COMPLEX LOGIC CAN BE ADDED HERE
const mergeData = (
  limits: ExpenseLimit[],
  expensesProportion: OperationBalance[]
): ExpenseLimit[] => {
  return limits.map((limit) => {
    const proportion = expensesProportion.find(
      (prop) => prop.name === limit.category_name
    );

    return {
      ...limit,
      spend: proportion?.value ?? 0,
    };
  });
};

const LimitsResume = ({
  className,
  expensesProportion,
  expenseLimits,
}: Props) => {
  //console.log(data)
  //console.log(expenseLimits)
  //console.log(expensesProportion)
  const data = mergeData(expenseLimits ?? [], expensesProportion ?? []);

  return (
    <div className={`${className} w-full py-6 flex flex-col gap-5`}>
      {/* <h1 className="text-2xl font-medium">Limites diários</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full ">
        {(() => {
          const dailyData = data.filter((item) => item.period_id === 1);

          if (dailyData.length === 0) {
            return (
              <p className="text-sm text-black/70 dark:text-white/70">
                Nenhum limite diário definido.
              </p>
            );
          }

          return dailyData.map((item) => (
            <RadialBarChart
              key={item.id}
              title={item.name ?? ""}
              expenseLimit={item}
            />
          ));
        })()}
      </div>

      <LimitDialog
        className="mt-10 w-fit"
        dialogTitle="Limite de gasto"
        dialogDescription="Preencha as informações do limite"
        buttonText="Adicionar"
        limit={undefined}
        actionFunction={createExpenseLimit}
      >
        Criar novo limite diário
      </LimitDialog>

      <h1 className="text-2xl font-medium">Limites semanais</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full ">
        {(() => {
          const weeklyLimits = data.filter((item) => item.period_id === 2);

          if (weeklyLimits.length === 0) {
            return (
              <p className="text-sm text-black/70 dark:text-white/70">
                Nenhum limite semanal definido.
              </p>
            );
          }

          return weeklyLimits.map((item) => (
            <RadialBarChart
              key={item.id}
              title={item.name ?? ""}
              expenseLimit={item}
            />
          ));
        })()}
      </div>

      <LimitDialog
        className="mt-10 w-fit"
        dialogTitle="Limite de gasto"
        dialogDescription="Preencha as informações do limite"
        buttonText="Adicionar"
        limit={undefined}
        actionFunction={createExpenseLimit}
      >
        Criar novo limite semanal
      </LimitDialog> */}

      <h1 className="text-2xl font-medium">Limites mensais</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full ">
        {(() => {
          const monthlyData = data.filter((item) => item.period_id === 3);

          if (monthlyData.length === 0) {
            return (
              <p className="text-sm text-black/70 dark:text-white/70">
                Nenhum limite mensal definido.
              </p>
            );
          }

          return monthlyData
            .filter((item) => item.period_id === 3)
            .map((item) => (
              <RadialBarChart
                key={item.id}
                title={item.name ?? ""}
                expenseLimit={item}
              />
            ));
        })()}
      </div>

      <LimitDialog
        className="mt-10 w-fit"
        dialogTitle="Limite de gasto"
        dialogDescription="Preencha as informações do limite"
        buttonText="Adicionar"
        limit={undefined}
        actionFunction={createExpenseLimit}
      >
        Criar novo limite mensal
      </LimitDialog>
    </div>
  );
};

export default LimitsResume;
