const { Client } = require("pg");
const path = require("node:path");
require("dotenv").config({ path: path.join(process.cwd(), ".env.local") });

const defaultFaqs = [
  [
    "What kind of projects do you take on?",
    "Product design and frontend builds for SaaS, startups, and digital products - from UX research and interface design to React/Next.js implementation.",
  ],
  [
    "Do you handle both design and development?",
    "Yes. I bridge design and engineering so handoff friction drops and the shipped product matches the intent.",
  ],
  [
    "How quickly can we start?",
    "Most conversations move to a clear next-step plan within 12-24 hours after you share a brief on the contact page.",
  ],
  [
    "Where are you based?",
    "Ahmedabad, India - working with teams worldwide remotely.",
  ],
];

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.DATABASE_SSL === "true"
        ? { rejectUnauthorized: false }
        : undefined,
  });
  await client.connect();
  try {
    const { rows } = await client.query(
      "SELECT home FROM profile WHERE id = 'primary'",
    );
    const home =
      rows[0]?.home && typeof rows[0].home === "object" ? { ...rows[0].home } : {};
    if (!Array.isArray(home.faqs) || !home.faqs.length) home.faqs = defaultFaqs;

    await client.query(
      `UPDATE profile SET
        seo_title = COALESCE(NULLIF(btrim(seo_title), ''), $1),
        seo_description = COALESCE(NULLIF(btrim(seo_description), ''), $2),
        keywords = COALESCE(NULLIF(btrim(keywords), ''), $3),
        og_image_url = COALESCE(NULLIF(btrim(og_image_url), ''), '/images/portrait.webp'),
        home = $4::jsonb,
        updated_at = now()
       WHERE id = 'primary'`,
      [
        "Pradeep Suthar - Product Designer & Frontend Developer",
        "Hire Pradeep Suthar for UX research, product design, design systems, and high-performance React/Next.js interfaces that convert.",
        "product designer, UX designer, frontend developer, Next.js, React, design systems, Ahmedabad, hire product designer",
        JSON.stringify(home),
      ],
    );

    await client.query(`
      UPDATE projects SET
        seo_title = COALESCE(NULLIF(btrim(seo_title), ''), title),
        seo_description = COALESCE(NULLIF(btrim(seo_description), ''), LEFT(COALESCE(excerpt, description, title), 155)),
        keywords = COALESCE(NULLIF(btrim(keywords), ''), array_to_string(tags, ', '))
      WHERE published = true
    `);

    await client.query(`
      UPDATE blog_posts SET
        seo_title = COALESCE(NULLIF(btrim(seo_title), ''), title),
        seo_description = COALESCE(NULLIF(btrim(seo_description), ''), LEFT(COALESCE(excerpt, title), 155))
      WHERE published = true
    `);

    await client.query(`
      UPDATE services SET
        seo_title = COALESCE(NULLIF(btrim(seo_title), ''), title || ' Services'),
        seo_description = COALESCE(NULLIF(btrim(seo_description), ''), LEFT(COALESCE(description, title), 155)),
        keywords = COALESCE(NULLIF(btrim(keywords), ''), array_to_string(tags, ', '))
      WHERE published = true
    `);

    const check = await client.query(
      "SELECT seo_title, left(seo_description, 80) AS seo_description, keywords FROM profile WHERE id = 'primary'",
    );
    console.log("SEO seed complete:", check.rows[0]);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
