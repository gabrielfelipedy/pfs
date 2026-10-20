"use server";

import * as bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import {
  ChangePasswordSchema,
  ChangeUsernameSchema,
} from "@/lib/definitions";
import { createSession, verifySession } from "@/lib/session";
import {
  getAuth,
  updateUserPassword,
  updateUserUsername,
} from "@/db/auth";

export type ChangeUsernameActionState =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      errors: {
        username?: string[];
      };
    };

export type ChangePasswordActionState =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      errors: {
        currentPassword?: string[];
        newPassword?: string[];
      };
    };

export async function changeUsername(
  prevState: ChangeUsernameActionState | undefined,
  formData: FormData
): Promise<ChangeUsernameActionState> {
  await verifySession();

  const validationResult = ChangeUsernameSchema.safeParse({
    username: formData.get("username"),
  });

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { username } = validationResult.data;

  let dbData;
  try {
    dbData = await getAuth();
  } catch {
    return {
      success: false,
      errors: {
        username: ["Erro de conexão com o banco de dados. Tente novamente mais tarde."],
      },
    };
  }

  if (dbData.length === 0) {
    return {
      success: false,
      errors: {
        username: ["Erro ao verificar o usuário. Tente novamente mais tarde."],
      },
    };
  }

  try {
    await updateUserUsername(dbData[0].id, username);
  } catch {
    return {
      success: false,
      errors: {
        username: ["Erro ao atualizar o usuário. Tente novamente mais tarde."],
      },
    };
  }

  await createSession(username);

  revalidatePath("/", "layout");

  return { success: true, message: "Nome de usuário atualizado com sucesso" };
}

export async function changePassword(
  prevState: ChangePasswordActionState | undefined,
  formData: FormData
): Promise<ChangePasswordActionState> {
  await verifySession();

  const validationResult = ChangePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { currentPassword, newPassword } = validationResult.data;

  let dbData;
  try {
    dbData = await getAuth();
  } catch {
    return {
      success: false,
      errors: {
        currentPassword: ["Erro de conexão com o banco de dados. Tente novamente mais tarde."],
      },
    };
  }

  if (dbData.length === 0) {
    return {
      success: false,
      errors: {
        currentPassword: ["Erro ao verificar o usuário. Tente novamente mais tarde."],
      },
    };
  }

  const match = await bcrypt.compare(currentPassword, dbData[0].password);

  if (!match) {
    return {
      success: false,
      errors: {
        currentPassword: ["Senha atual incorreta"],
      },
    };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  try {
    await updateUserPassword(dbData[0].id, passwordHash);
  } catch {
    return {
      success: false,
      errors: {
        newPassword: ["Erro ao atualizar a senha. Tente novamente mais tarde."],
      },
    };
  }

  revalidatePath("/", "layout");

  return { success: true, message: "Senha atualizada com sucesso" };
}
