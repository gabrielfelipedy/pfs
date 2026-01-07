import { db } from ".";
import { investmentView } from "../schema";

export async function getInvestments() {
  return db.select().from(investmentView);
}