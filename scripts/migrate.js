const fs = require("node:fs");
const path = require("node:path");
const { Client } = require("pg");
require("dotenv").config({ path: path.join(process.cwd(), ".env.local") });

const defaultTestimonials = [
  [
    "Pradeep didn't just design screens - he rethought our whole onboarding. Activation jumped within weeks.",
    "Ananya R.",
    "Founder, Fintech startup",
  ],
  [
    "Rare combination: a designer who writes production-grade React. Handoff friction went to zero.",
    "Marcus L.",
    "CTO, SaaS company",
  ],
  [
    "Fast, thoughtful and genuinely invested in the outcome. Our design system finally makes sense.",
    "Sofia K.",
    "Head of Product",
  ],
];

function normalizeLegacyTestimonials(raw) {
  if (!Array.isArray(raw) || !raw.length) return defaultTestimonials;
  return raw
    .map((item) => {
      if (Array.isArray(item)) {
        const [quote, author_name, author_role] = item;
        return [quote, author_name, author_role || ""];
      }
      if (item && typeof item === "object") {
        return [
          item.quote || item.text || "",
          item.author_name || item.name || "",
          item.author_role || item.role || "",
        ];
      }
      return null;
    })
    .filter((row) => row?.[0] && row?.[1]);
}

async function seedTestimonialsIfEmpty(client) {
  const { rows } = await client.query(
    "SELECT COUNT(*)::int AS count FROM testimonials",
  );
  if (rows[0].count > 0) return;

  const profile = await client.query(
    "SELECT home FROM profile WHERE id = 'primary' LIMIT 1",
  );
  const fromHome = normalizeLegacyTestimonials(profile.rows[0]?.home?.testimonials);
  for (let index = 0; index < fromHome.length; index += 1) {
    const [quote, author_name, author_role] = fromHome[index];
    await client.query(
      `INSERT INTO testimonials (quote, author_name, author_role, sort_order, published)
       VALUES ($1, $2, $3, $4, true)`,
      [quote, author_name, author_role || null, index],
    );
  }
  console.log(`Seeded ${fromHome.length} testimonials from profile.home.`);
}

async function main() {
  if (!process.env.DATABASE_URL)
    throw new Error("Set DATABASE_URL before running migrations.");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.DATABASE_SSL === "true"
        ? { rejectUnauthorized: false }
        : undefined,
  });
  await client.connect();
  try {
    await client.query(
      fs.readFileSync(path.join(process.cwd(), "database/schema.sql"), "utf8"),
    );
    console.log("Database schema is ready.");
    await seedTestimonialsIfEmpty(client);
  } finally {
    await client.end();
  }
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
