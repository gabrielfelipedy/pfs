import * as z from "zod";

export const OperationSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Nome não pode ser vazio" }).trim(),
  description: z.string().nullable().optional(),
  date: z.coerce.date({ message: "Valor precisa ser uma data" }),

  value: z.number().min(0, { message: "Valor precisa ser positivo" }),
  is_paid: z.boolean(),
  is_income: z.boolean(),
  category_id: z.preprocess((val) => {
    if (val === undefined || (typeof val === "number" && isNaN(val)))
      return null;

    return val;
  }, z.number().int().positive({ message: "Category ID tem que ser um número positivo" }).nullable()),
  payment_method_id: z
    .preprocess((val) => {
      if (val === undefined || (typeof val === "number" && isNaN(val)))
        return null;

      return val;
    }, z.number().int().positive({ message: "Payment Method ID tem que ser um número positivo" }).nullable())
    .optional(),

  period_id: z
    .preprocess((val) => {
      if (val === undefined || (typeof val === "number" && isNaN(val)))
        return null;

      return val;
    }, z.number().int().positive({ message: "Payment Method ID tem que ser um número positivo" }).nullable())
    .optional(),
});

export type OperationActionState =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message?: string;
      errors?: {
        name?: string[];
        description?: string[];
        date?: string[];
        value?: string[];
        is_paid?: string[];
        category_id?: string[];
        payment_method_id?: string[];
        period_id?: string[];
      };
    };
