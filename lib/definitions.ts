import * as z from "zod";

export interface Operation {
  id?: number;
  name: string;
  description?: string | null;
  value: number;
  parcelas: number,
  date: Date;
  
  is_paid?: boolean | null;
  is_income?: boolean | null;
  category_id?: number | null;
  category_name?: string | null;
  payment_method_id?: number | null;
  payment_method_name?: string | null;
  created_at?: Date;
  updated_at?: Date | null;
  period_id?: number | null;
};

export class OperationArray {

  private MONTHLY_PERIOD_ID = 3
  private INVESTIMENTO_CATEGORY_ID = 6

  constructor(private operations: Operation[]) {}

  calcSum(): number {
    return this.operations.reduce((sum, op) => sum + op.value, 0);
  }

  filterFixedOperations(): Operation[] {
    return this.operations.filter((o) => o.period_id === this.MONTHLY_PERIOD_ID)
  }

  filterVariableOperations(): Operation[] {
    return this.operations.filter((o) => o.period_id === null)
  }

  filterComprasParceladas(): Operation[] {
    return this.operations.filter((o) => o.parcelas > 1);
  }

  filterInvestimentos(): Operation[] {
    return this.operations.filter((o) => o.category_id === this.INVESTIMENTO_CATEGORY_ID);
  }

  // Add other useful methods
  getOperations(): Operation[] {
    return this.operations;
  }
}



export interface ExpenseLimit {
  id?: number;
  name?: string;
  description?: string | null;
  value?: number | null;
  start_date: Date | null;
  end_date: Date | null;
  category_id?: number | null;
  category_name?: string | null;
  period_id?: number | null;
  period_name?: string | null;
  created_at?: Date;
  updated_at?: Date | null;
  spend?: number | null;
};

export type Category = {
  id?: number;
  name: string;
  description?: string | null;
  is_income: boolean;
  created_at?: Date;
  updated_at?: Date | null;
};

export type PaymentMethod = {
  id?: number;
  name: string;
  description: string;
  created_at?: Date;
  updated_at?: Date | null;
}

export type Period = {
  id?: number;
  name: string;
  description?: string | null;
  created_at?: Date;
  updated_at?: Date | null;
}

export type ChartData = { value: number; date: string };

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