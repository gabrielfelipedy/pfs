"use client";

import { useEffect, useState } from "react";

import { Period } from "@/lib/definitions";

import { fetchPeriodsAction } from "@/actions/selectors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  period_id: number | undefined;
}

const PeriodSelector = ({ period_id }: Props) => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    period_id?.toString()
  );

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const data = await fetchPeriodsAction();
        setPeriods(data);

        if (period_id) setSelectedValue(period_id.toString());
      } catch {
        console.error("Error loading periods");
      } finally {
        setLoading(false);
        //console.log(periods)
      }
    }
    load();
  }, [period_id]);

  return (
    <Select
      name="period_id"
      value={selectedValue}
      onValueChange={setSelectedValue}
      disabled={loading}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={loading ? "Carregando..." : "Sem período"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Sem período</SelectItem>
        {periods.map((period) => (
          <SelectItem key={period.id} value={String(period.id)}>
            {period.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PeriodSelector;