import * as z from "zod";
 
export const LoginFormSchema = z.object({
  username: z.string().lowercase().trim(),
  password: z.string().min(8, { message: "Password must be at least 8 characters long"})
});