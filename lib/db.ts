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


// ********** ENTRADA OPERATIONS ***********