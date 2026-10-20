import { expect, test } from "vitest";
import {
  ChangePasswordSchema,
  ChangeUsernameSchema,
} from "../../lib/definitions";

test("(username) valid new username", () => {
  const validation = ChangeUsernameSchema.safeParse({
    username: "novo.usuario",
  });

  expect(validation.success).toBeTruthy();
});

test("(username) username is trimmed", () => {
  const validation = ChangeUsernameSchema.safeParse({
    username: "  novo.usuario  ",
  });

  expect(validation.success).toBeTruthy();
  if (validation.success) {
    expect(validation.data.username).toBe("novo.usuario");
  }
});

test("(username) username cannot be shorter than 3 characters", () => {
  const validation = ChangeUsernameSchema.safeParse({
    username: "ab",
  });

  expect(validation.success).toBeFalsy();
});

test("(username) username cannot be longer than 50 characters", () => {
  const validation = ChangeUsernameSchema.safeParse({
    username: "a".repeat(51),
  });

  expect(validation.success).toBeFalsy();
});

test("(username) username cannot be unprovided", () => {
  const validation = ChangeUsernameSchema.safeParse({});

  expect(validation.success).toBeFalsy();
});

test("(password) valid current and new password", () => {
  const validation = ChangePasswordSchema.safeParse({
    currentPassword: "senha.atual123",
    newPassword: "nova.senha123",
  });

  expect(validation.success).toBeTruthy();
});

test("(password) new password cannot be shorter than 8 characters", () => {
  const validation = ChangePasswordSchema.safeParse({
    currentPassword: "senha.atual123",
    newPassword: "curta",
  });

  expect(validation.success).toBeFalsy();
});

test("(password) current password cannot be empty", () => {
  const validation = ChangePasswordSchema.safeParse({
    currentPassword: "",
    newPassword: "nova.senha123",
  });

  expect(validation.success).toBeFalsy();
});

test("(password) passwords cannot be unprovided", () => {
  const validation = ChangePasswordSchema.safeParse({});

  expect(validation.success).toBeFalsy();
});
