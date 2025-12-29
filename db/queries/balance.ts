import { db } from ".";
import { generalBalanceView } from "../schema";

export async function getMonthlyBalance() {
  return db
    .select({ balance: generalBalanceView.balance })
    .from(generalBalanceView);
}

/* export async function getMonthlyBalance() {
  const sql = getSql();

  try {
  const result = await sql`select saldo from balanco_geral`;
  return result;
  }
  catch(error)
  {
    return []
  }
} */
