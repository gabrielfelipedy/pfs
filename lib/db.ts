"use server";

import { neon } from "@neondatabase/serverless";
import { ChartData, Operation } from "./definitions";

function getSql() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
}

// ***** CHART FUNCTIONS

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


// ** AUTHENTICATION

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

// ********** ENTRADA OPERATIONS ***********

export async function getEntradas() {
  const sql = getSql();
  try {
    const results = await sql`SELECT * FROM entradas ORDER BY date DESC`;
    return results as Operation[];
  } catch (error) {
    return [];
  }
}

export async function createDbRecordEntrada(saida: Operation) {
  
  const sql = getSql();
  const result = await sql`INSERT INTO saidas 
    (name, description, date, valor, is_paid, is_income, categoria_id) 
    VALUES 
    (${saida.name}, ${saida.description}, ${saida.date}, ${saida.value}, ${saida.is_paid}, TRUE, ${saida.category_id}) RETURNING *`;
  return result;
}

export async function getMonthlyEntradasEvolution() {
  const sql = getSql();

  try {
    const results = await sql`SELECT * FROM total_entradas_mes_byday`;
    return results as ChartData[];
  } catch (error) {
    return [];
  }
}

export async function getEntradasProportion() {
  const sql = getSql();

  try {
    const results = await sql`SELECT * FROM balanco_entradas`;
    return results;
  } catch (error) {
    return [];
  }
}