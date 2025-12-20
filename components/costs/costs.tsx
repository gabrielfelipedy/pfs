import { formatter } from "@/lib/utils";
import { MoveDown } from "lucide-react";

interface Props {
  title: string;
  currencyValue: number;
}

const Costs = ({ title, currencyValue }: Props) => {
  return (
    <div>
      <p className="text-sm">{title}</p>

      <div className="flex items-center gap-2">
        <MoveDown />

        <span className="text-[2.2rem] sm:text[4rem] font-bold text-slate-700">
        {formatter.format(currencyValue)}
        </span>
      </div>
    </div>
  );
};

export default Costs;