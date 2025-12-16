"use server";

import { neon } from "@neondatabase/serverless";

function getSql()
{
  const sql = neon(process.env.DATABASE_URL!)
  return sql
}

export type Operation = {
  id: number;
  name: string;
  description: string;
  date: string;
  valor: number;
  is_paid: boolean;
  is_entrada: boolean;
  category_id: number;
}

export async function getOperations() {
  const sql = getSql()
  const results = await sql`SELECT * FROM operation`;
  return results as Operation[]
}