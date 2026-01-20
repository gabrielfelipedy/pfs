import { expect, test } from "vitest";
import { Operation, OperationArray } from "../definitions";

const GLOBAL_DATE = new Date("2026-01-01");

test("expected filterInvestments filter investments properly", () => {
  const rawOperations: Operation[] = [
    {
      name: "Op1",
      category_id: 6,
      value: 0,
      parcelas: 1,
      date: GLOBAL_DATE,
    },
    {
      name: "Op2",
      category_id: 3,
      value: 0,
      parcelas: 1,
      date: GLOBAL_DATE,
    },
  ];

  const filteredOperations: Operation[] = [
    {
      name: "Op1",
      category_id: 6,
      value: 0,
      parcelas: 1,
      date: GLOBAL_DATE,
    },
  ];

  expect(new OperationArray(rawOperations).filterInvestimentos()).toEqual(filteredOperations);
});

test("correct handle whe there's no investment operations", () => {
  const rawOperations: Operation[] = [
    {
      name: "Op1",
      category_id: 7,
      value: 0,
      parcelas: 1,
      date: GLOBAL_DATE,
    },
    {
      name: "Op2",
      category_id: 3,
      value: 0,
      parcelas: 1,
      date: GLOBAL_DATE,
    },
  ];

  const filteredOperations: Operation[] = []

  expect(new OperationArray(rawOperations).filterInvestimentos()).toEqual(filteredOperations);
});

test("correct handle empty array of operations", () => {
  const rawOperations: Operation[] = []

  const filteredOperations: Operation[] = []

  expect(new OperationArray(rawOperations).filterInvestimentos()).toEqual(filteredOperations);
});

test("expected filterFixedOperations filter fixed operations properly", () => {
  const rawOperations: Operation[] = [
    {
      name: "Op1",
      category_id: 1,
      value: 0,
      parcelas: 1,
      date: GLOBAL_DATE,
      period_id: 3
    },
    {
      name: "Op2",
      category_id: 3,
      value: 0,
      parcelas: 1,
      date: GLOBAL_DATE,
      period_id: 1
    },
  ];

  const filteredOperations: Operation[] = [
    {
      name: "Op1",
      category_id: 1,
      value: 0,
      parcelas: 1,
      date: GLOBAL_DATE,
      period_id: 3
    },
  ];

  expect(new OperationArray(rawOperations).filterFixedOperations()).toEqual(filteredOperations);
});


test("expected filterVariableOperations filter variable operations properly", () => {
  const rawOperations: Operation[] = [
    {
      name: "Op1",
      category_id: 1,
      value: 0,
      parcelas: 1,
      date: GLOBAL_DATE,
      period_id: 3
    },
    {
      name: "Op2",
      category_id: 3,
      value: 0,
      parcelas: 1,
      date: GLOBAL_DATE,
      period_id: null
    },
  ];

  const filteredOperations: Operation[] = [
    {
      name: "Op2",
      category_id: 3,
      value: 0,
      parcelas: 1,
      date: GLOBAL_DATE,
      period_id: null
    },
  ];

  expect(new OperationArray(rawOperations).filterVariableOperations()).toEqual(filteredOperations);
});

test("expected filterCompraasParceladas filter compras parceladas properly", () => {
  const rawOperations: Operation[] = [
    {
      name: "Op1",
      category_id: 1,
      value: 0,
      parcelas: 1,
      date: GLOBAL_DATE,
      period_id: 3
    },
    {
      name: "Op2",
      category_id: 3,
      value: 0,
      parcelas: 2,
      date: GLOBAL_DATE,
      period_id: null
    },
  ];

  const filteredOperations: Operation[] = [
    {
      name: "Op2",
      category_id: 3,
      value: 0,
      parcelas: 2,
      date: GLOBAL_DATE,
      period_id: null
    },
  ];

  expect(new OperationArray(rawOperations).filterComprasParceladas()).toEqual(filteredOperations);
});