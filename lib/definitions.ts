import * as z from "zod";
 
export const LoginFormSchema = z.object({
  username: z.string().lowercase().trim(),
  password: z.string().min(8, { message: "Password must be at least 8 characters long"})
});

export const SaidaSchema = z.object({
  name: z.string().trim(),
  description: z.string(),
  date:  z.iso.datetime({ offset: true }),
  valor: z.number().min(0, { message: "Valor must be a positive number" }),
  is_paid: z.boolean(),
  categoria_id: z.number().int().positive({ message: "Category ID must be a positive integer" })
});