import * as z from "zod";

export const OperationSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name cannot be empty" }).trim(),
  description: z.string().optional(),
  date: z.coerce.date(),

  value: z.number().min(0, { message: "Valor must be a positive number" }),
  is_paid: z.boolean(),
  is_income: z.boolean(),
  category_id: z
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
        value?: string[];
        is_paid?: string[];
        category_id?: string[];
      };
    };
