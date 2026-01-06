"use client";

import { useEffect, useState } from "react";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";

import { Period } from "@/lib/definitions";

import { getPeriods } from "@/db/queries/period";
import { fetchPeriodsAction } from "@/actions/selectors";

interface Props {
  period_id: number | undefined;
}

const PeriodSelector = ({ period_id }: Props) => {
  /* let categories;

    try {
        categories = is_income ? await getIncomeCategories() : await getExpenseCategories()
    }
    catch(error)
    {
        return <ErrorLoading />
    }

    console.log(categories) */

  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedValue, setSelectedValue] = useState<number | undefined>(
    period_id
  );

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const data = await fetchPeriodsAction();
        setPeriods(data);

        if (period_id) setSelectedValue(period_id);
      } catch (error) {
        console.error("Error loading categories");
      } finally {
        setLoading(false);
        //console.log(categories)
      }
    }
    load();
  }, [period_id]);

  return (
    <NativeSelect
      name="period_id"
      value={selectedValue}
      onChange={(e) => setSelectedValue(Number(e.target.value))}
      disabled={loading}
    >
      <NativeSelectOption value={undefined}>
        {loading ? "Carregando..." : "Sem período"}
      </NativeSelectOption>
      {periods.map((period) => (
        <NativeSelectOption key={period.id} value={period.id}>
          {period.name}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
};

export default PeriodSelector;