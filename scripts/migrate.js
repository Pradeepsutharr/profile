const fs = require("node:fs");
const path = require("node:path");
const { Client } = require("pg");
require("dotenv").config({ path: path.join(process.cwd(), ".env.local") });

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL before running migrations.");
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined });
  await client.connect();
  try {
    await client.query(fs.readFileSync(path.join(process.cwd(), "database/schema.sql"), "utf8"));
    console.log("Database schema is ready.");
  } finally { await client.end(); }
}
main().catch((error) => { console.error(error); process.exit(1); });
