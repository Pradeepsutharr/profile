const bcrypt = require("bcryptjs");
const { Client } = require("pg");
require("dotenv").config({ path: require("node:path").join(process.cwd(), ".env.local") });

async function main() {
  const { DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!DATABASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error("Set DATABASE_URL, ADMIN_EMAIL, and ADMIN_PASSWORD before seeding.");
  if (ADMIN_PASSWORD.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  const client = new Client({ connectionString: DATABASE_URL, ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined });
  await client.connect();
  try {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await client.query("INSERT INTO admin_accounts (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, is_active = true", [ADMIN_EMAIL.toLowerCase(), hash]);
    await client.query("INSERT INTO site_settings (id, colors) VALUES ('primary', '{}'::jsonb) ON CONFLICT (id) DO NOTHING");
    console.log(`Admin account ready for ${ADMIN_EMAIL.toLowerCase()}.`);
  } finally { await client.end(); }
}
main().catch((error) => { console.error(error); process.exit(1); });
