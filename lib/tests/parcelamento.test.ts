import { expect, test } from "vitest";
import { Operation } from "../definitions";
import {
  expandParcelamentosForMonth,
  operationValue,
  parcelaValue,
} from "../parcelamento";
import { filterOperationsByMonth, getAvaliableMonths } from "../date";

const PARCELADO: Operation = {
  id: 1,
  name: "Produto",
  value: 20000,
  parcelas: 2,
  date: new Date(2026, 0, 15),
  period_id: null,
};

test("expected parcelaValue to divide value by parcelas", () => {
  expect(parcelaValue(PARCELADO)).toBe(10000);
});

test("expected parcelaValue to return full value when not parcelado", () => {
  expect(parcelaValue({ ...PARCELADO, value: 5000, parcelas: 1 })).toBe(5000);
});

test("expected operationValue to prefer parcela_value when expanded", () => {
  const [expanded] = expandParcelamentosForMonth([PARCELADO], "2026-1");
  expect(operationValue(expanded)).toBe(10000);
});

test("expected expandParcelamentosForMonth to return 1st parcela with fields", () => {
  const [expanded] = expandParcelamentosForMonth([PARCELADO], "2026-1");

  expect(expanded.parcela_atual).toBe(1);
  expect(expanded.parcela_total).toBe(2);
  expect(expanded.parcela_value).toBe(10000);
  expect(expanded.value).toBe(20000);
  expect(expanded.date.getFullYear()).toBe(2026);
  expect(expanded.date.getMonth()).toBe(0);
  expect(expanded.date.getDate()).toBe(15);
});

test("expected expandParcelamentosForMonth to return 2nd parcela next month", () => {
  const [expanded] = expandParcelamentosForMonth([PARCELADO], "2026-2");

  expect(expanded.parcela_atual).toBe(2);
  expect(expanded.parcela_total).toBe(2);
  expect(expanded.parcela_value).toBe(10000);
  expect(expanded.date.getMonth()).toBe(1);
});

test("expected expandParcelamentosForMonth to not return outside range", () => {
  expect(expandParcelamentosForMonth([PARCELADO], "2026-3")).toEqual([]);
});

test("expected filterOperationsByMonth to expand parcela on both months without duplicating", () => {
  const operations: Operation[] = [
    PARCELADO,
    {
      id: 2,
      name: "Avulso",
      value: 5000,
      parcelas: 1,
      date: new Date(2026, 0, 10),
      period_id: null,
    },
  ];

  const january = filterOperationsByMonth(operations, "2026-1");
  expect(january).toHaveLength(2);
  expect(january.some((o) => o.name === "Avulso")).toBe(true);
  const parcelaInJanuary = january.find((o) => o.name === "Produto");
  expect(parcelaInJanuary?.parcela_atual).toBe(1);

  const february = filterOperationsByMonth(operations, "2026-2");
  expect(february).toHaveLength(1);
  expect(february[0].parcela_atual).toBe(2);
});

test("expected getAvaliableMonths to include parcelamento months", () => {
  const months = getAvaliableMonths([PARCELADO]);
  expect(months).toContain("2026-1");
  expect(months).toContain("2026-2");
});
