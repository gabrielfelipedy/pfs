"use client";

import { useEffect, useState } from "react";

import { Category } from "@/lib/definitions";
import { capitalizeFirstLetter } from "@/lib/utils";
import { fetchCategoriesAction } from "@/actions/selectors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  category_id: number | undefined;
  is_income: boolean;
}

const CategorySelector = ({ category_id, is_income }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    category_id?.toString()
  );

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const data = await fetchCategoriesAction(is_income);
        setCategories(data);

        if (category_id) setSelectedValue(category_id.toString());
      } catch {
        console.error("Error loading categories");
      } finally {
        setLoading(false);
        //console.log(categories)
      }
    }
    load();
  }, [is_income, category_id]);

  return (
    <Select
      name="category_id"
      value={selectedValue}
      onValueChange={setSelectedValue}
      disabled={loading}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={loading ? "Carregando..." : "Sem categoria"}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Sem categoria</SelectItem>
        {categories.map((cat) => (
          <SelectItem key={cat.id} value={String(cat.id)}>
            {capitalizeFirstLetter(cat.name)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategorySelector;