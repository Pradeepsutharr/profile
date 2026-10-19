const bcrypt = require("bcryptjs");
const { Client } = require("pg");
const path = require("node:path");
require("dotenv").config({ path: path.join(process.cwd(), ".env.local") });

const defaultHomeContent = {
  eyebrow: "The designer & developer",
  headlineWords: ["Crafting", "SaaS", "&", "Web", "Interfaces", "as", "a"],
  highlight: "Product Designer",
  suffix: "& Frontend Developer",
  socialProof: "Loved by 40+ founders & teams",
  stats: [
    ["5+", "Years experience"],
    ["40+", "Projects shipped"],
    ["98%", "Client satisfaction"],
  ],
  pillars: [
    [
      "01",
      "Product thinking & UX research",
      "I help startups and businesses design and build high-impact digital products — combining user research, interface design, product thinking and modern front-end development.",
    ],
    [
      "02",
      "Design-to-code engineering",
      "From validating ideas through research to pixel-perfect UI and production-ready React / Next.js — I deliver complete product solutions, not just screens.",
    ],
  ],
  servicesDescription:
    "Research-driven UI/UX design and front-end development that bridges creative visual logic and technical performance.",
  testimonials: [
    [
      "Pradeep didn't just design screens — he rethought our whole onboarding. Activation jumped within weeks.",
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
  ],
  philosophy:
    "I help brands create modern, responsive and user-centred digital products — bridging design and engineering to bring your vision to life with",
  philosophyHighlight: "precision and creativity",
};

const defaultIntro =
  "I specialise in UX research, UI/UX design, scalable design systems and high-performance web apps built with React and Next.js.";
const defaultSummary = `${defaultHomeContent.philosophy} ${defaultHomeContent.philosophyHighlight}.`;

async function main() {
  const { DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!DATABASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD)
    throw new Error(
      "Set DATABASE_URL, ADMIN_EMAIL, and ADMIN_PASSWORD before seeding.",
    );
  if (ADMIN_PASSWORD.length < 12)
    throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl:
      process.env.DATABASE_SSL === "true"
        ? { rejectUnauthorized: false }
        : undefined,
  });
  await client.connect();
  try {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await client.query(
      "INSERT INTO admin_accounts (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, is_active = true",
      [ADMIN_EMAIL.toLowerCase(), hash],
    );
    await client.query(
      "INSERT INTO site_settings (id, colors) VALUES ('primary', '{}'::jsonb) ON CONFLICT (id) DO NOTHING",
    );
    await client.query(
      `INSERT INTO profile (
         id, name, title, intro, summary, email, phone, location, avatar_url, socials, availability, home
       ) VALUES (
         'primary', $1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11::jsonb
       )
       ON CONFLICT (id) DO UPDATE SET
         intro = CASE
           WHEN profile.intro IS NULL OR btrim(profile.intro) = '' OR profile.intro IN ('Short summary', 'summary')
           THEN EXCLUDED.intro ELSE profile.intro END,
         summary = CASE
           WHEN profile.summary IS NULL OR btrim(profile.summary) = '' OR profile.summary IN ('Short summary', 'summary')
           THEN EXCLUDED.summary ELSE profile.summary END,
         availability = COALESCE(NULLIF(btrim(profile.availability), ''), EXCLUDED.availability),
         home = CASE
           WHEN profile.home IS NULL OR profile.home = '{}'::jsonb THEN EXCLUDED.home
           ELSE profile.home END,
         updated_at = now()`,
      [
        "Pradeep Suthar",
        "Product Designer",
        defaultIntro,
        defaultSummary,
        "hello@pradeepsuthar.com",
        "+91 70239 27315",
        "Ahmedabad, Gujarat, India",
        "/images/logo.png",
        JSON.stringify({ github: "#", linkedin: "#", instagram: "#" }),
        "Available for work",
        JSON.stringify(defaultHomeContent),
      ],
    );
    console.log(`Admin account ready for ${ADMIN_EMAIL.toLowerCase()}.`);
    console.log("Profile homepage content is ready.");
  } finally {
    await client.end();
  }
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
