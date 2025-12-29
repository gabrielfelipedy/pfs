import * as z from "zod";

export type Operation = {
  id?: number;
  name?: string;
  description?: string | null;
  value?: number | null;
  date?: Date | null;
  is_paid?: boolean | null;
  is_income?: boolean | null;
  category_id?: number | null;
  category_name?: string | null;
  created_at?: Date;
  updated_at?: Date | null;
};

export type ExpenseLimit = {
  id?: number;
  name?: string;
  description?: string | null;
  value?: number | null;
  recursive?: boolean | null;
  start_date: Date | null;
  end_date: Date | null;
  category_id?: number | null;
  category_name?: string | null;
  created_at?: Date;
  updated_at?: Date | null;
  spend?: number | null;
};

export type Category = {
  id?: number;
  name: string;
  description: string;
  is_income: boolean;
};

export type ChartData = { total_value: number; date: string };

export type OperationBalance = {
  category_id?: number | null;
  name: string | null;
  value: number;
};

export const LoginFormSchema = z.object({
  username: z.string().lowercase().trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});