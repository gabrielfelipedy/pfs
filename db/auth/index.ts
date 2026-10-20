import { eq } from "drizzle-orm";
import { db } from "../queries";
import { userTable } from "../schema";

export async function getAuth() {
  return db.select().from(userTable);
}

export async function updateUserUsername(
  id: number,
  username: string
) {
  return db
    .update(userTable)
    .set({ username })
    .where(eq(userTable.id, id));
}

export async function updateUserPassword(
  id: number,
  passwordHash: string
) {
  return db
    .update(userTable)
    .set({ password: passwordHash })
    .where(eq(userTable.id, id));
}
