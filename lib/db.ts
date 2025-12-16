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
  date: Date;
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

export async function getDailyCosts() {
  const sql = getSql()
  const results = await sql`SELECT * FROM saidas WHERE date::date = CURRENT_DATE;`;
  return results as Operation[]
}

export async function getWeeklyCosts() {
  const sql = getSql()
  const results = await sql`SELECT * FROM saidas WHERE DATE_TRUNC('week', date) = DATE_TRUNC('week', CURRENT_TIMESTAMP);`;
  return results as Operation[]
}

export async function getMonthlyCosts() {
  const sql = getSql()
  const results = await sql`SELECT * FROM saidas WHERE DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_TIMESTAMP);`;
  return results as Operation[]
}