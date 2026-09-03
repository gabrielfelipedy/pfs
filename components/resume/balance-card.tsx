import { TrendingUpIcon } from "lucide-react";

import CardResume from "./card-resume";

import { Operation } from "@/lib/definitions";
import { operationValue } from "@/lib/parcelamento";
import { isAtualOperation } from "@/lib/operation";
import { filterOperationsByMonth } from "@/lib/date";

interface Props {
  operations: Operation[];
  month: string;
  className?: string;
  paidOnly?: boolean;
}

const BalanceCard = ({ operations, month, className, paidOnly = false }: Props) => {
  const balance = filterOperationsByMonth(operations, month)
    .filter((op) => !paidOnly || isAtualOperation(op, month))
    .reduce(
      (sum, op) => sum + (op.is_income ? operationValue(op) : -operationValue(op)),
      0
    );

  return (
    <CardResume
      className={className}
      title="Saldo mensal"
      icon={<TrendingUpIcon className="h-4 w-4 text-muted-foreground" />}
      data={balance}
      subtext="No último mês"
      is_income={balance > 0}
    />
  );
};

export default BalanceCard;
