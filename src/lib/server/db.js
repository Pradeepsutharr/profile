import "server-only";

import { Pool } from "pg";

let pool;

export function databaseReady() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 10_000,
    });
  }
  return pool;
}

export async function query(text, values = []) {
  return getPool().query(text, values);
}
