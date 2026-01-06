import { db } from ".";
import { periodTable } from "../schema";


export async function getPeriods()
{
    return db.select().from(periodTable)
}