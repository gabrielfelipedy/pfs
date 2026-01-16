import { expect, test } from "vitest";
import { OperationSchema } from "../definitions";

test("tests if zod schema validates a correct data", () => {
  const validation = OperationSchema.safeParse({
    name: "Nome teste",
    description: "Descrição teste",
    date: new Date(),
    value: 2000,
    is_paid: true,
    is_income: true,
    category_id: 1,
    payment_method_id: 1,
    period_id: 3,
  });

  expect(validation.success).toBeTruthy();
});

test("(description) tests if zod schema validates data with null description", () => {
  const validation = OperationSchema.safeParse({
    name: "Nome teste",
    description: null,
    date: new Date(),
    value: 2000,
    is_paid: true,
    is_income: true,
    category_id: 1,
    payment_method_id: 1,
    period_id: 3,
  });

  expect(validation.success).toBeTruthy();
});

test("(description) tests if zod schema validates data with no description", () => {
  const validation = OperationSchema.safeParse({
    name: "Nome teste",
    date: new Date(),
    value: 2000,
    is_paid: true,
    is_income: true,
    category_id: 1,
    payment_method_id: 1,
    period_id: 3,
  });

  expect(validation.success).toBeTruthy();
});

test("(value) value cannot be negative", () => {
  const validation = OperationSchema.safeParse({
    name: "Nome teste",
    date: new Date(),
    value: -2000,
    is_paid: true,
    is_income: true,
    category_id: 1,
    payment_method_id: 1,
    period_id: 3,
  });

  expect(validation.success).toBeFalsy();
});

test("(date) date must be provived", () => {
  const validation = OperationSchema.safeParse({
    name: "Nome teste",
    value: -2000,
    is_paid: true,
    is_income: true,
    category_id: 1,
    payment_method_id: 1,
    period_id: 3,
  });

  expect(validation.success).toBeFalsy();
});

test("(date) date cannot be null", () => {
  const validation = OperationSchema.safeParse({
    name: "Nome teste",
    date: null,
    value: -2000,
    is_paid: true,
    is_income: true,
    category_id: 1,
    payment_method_id: 1,
    period_id: 3,
  });

  expect(validation.success).toBeFalsy();
});

test("(is_paid) is_paid cannot be unprovided", () => {
  const validation = OperationSchema.safeParse({
    name: "Nome teste",
    description: null,
    date: new Date(),
    value: 2000,
    is_income: true,
    payment_method_id: 1,
    period_id: 3,
  });

  expect(validation.success).toBeFalsy();
});

test("(is_income) is_income cannot be unprovided", () => {
  const validation = OperationSchema.safeParse({
    name: "Nome teste",
    description: null,
    date: new Date(),
    value: 2000,
    is_paid: true,
    payment_method_id: 1,
    period_id: 3,
  });

  expect(validation.success).toBeFalsy();
});

test("(category_id) category_id cannot be negative", () => {
  const validation = OperationSchema.safeParse({
    name: "Nome teste",
    description: null,
    date: new Date(),
    value: 2000,
    is_paid: true,
    is_income: true,
    category_id: -1,
    payment_method_id: 1,
    period_id: 3,
  });

  expect(validation.success).toBeFalsy();
});

test("(category_id) category_id cannot be zero", () => {
  const validation = OperationSchema.safeParse({
    name: "Nome teste",
    description: null,
    date: new Date(),
    value: 2000,
    is_paid: true,
    is_income: true,
    category_id: 0,
    payment_method_id: 1,
    period_id: 3,
  });

  expect(validation.success).toBeFalsy();
});

test("(category_id) category_id can be null", () => {
  const validation = OperationSchema.safeParse({
    name: "Nome teste",
    description: null,
    date: new Date(),
    value: 2000,
    is_paid: true,
    is_income: true,
    category_id: null,
    payment_method_id: 1,
    period_id: 3,
  });

  expect(validation.success).toBeTruthy();
});

test("(category_id) category_id can be unprovided", () => {
  const validation = OperationSchema.safeParse({
    name: "Nome teste",
    description: null,
    date: new Date(),
    value: 2000,
    is_paid: true,
    is_income: true,
    payment_method_id: 1,
    period_id: 3,
  });

  expect(validation.success).toBeTruthy();
});

test("(payment_method_id) payment_method_id cannot be negative", () => {
  const validation = OperationSchema.safeParse({
    name: "Nome teste",
    description: null,
    date: new Date(),
    value: 2000,
    is_paid: true,
    is_income: true,
    category_id: 1,
    payment_method_id: -1,
    period_id: 3,
  });

  expect(validation.success).toBeFalsy();
});

test("(payment_method_id) payment_method_id cannot be zero", () => {
  const validation = OperationSchema.safeParse({
    name: "Nome teste",
    description: null,
    date: new Date(),
    value: 2000,
    is_paid: true,
    is_income: true,
    category_id: 1,
    payment_method_id: 0,
    period_id: 3,
  });

  expect(validation.success).toBeFalsy();
});

test("(payment_method_id) payment_method_id can be null", () => {
  const validation = OperationSchema.safeParse({
    name: "Nome teste",
    description: null,
    date: new Date(),
    value: 2000,
    is_paid: true,
    is_income: true,
    category_id: 1,
    payment_method_id: null,
    period_id: 3,
  });

  expect(validation.success).toBeTruthy();
});

test("(payment_method_id) payment_method_id can be unprovided", () => {
  const validation = OperationSchema.safeParse({
    name: "Nome teste",
    description: null,
    date: new Date(),
    value: 2000,
    is_paid: true,
    is_income: true,
    category_id: 1,
    period_id: 3,
  });

  expect(validation.success).toBeTruthy();
});

test("(period_id) period_id cannot be negative", () => {
  const validation = OperationSchema.safeParse({
    name: "Nome teste",
    description: null,
    date: new Date(),
    value: 2000,
    is_paid: true,
    is_income: true,
    category_id: 1,
    payment_method_id: 1,
    period_id: -3,
  });

  expect(validation.success).toBeFalsy();
});

test("(period_id) period_id cannot be zero", () => {
  const validation = OperationSchema.safeParse({
    name: "Nome teste",
    description: null,
    date: new Date(),
    value: 2000,
    is_paid: true,
    is_income: true,
    category_id: 1,
    payment_method_id: 1,
    period_id: 0,
  });

  expect(validation.success).toBeFalsy();
});

test("(period_id) period_id can be null", () => {
  const validation = OperationSchema.safeParse({
    name: "Nome teste",
    description: null,
    date: new Date(),
    value: 2000,
    is_paid: true,
    is_income: true,
    category_id: 1,
    payment_method_id: 1,
    period_id: null,
  });

  expect(validation.success).toBeTruthy();
});

test("(period_id) period_id can be unprovided", () => {
  const validation = OperationSchema.safeParse({
    name: "Nome teste",
    description: null,
    date: new Date(),
    value: 2000,
    is_paid: true,
    is_income: true,
    category_id: 1,
    payment_method_id: 1,
  });

  expect(validation.success).toBeTruthy();
});