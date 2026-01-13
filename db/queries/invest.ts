import { desc } from "drizzle-orm";
import { db } from ".";
import { investmentView } from "../schema";

export async function getInvestments() {
  return db.select().from(investmentView).orderBy(desc(investmentView.date));
}