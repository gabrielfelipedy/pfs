import { TrendingUpIcon } from "lucide-react";

import CardResume from "./card-resume";

import { Operation } from "@/lib/definitions";
import { operationValue } from "@/lib/parcelamento";
import { filterOperationsByMonth } from "@/lib/date";

interface Props {
  operations: Operation[];
  month: string;
  className?: string;
}

const BalanceCard = ({ operations, month, className }: Props) => {
  const balance = filterOperationsByMonth(operations, month).reduce(
    (sum, op) => sum + (op.is_income ? operationValue(op) : -operationValue(op)),
    0
  );

  return (
    <div className={`${className} grid gap-4 grid-cols-1 lg:grid-cols-3 w-full`}>
      <CardResume
        title="Saldo mensal"
        icon={<TrendingUpIcon className="h-4 w-4 text-muted-foreground" />}
        data={balance}
        subtext="No último mês"
        is_income={balance > 0}
      />
    </div>
  );
};

export default BalanceCard;
