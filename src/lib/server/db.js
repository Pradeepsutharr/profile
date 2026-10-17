import "server-only";

import { Pool } from "pg";
import { ApiError } from "./errors";

let pool;

export function databaseReady() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new ApiError(
      503,
      "Database is not configured. Create .env.local from .env.example, set DATABASE_URL, then restart npm run dev."
    );
  }
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
