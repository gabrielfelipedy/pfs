"use client";

import React, { useEffect, useState } from "react";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";
import ErrorLoading from "../error/ErrorLoading";
import {
  getExpenseCategories,
  getIncomeCategories,
} from "@/db/queries/category";
import { Category } from "@/lib/definitions";
import { capitalizeFirstLetter } from "@/lib/utils";

interface Props {
  category_id: number | undefined;
  is_income: boolean;
}

const CategorySelector = ({ category_id, is_income }: Props) => {
  /* let categories;

    try {
        categories = is_income ? await getIncomeCategories() : await getExpenseCategories()
    }
    catch(error)
    {
        return <ErrorLoading />
    }

    console.log(categories) */

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedValue, setSelectedValue] = useState<number | undefined>(category_id)

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const type = is_income ? "income" : "expense";
        const res = await fetch(`/api/categories?type=${type}`);
        const data = await res.json();
        setCategories(data)

        if(category_id) setSelectedValue(category_id)
        
      } catch (error) {
        console.error("Error loading categories");
      } finally {
        setLoading(false);
        //console.log(categories)
      }
    }
    load();
  }, [is_income, category_id]);


  return (
    <NativeSelect name="category_id" value={selectedValue} onChange={(e) => setSelectedValue(Number(e.target.value))} disabled={loading}>

      <NativeSelectOption value={undefined}>
        {loading ? "Carregando..." : "Sem categoria"}
      </NativeSelectOption>
      {categories.map((cat) => (
        <NativeSelectOption key={cat.id} value={cat.id}>
          {capitalizeFirstLetter(cat.name)}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
};

export default CategorySelector;
