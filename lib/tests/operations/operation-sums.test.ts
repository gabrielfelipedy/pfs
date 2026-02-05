import { expect, test } from "vitest";
import { Operation, OperationArray } from "../../definitions";

const GLOBAL_DATE = new Date("2026-01-01");

// TESTING SUM OPERATIONS METHODS

const operationsMock: Operation[] = [
  { name: "Op1", category_id: 1, value: 350000, parcelas: 1, date: GLOBAL_DATE, is_income: true },
  { name: "Op2", category_id: 2, value: 12990, parcelas: 1, date: GLOBAL_DATE, is_income: false },
  { name: "Op3", category_id: 3, value: 4590, parcelas: 1, date: GLOBAL_DATE, is_income: false },
  { name: "Op4", category_id: 1, value: 120000, parcelas: 1, date: GLOBAL_DATE, is_income: true },
  { name: "Op5", category_id: 4, value: 8990, parcelas: 1, date: GLOBAL_DATE, is_income: false },

  { name: "Op6", category_id: 5, value: 50000, parcelas: 1, date: GLOBAL_DATE, is_income: true },
  { name: "Op7", category_id: 2, value: 1990, parcelas: 1, date: GLOBAL_DATE, is_income: false },
  { name: "Op8", category_id: 3, value: 25990, parcelas: 1, date: GLOBAL_DATE, is_income: false },
  { name: "Op9", category_id: 1, value: 80000, parcelas: 1, date: GLOBAL_DATE, is_income: true },
  { name: "Op10", category_id: 6, value: 3490, parcelas: 1, date: GLOBAL_DATE, is_income: false },

  { name: "Op11", category_id: 4, value: 100000, parcelas: 1, date: GLOBAL_DATE, is_income: true },
  { name: "Op12", category_id: 2, value: 7590, parcelas: 1, date: GLOBAL_DATE, is_income: false },
  { name: "Op13", category_id: 3, value: 14990, parcelas: 1, date: GLOBAL_DATE, is_income: false },
  { name: "Op14", category_id: 1, value: 220000, parcelas: 1, date: GLOBAL_DATE, is_income: true },
  { name: "Op15", category_id: 5, value: 9990, parcelas: 1, date: GLOBAL_DATE, is_income: false },

  { name: "Op16", category_id: 6, value: 180000, parcelas: 1, date: GLOBAL_DATE, is_income: true },
  { name: "Op17", category_id: 2, value: 4500, parcelas: 1, date: GLOBAL_DATE, is_income: false },
  { name: "Op18", category_id: 3, value: 28990, parcelas: 1, date: GLOBAL_DATE, is_income: false },
  { name: "Op19", category_id: 1, value: 95000, parcelas: 1, date: GLOBAL_DATE, is_income: true },
  { name: "Op20", category_id: 4, value: 12990, parcelas: 1, date: GLOBAL_DATE, is_income: false },

  { name: "Op21", category_id: 5, value: 70000, parcelas: 1, date: GLOBAL_DATE, is_income: true },
  { name: "Op22", category_id: 2, value: 3590, parcelas: 1, date: GLOBAL_DATE, is_income: false },
  { name: "Op23", category_id: 3, value: 18990, parcelas: 1, date: GLOBAL_DATE, is_income: false },
  { name: "Op24", category_id: 1, value: 300000, parcelas: 1, date: GLOBAL_DATE, is_income: true },
  { name: "Op25", category_id: 6, value: 5990, parcelas: 1, date: GLOBAL_DATE, is_income: false },

  { name: "Op26", category_id: 4, value: 110000, parcelas: 1, date: GLOBAL_DATE, is_income: true },
  { name: "Op27", category_id: 2, value: 8990, parcelas: 1, date: GLOBAL_DATE, is_income: false },
  { name: "Op28", category_id: 3, value: 23990, parcelas: 1, date: GLOBAL_DATE, is_income: false },
  { name: "Op29", category_id: 1, value: 65000, parcelas: 1, date: GLOBAL_DATE, is_income: true },
  { name: "Op30", category_id: 5, value: 14990, parcelas: 1, date: GLOBAL_DATE, is_income: false },

  { name: "Op31", category_id: 6, value: 200000, parcelas: 1, date: GLOBAL_DATE, is_income: true },
  { name: "Op32", category_id: 2, value: 2990, parcelas: 1, date: GLOBAL_DATE, is_income: false },
  { name: "Op33", category_id: 3, value: 9990, parcelas: 1, date: GLOBAL_DATE, is_income: false },
  { name: "Op34", category_id: 1, value: 175000, parcelas: 1, date: GLOBAL_DATE, is_income: true },
  { name: "Op35", category_id: 4, value: 4590, parcelas: 1, date: GLOBAL_DATE, is_income: false },

  { name: "Op36", category_id: 5, value: 85000, parcelas: 1, date: GLOBAL_DATE, is_income: true },
  { name: "Op37", category_id: 2, value: 11990, parcelas: 1, date: GLOBAL_DATE, is_income: false },
  { name: "Op38", category_id: 3, value: 27990, parcelas: 1, date: GLOBAL_DATE, is_income: false },
  { name: "Op39", category_id: 1, value: 400000, parcelas: 1, date: GLOBAL_DATE, is_income: true },
  { name: "Op40", category_id: 6, value: 6990, parcelas: 1, date: GLOBAL_DATE, is_income: false },

  { name: "Op41", category_id: 4, value: 90000, parcelas: 1, date: GLOBAL_DATE, is_income: true },
  { name: "Op42", category_id: 2, value: 15990, parcelas: 1, date: GLOBAL_DATE, is_income: false },
  { name: "Op43", category_id: 3, value: 21990, parcelas: 1, date: GLOBAL_DATE, is_income: false },
  { name: "Op44", category_id: 1, value: 140000, parcelas: 1, date: GLOBAL_DATE, is_income: true },
  { name: "Op45", category_id: 5, value: 4990, parcelas: 1, date: GLOBAL_DATE, is_income: false },

  { name: "Op46", category_id: 6, value: 250000, parcelas: 1, date: GLOBAL_DATE, is_income: true },
  { name: "Op47", category_id: 2, value: 8990, parcelas: 1, date: GLOBAL_DATE, is_income: false },
  { name: "Op48", category_id: 3, value: 17990, parcelas: 1, date: GLOBAL_DATE, is_income: false },
  { name: "Op49", category_id: 1, value: 105000, parcelas: 1, date: GLOBAL_DATE, is_income: true },
  { name: "Op50", category_id: 4, value: 12990, parcelas: 1, date: GLOBAL_DATE, is_income: false },
];

const INCOMES_SUM = 3185000
const EXPENSES_SUM = 361110
const BALANCE = INCOMES_SUM - EXPENSES_SUM


test("expected filterInvestments filter investments properly", () => {
  
  expect(new OperationArray(operationsMock).calculateIncomes()).toEqual(INCOMES_SUM);
});

test("expected calculateExpenses calculates expenses properly", () => {
  expect(new OperationArray(operationsMock).calculateExpenses()).toEqual(EXPENSES_SUM);
});

test("expected calculateBalance calculates balance properly", () => {
  expect(new OperationArray(operationsMock).calcBalance()).toEqual(BALANCE);
});