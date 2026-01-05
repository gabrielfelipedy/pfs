import { isSameWeek, isToday } from "date-fns";
import { Operation } from "./definitions";

export const calculateIncomes = (operations: Operation[]) => {
  let total = 0;
  operations.forEach((operation) => {
    if (operation.is_income) {
      total += operation.value ?? 0;
    }
  });
  return total;
};

export const calculateWeeklyExpenses = (operations: Operation[]) => {
  let total = 0;

  operations.forEach((operation) => {
    if (
      !operation.is_income &&
      isSameWeek(new Date(operation.date ?? ""), new Date(), {
        weekStartsOn: 0,
      })
    ) {
      total += operation.value ?? 0;
    }
  });
  return total;
};

export const calculateDailyExpenses = (operations: Operation[]) => {
  let total = 0;

  operations.forEach((operation) => {
    if (!operation.is_income && isToday(new Date(operation.date ?? ""))) {
      total += operation.value ?? 0;
    }
  });
  return total;
};