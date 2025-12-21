import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatter } from "@/lib/utils";

interface Props {
  title: string;
  icon: ReactNode;
  data: number;
  subtext: string;
  is_income?: boolean;
}

const CardResume = ({ title, icon, data, subtext, is_income }: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`${is_income ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'} text-2xl font-bold`}>{formatter.format(data/100)}</div>
        <p className="text-xs text-muted-foreground">{subtext}</p>
      </CardContent>
    </Card>
  );
};

export default CardResume;
