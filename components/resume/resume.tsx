import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

import CardResume from "./card-resume";

import { Operation } from "@/lib/definitions";
import { operationValue } from "@/lib/parcelamento";

interface Props {
  operations: Operation[];
  className?: string;
  children?: React.ReactNode;
}


const Resume = async ({ operations, className, children }: Props) => {

  const balance = operations.reduce(
    (sum, op) => sum + (op.is_income ? operationValue(op) : -operationValue(op)),
    0
  );
  const incomes = operations
    .filter((op) => op.is_income)
    .reduce((sum, op) => sum + operationValue(op), 0);
  const expenses = operations
    .filter((op) => !op.is_income)
    .reduce((sum, op) => sum + operationValue(op), 0);

  return (
    <div className={`${className} w-full py-6 flex flex-col gap-5`}>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 w-full ">
        <CardResume
          title="Saldo mensal"
          icon={<TrendingUpIcon className="h-4 w-4 text-muted-foreground" />}
          data={balance}
          subtext="No último mês"
          is_income={balance > 0}
        />

        <CardResume
          title="Entradas mensais"
          icon={<TrendingUpIcon className="h-4 w-4 text-muted-foreground" />}
          data={incomes}
          subtext="No último mês"
          is_income={true}
        />
      
     
        <CardResume
          title="Gastos mensais"
          icon={<TrendingDownIcon className="h-4 w-4 text-muted-foreground" />}
          data={expenses}
          subtext="No último mês"
        />

        {children}
     </div>
    </div>
  );
};

export default Resume;