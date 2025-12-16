"use server";

import { createSession } from "@/lib/session";
import { LoginFormSchema } from "../../lib/definitions";
import { redirect } from "next/navigation";
import * as bcrypt from "bcrypt";
import { getAuth } from "@/lib/db";


export async function login(prevState: any, formData: FormData) {
  const validationResult = LoginFormSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validationResult.data;

  const dbData = await getAuth();

  if(dbData.length === 0){
    return {
      errors: {
        username: ["Error on login"],
      },
    };
  }

  const match = await bcrypt.compare(password, dbData[0].password);

  if (username !== dbData[0].username || !match) {
    return {
      errors: {
        username: ["Invalid username or password"],
      },
    };
  }

  await createSession(username);


  redirect('/')
}

export async function logout() {}
