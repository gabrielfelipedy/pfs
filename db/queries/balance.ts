import { db } from ".";
import { generalBalanceView } from "../schema";

export async function getMonthlyBalance() {
  return db
    .select({ balance: generalBalanceView.balance })
    .from(generalBalanceView);
}