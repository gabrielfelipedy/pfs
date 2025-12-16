"use server";

import { neon } from "@neondatabase/serverless";

function getSql() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
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
};

export async function getOperations() {
  const sql = getSql();
  const results = await sql`SELECT * FROM operation`;
  return results as Operation[];
}

export async function getDailyCosts() {
  const sql = getSql();
  const results = await sql`SELECT 
  name,
  date AT TIME ZONE 'America/Sao_Paulo',
  valor
  
FROM
  saidas

WHERE 
  (date AT TIME ZONE 'America/Sao_Paulo')::date 
  = 
  (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo')::date;`;
  return results as Operation[];
}

export async function getWeeklyCosts() {
  const sql = getSql();
  const results = await sql`SELECT
  name,
  date AT TIME ZONE 'America/Sao_Paulo' AS local_date,
  valor
  
FROM
  saidas 
  
WHERE DATE_TRUNC('week', (date AT TIME ZONE 'America/Sao_Paulo')) = DATE_TRUNC('week', (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'));`;
  return results as Operation[];
}

export async function getMonthlyCosts() {
  const sql = getSql();
  const results = await sql`SELECT
  name,
  date AT TIME ZONE 'America/Sao_Paulo' AS local_date,
  valor
  
FROM
  saidas 
  
WHERE DATE_TRUNC('month', (date AT TIME ZONE 'America/Sao_Paulo')) = DATE_TRUNC('month', (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'));`;
  return results as Operation[];
}


export async function getMonthlyEarnings() {
  const sql = getSql();
  const result = await sql`select SUM(valor) as total from entradas`;
  return result;
}

export async function getMonthlyBalance() {
  const sql = getSql();
  const result = await sql`select saldo from balanco_geral`;
  return result;
}