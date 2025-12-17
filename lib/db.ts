"use server";

import { neon } from "@neondatabase/serverless";

function getSql() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
}

export type Operation = {
  id?: number;
  name: string;
  description: string;
  date: Date;
  valor: number;
  is_paid: boolean;
  is_entrada: boolean;
  categoria_id: number;
};

export type Categoria = {
  id?: number;
  name: string;
  description: string;
  is_entrada: boolean;
};

export type ChartData = {
  dia: string;
  valor_total: number;
};

export type DataProportion = {
  type: string;
  value: number;
};

export async function getOperations() {
  const sql = getSql();

  try {
    const results = await sql`SELECT * FROM operation`;
    return results as Operation[];
  } catch (error) {
    return [];
  }
}

export async function getMonthlySaidasEvolution() {
  const sql = getSql();

  try {
    const results = await sql`SELECT * FROM total_saidas_mes_byday`;
    return results as ChartData[];
  } catch (error) {
    return [];
  }
}

export async function getSaidaProportion() {
  const sql = getSql();

  try {
    const results = await sql`SELECT * FROM balanco_saidas`;
    return results;
  } catch (error) {
    return [];
  }
}

export async function deleteDbOperation(id: number) {
  const sql = getSql();

  try {
    const result =
      await sql`DELETE FROM operation WHERE id = ${id} RETURNING *`;
    return result as Operation[];
  } catch (error) {
    return [];
  }
}

export async function getSaidas() {
  const sql = getSql();
  try {
    const results = await sql`SELECT * FROM saidas ORDER BY date DESC`;
    return results as Operation[];
  } catch (error) {
    return [];
  }
}

export async function getDailyCosts() {
  const sql = getSql();

  try {
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
  catch(error )
  {
    return []
  }
}

export async function getWeeklyCosts() {
  const sql = getSql();

  try {
  const results = await sql`SELECT
  name,
  date AT TIME ZONE 'America/Sao_Paulo' AS local_date,
  valor
  
FROM
  saidas 
  
WHERE DATE_TRUNC('week', (date AT TIME ZONE 'America/Sao_Paulo')) = DATE_TRUNC('week', (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'));`;
  return results as Operation[];

  } catch(error)
  {
    return []
  }
}

export async function getMonthlyCosts() {
  const sql = getSql();

  try {
  const results = await sql`SELECT
  name,
  date AT TIME ZONE 'America/Sao_Paulo' AS local_date,
  valor
  
FROM
  saidas 
  
WHERE DATE_TRUNC('month', (date AT TIME ZONE 'America/Sao_Paulo')) = DATE_TRUNC('month', (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'));`;
  return results as Operation[];

  } catch(error)
  {
    return []
  }
}

export async function getMonthlyEarnings() {
  const sql = getSql();

  try {
  const result = await sql`select SUM(valor) as total from entradas`;
  return result;
  } catch(error)
  {
    return []
  }
}

export async function getMonthlyBalance() {
  const sql = getSql();

  try {
  const result = await sql`select saldo from balanco_geral`;
  return result;
  }
  catch(error)
  {
    return []
  }
}

export async function getAuth() {
  const sql = getSql();

  try {
  const result = await sql`select * from authentication`;
  return result;
  }
  catch(error)
  {
    return []
  }
}

export async function createDbRecordSaida(saida: Operation) {
 
  const sql = getSql();

  try {
  const result = await sql`INSERT INTO saidas 
    (name, description, date, valor, is_paid, is_entrada, categoria_id) 
    VALUES 
    (${saida.name}, ${saida.description}, ${saida.date}, ${saida.valor}, ${saida.is_paid}, FALSE, ${saida.categoria_id}) RETURNING *`;
  return result;
  }
  catch(error)
  {
    return []
  }
}

export async function updateDbRecordSaida(saida: Operation) {
  if (!saida.id) {
    throw new Error("ID is required for updating a record");
  }

  const sql = getSql();
  const result = await sql`UPDATE saidas 
    SET 
    name = ${saida.name},
    description = ${saida.description},
    date = ${saida.date},
    valor = ${saida.valor},
    is_paid = ${saida.is_paid},
    categoria_id = ${saida.categoria_id} 
    WHERE id = ${saida.id} RETURNING *`;
  return result;
}

export async function createDbRecordEntrada(saida: Operation) {
  
  const sql = getSql();
  const result = await sql`INSERT INTO saidas 
    (name, description, date, valor, is_paid, is_entrada, categoria_id) 
    VALUES 
    (${saida.name}, ${saida.description}, ${saida.date}, ${saida.valor}, ${saida.is_paid}, TRUE, ${saida.categoria_id}) RETURNING *`;
  return result;
}
