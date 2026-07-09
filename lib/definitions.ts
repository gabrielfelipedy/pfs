import * as z from "zod";

export interface Operation {
  id?: number;
  name: string;
  description?: string | null;
  value: number;
  parcelas: number;
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
  start_date?: Date | null;
  end_date?: Date | null;
}

export class OperationArray {
  private MONTHLY_PERIOD_ID = 3;
  private INVESTIMENTO_CATEGORY_ID = 6;

  private monthToNumber(date: Date): number {
    return date.getFullYear() * 12 + date.getMonth();
  }

  private monthStrToNumber(monthStr: string): number {
    const [y, m] = monthStr.split("-").map(Number);
    return y * 12 + (m - 1);
  }

  constructor(private operations: Operation[]) {}

  calcSum(): number {
    return this.operations.reduce((sum, op) => sum + op.value, 0);
  }

  calcBalance(): number {
    return this.operations.reduce((sum, op) => sum + (op.is_income ? op.value : (op.value * -1)), 0);
  }

  filterIncomes(): OperationArray {
    return new OperationArray(
      this.operations.filter((o) => o.is_income === true),
    );
  }

  filterExpenses(): OperationArray {
    return new OperationArray(
      this.operations.filter((o) => o.is_income === false),
    );
  }

  filterFixedOperations(): OperationArray {
    return new OperationArray(this.operations.filter(
      (o) => o.period_id === this.MONTHLY_PERIOD_ID,
    ))
  }

  filterVariableOperations(): OperationArray {
    return new OperationArray(this.operations.filter((o) => o.period_id === null))
  }

  filterComprasParceladas(): OperationArray {
    return new OperationArray(this.operations.filter((o) => o.parcelas > 1))
  }

  filterInvestimentos(): OperationArray {
    return new OperationArray(this.operations.filter(
      (o) => o.category_id === this.INVESTIMENTO_CATEGORY_ID,
    ))
  }

  filterOperationsByMonth(
    month: string,
  ): Operation[] {
  
    const operationsArray = new OperationArray(this.operations)

    // FILTRA AS OPERAÇÕES VARIÁVEIS DO MÊS
  
    const filteredByMonth = operationsArray.filterVariableOperations().getOperations()
      .filter((operation) => {
        if (operation.date) {
          const date = operation.date;
          const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
          return monthYear === month && operation.parcelas === 1;
        }
        return false;
      });


    // FILTRA AS OPERAÇÕES FIXAS GERAL
  
    const targetNum = this.monthStrToNumber(month);
    const fixedOperations = operationsArray.filterFixedOperations().getOperations().filter((o) => {
      const startDate = o.start_date || o.date;
      const startNum = this.monthToNumber(startDate);
      const endNum = o.end_date ? this.monthToNumber(o.end_date) : null;
      return startNum <= targetNum && (endNum === null || targetNum <= endNum);
    });
  
    // EXPANDE OS PARCELAMENTOS

    const parcelamentos = operationsArray
    .filterComprasParceladas()
    .getOperations()
    .filter((o) => {
      const numParcelas = o.parcelas ?? 1;
      const date = new Date(o.date);

      const [targetYear, targetMonth] = month.split("-").map(Number);

      const startMonthIndex = date.getFullYear() * 12 + date.getMonth();
      const endMonthIndex = startMonthIndex + (numParcelas - 1);
      const targetMonthIndex = targetYear * 12 + (targetMonth - 1);

      return targetMonthIndex >= startMonthIndex && targetMonthIndex <= endMonthIndex;
    });
  
    return [...filteredByMonth, ...fixedOperations, ...parcelamentos].sort((a, b) => {
      return new Date(a.date ?? "").getTime() - new Date(b.date ?? "").getTime();
    });
  };

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
}

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
};

export type Period = {
  id?: number;
  name: string;
  description?: string | null;
  created_at?: Date;
  updated_at?: Date | null;
};

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
