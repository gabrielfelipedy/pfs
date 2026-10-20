import * as z from "zod";
import {
  expandParcelamentosForMonth,
  monthStrToNumber,
  monthToNumber,
} from "./parcelamento";

export interface Operation {
  id?: number;
  name: string;
  description?: string | null;
  value: number;
  parcelas: number;
  date: Date;
  sort_order?: number;

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

  // Campos de exibição preenchidos ao expandir parcelamentos por mês.
  // O `value` armazenado continua sendo o total; estes campos são apenas de
  // visualização (prefixo "1/2", "2/2") e de cálculo (valor da parcela).
  parcela_value?: number;
  parcela_atual?: number;
  parcela_total?: number;
}

export class OperationArray {
  private MONTHLY_PERIOD_ID = 3;
  private INVESTIMENTO_CATEGORY_ID = 6;

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
          const monthYear = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`;
          return monthYear === month && operation.parcelas === 1;
        }
        return false;
      });


    // FILTRA AS OPERAÇÕES FIXAS GERAL

    const targetNum = monthStrToNumber(month);
    const fixedOperations = operationsArray.filterFixedOperations().getOperations().filter((o) => {
      const startDate = o.start_date || o.date;
      const startNum = monthToNumber(startDate);
      const endNum = o.end_date ? monthToNumber(o.end_date) : null;
      return startNum <= targetNum && (endNum === null || targetNum <= endNum);
    });

    // EXPANDE OS PARCELAMENTOS

    const parcelamentos = expandParcelamentosForMonth(this.operations, month);

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
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
});
