import React from "react";
import { formatter } from "@/lib/utils";

interface Props {
  title: string;
  currencyValue: number;
  currencyTextClassName?: string;
}

const Costs = ({ title, currencyValue, currencyTextClassName }: Props) => {
  return (
    <div>
      <p>{title}</p>
      <h1 className={`${currencyTextClassName} font-bold`}>
        {formatter.format(currencyValue)}
      </h1>
    </div>
  );
};

export default Costs;
