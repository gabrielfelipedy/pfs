"use server";

import { createSession } from "@/lib/session";
import { LoginFormSchema } from "../../../lib/definitions";
import { redirect } from "next/navigation";
import * as bcrypt from "bcrypt";
import { getAuth } from "@/db/auth";

export type LoginActionState =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message?: string;
      errors: {
        username?: string[];
        password?: string[];
      };
    };

export async function login(
  prevState: LoginActionState | undefined,
  formData: FormData
): Promise<LoginActionState> {
  const validationResult = LoginFormSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validationResult.data;

  const dbData = await getAuth();

  if (dbData.length === 0) {
    return {
      success: false,
      errors: {
        username: ["Error on login"],
      },
    };
  }

  const match = await bcrypt.compare(password, dbData[0].password);

  if (username !== dbData[0].username || !match) {
    return {
      success: false,
      errors: {
        username: ["Invalid username or password"],
      },
    };
  }

  await createSession(username);
  redirect("/");

  return { success: true, message: "Login Sucessfully" };
}

export async function logout() {}
