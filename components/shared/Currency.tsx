import { formatter } from "@/lib/utils";

export function Currency({ value }: { value: number }) {
  return <span>{formatter.format(value/100)}</span>;
}