import { db } from ".."
import { generalBalanceView } from "../schema"

export async function getMonthlyIncomes()
{
    return db.select({total_incomes: generalBalanceView.total_incomes}).from(generalBalanceView)
}

/* export async function getMonthlyEarnings() {
  const sql = getSql();

  try {
  const result = await sql`select SUM(valor) as total from entradas`;
  return result;
  } catch(error)
  {
    return []
  }
} */