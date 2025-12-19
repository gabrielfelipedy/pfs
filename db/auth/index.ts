import { db } from "..";
import { userTable } from "../schema";

export async function getAuth()
{
    return db.select().from(userTable)
}