// lib/db.ts (or lib/db.js)

import { Pool, QueryResult } from 'pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables.');
}

const pool = new Pool({
    connectionString
})

// --- FIX HERE: Add 'async' and 'return' ---
// Also, add 'params' (second argument) to enable secure parameterized queries later.

export const query = async <T>(text: string, params?: any[]): Promise<QueryResult<T>> => {
  // 1. You MUST return the result of the pool.query() call.
  // 2. The pool.query() method is asynchronous, so we await it here.
  // 3. We also include the optional 'params' argument for security.
  return await pool.query(text, params);
}