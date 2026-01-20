import { startOfDay } from "date-fns";
import { ChartData, Operation, OperationBalance } from "./definitions";

export const INVESTIMENTO_CATEGORY_ID = 6;

export const calculateIncomes = (operations: Operation[]) => {
  let total = 0;
  operations.forEach((operation) => {
    if (operation.is_income) {
      total += operation.value ?? 0;
    }
  });
  return total;
};

export const calculateBalanceEvolution = (operations: Operation[]) => {
  //console.log(operations)

  const balanceMap = new Map<string, ChartData>();
  let total_incomes = 0;

  operations.forEach((operation) => {
    const date = startOfDay(new Date(operation.date ?? ""));
    const key = date.toISOString().split("T")[0];

    const value = operation.value ?? 0;

    if (operation.is_income) {
      total_incomes += value;
    } else {
      total_incomes -= value;
    }

    balanceMap.set(key, { date: key, value: total_incomes / 100 });
  });

  //console.log(Array.from(balanceMap.values()));
  return Array.from(balanceMap.values());
};

export const calculateOperationEvolution = (operations: Operation[]) => {
  //console.log(operations)

  const incomeMap = new Map<string, ChartData>();

  operations.reverse().forEach((operation) => {
    const date = startOfDay(new Date(operation.date ?? ""));
    const key = date.toISOString().split("T")[0];

    const current_value = incomeMap.get(key) ?? { date: key, value: 0 };
    const value = operation.value ?? 0;

    incomeMap.set(key, {
      date: key,
      value: current_value.value + value / 100,
    });
  });

  //console.log(Array.from(incomeMap.values()));
  return Array.from(incomeMap.values()).reverse();
};

export const calculateCumulativeOperationEvolution = (
  operations: Operation[]
) => {
  //console.log(operations)

  const incomeMap = new Map<string, ChartData>();
  let total = 0;

  operations.reverse().forEach((operation) => {
    const date = startOfDay(new Date(operation.date ?? ""));
    const key = date.toISOString().split("T")[0];

    const value = (operation.value ?? 0) / 100;
    total += value;

    incomeMap.set(key, {
      date: key,
      value: total,
    });
  });

  //console.log(Array.from(incomeMap.values()));
  return Array.from(incomeMap.values());
};

export const calculateIncomeEvolution = (operations: Operation[]) => {
  //console.log(operations)

  const incomeMap = new Map<string, ChartData>();

  operations.forEach((operation) => {
    const date = startOfDay(new Date(operation.date ?? ""));
    const key = date.toISOString().split("T")[0];

    const current_value = incomeMap.get(key) ?? { date: key, value: 0 };
    const value = operation.value ?? 0;

    if (operation.is_income) {
      incomeMap.set(key, {
        date: key,
        value: current_value.value + value / 100,
      });
    }
  });

  //console.log(Array.from(incomeMap.values()));
  return Array.from(incomeMap.values());
};

export const calculateCumulativeIncomeEvolution = (operations: Operation[]) => {
  //console.log(operations)

  const incomeMap = new Map<string, ChartData>();
  let total = 0;

  operations.reverse().forEach((operation) => {
    if (!operation.is_income) return;

    const date = startOfDay(new Date(operation.date ?? ""));
    const key = date.toISOString().split("T")[0];
    // const current_value = incomeMap.get(key) ?? { date: key, value: 0 };
    const value = operation.value ?? 0;

    total += value / 100;

    incomeMap.set(key, {
      date: key,
      value: total,
    });
  });

  //console.log(Array.from(incomeMap.values()));
  return Array.from(incomeMap.values());
};

export const calculateIncomesAndExpensesEvolution = (
  operations: Operation[]
) => {
  //console.log(operations)

  const balanceMap = new Map<
    string,
    { date: string; total_incomes: number; total_expenses: number }
  >();

  operations.forEach((operation) => {
    const date = startOfDay(new Date(operation.date ?? ""));
    const key = date.toISOString().split("T")[0];

    const current_value = balanceMap.get(key) ?? {
      date: key,
      total_incomes: 0,
      total_expenses: 0,
    };

    const value = operation.value ?? 0;

    if (operation.is_income) {
      balanceMap.set(key, {
        date: key,
        total_incomes: current_value.total_incomes + value,
        total_expenses: current_value.total_expenses,
      });
    } else {
      balanceMap.set(key, {
        date: key,
        total_incomes: current_value.total_incomes,
        total_expenses: current_value.total_expenses + value,
      });
    }
  });

  //console.log(Array.from(balanceMap.values()));
  return Array.from(balanceMap.values());
};

export const calculateOperationProportion = (operations: Operation[]) => {
  //console.log(operations)
  const proportionMap = new Map<string, OperationBalance>();

  operations.reverse().forEach((operation) => {
    const key = operation.category_id?.toString() ?? "Sem categoria";

    const current_value = proportionMap.get(key) ?? {
      name: null,
      value: 0,
    };

    proportionMap.set(key, {
      name: operation.category_name ?? "Sem categoria",
      value: current_value.value + (operation.value ?? 0),
    });
  });

  const proportion = Array.from(proportionMap.values()).sort(
    (a, b) => b.value - a.value
  );
  return proportion;
};

export const calculatePaymentMethodProportion = (operations: Operation[]) => {
  //console.log(operations)
  const paymentMethodMap = new Map<string, OperationBalance>();

  operations.reverse().forEach((operation) => {
    const key =
      operation.payment_method_id?.toString() ?? "Sem método de pagamento";

    const current_value = paymentMethodMap.get(key) ?? {
      name: null,
      value: 0,
    };

    paymentMethodMap.set(key, {
      name: operation.payment_method_name ?? "Sem método de pagamento",
      value: current_value.value + (operation.value ?? 0),
    });
  });

  const paymentMethods = Array.from(paymentMethodMap.values()).sort(
    (a, b) => b.value - a.value
  );
  return paymentMethods;
};
