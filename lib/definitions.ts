import * as z from "zod";

export type Operation = {
  id: number;
  name: string;
  description: string | null;
  value: number | null;
  date: string | null;
  is_paid: boolean | null;
  is_income: boolean | null;
  category_id: number | null;
  createdAt: string;
  updatedAt: Date | null;
};

export type Categoria = {
  id?: number;
  name: string;
  description: string;
  is_entrada: boolean;
};

export type ChartData = {
  dia: string;
  valor_total: number;
};

export type DataProportion = {
  type: string;
  value: number;
};

export const LoginFormSchema = z.object({
  username: z.string().lowercase().trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});
