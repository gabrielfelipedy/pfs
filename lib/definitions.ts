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

export const OperationSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name cannot be empty" }).trim(),
  description: z.string(),
  date: z.iso.datetime({ offset: true }),
  valor: z.number().min(0, { message: "Valor must be a positive number" }),
  is_paid: z.boolean(),
  categoria_id: z
    .number()
    .int()
    .positive({ message: "Category ID must be a positive integer" }),
});

export type OperationActionState =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message?: string;
      errors: {
        name?: string[];
        description?: string[];
        date?: string[];
        valor?: string[];
        is_paid?: string[];
        categoria_id?: string[];
      };
    };
