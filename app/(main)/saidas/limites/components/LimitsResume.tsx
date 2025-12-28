import { ExpenseLimit, OperationBalance } from "@/lib/definitions";
import { ExpenseProprtion } from "../page";
import { Progress } from "@/components/ui/progress";
import { formatter } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface Props {
    className?: string;
  expenseLimits: ExpenseLimit[];
  expensesBalance: ExpenseProprtion[];
}

const LimitsResume = ({ className, expenseLimits, expensesBalance }: Props) => {
  //console.log(expenseLimits)
  //console.log(expensesBalance)

  const balanceMap = new Map(
    expensesBalance.map((item) => [item.category_id, item.total])
  );

  const mergedData = expenseLimits.map((item) => ({
    ...item,
    spend: balanceMap.get(item.category_id ?? 0) ?? 0,
  }));

  return (
    <div className={`${className} grid gap-4 grid-cols-1 md:grid-cols-2 w-full`}>
      {mergedData.map((item) => {
        const progress = Math.round((item.spend / (item.value ?? 1)) * 100);

        const progressColor =
          progress < 40
            ? "[&>div]:bg-green-500"
            : progress < 75
            ? "[&>div]:bg-yellow-500"
            : "[&>div]:bg-red-500";

        const spanColor =
          progress < 40
            ? "text-green-500"
            : progress < 75
            ? "text-yellow-500"
            : "text-red-500";

        return (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-normal text-black/60">
                {item.category_name}
              </CardTitle>
              <DollarSign />
            </CardHeader>
            <CardContent>
              <div className="text-[1.8rem] font-bold">
                {formatter.format(item.spend / 100)}
              </div>

              <Progress className={progressColor} value={progress} />

              <div className="flex justify-between mt-3">
                <span className="text-md text-black/50 dark:text-white/70">
                  {progress}%
                </span>

                <span className="text-sm text-black/50 dark:text-white/70">
                  {formatter.format(item.spend / 100)} de{" "}
                  {formatter.format((item.value ?? 0) / 100)}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default LimitsResume;
