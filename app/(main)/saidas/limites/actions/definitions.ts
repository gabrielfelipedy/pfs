import * as z from "zod";

export const ExpenseLimitSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name cannot be empty" }).trim(),
  description: z.string().optional(),
  value: z.number().min(0, { message: "Valor must be a positive number" }),
  recursive: z.boolean(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  category_id: z.preprocess((val) => {
    if (val === undefined || (typeof val === "number" && isNaN(val)))
      return null;

    return val;
  }, z.number().int().positive({ message: "Category ID must be a positive integer" }).nullable()),
});

export type ExpenseLimitActionState =
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
        value?: string[];
        recursive?: string[];
        start_date?: string[];
        end_date?: string[];
        category_id?: string[];
      };
    };
