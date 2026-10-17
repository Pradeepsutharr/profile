const fs = require("node:fs/promises");
const path = require("node:path");
const { Client } = require("pg");

const sourceUrl = process.env.SOURCE_DATABASE_URL;
const destinationUrl = process.env.DATABASE_URL;
const includePrivate = process.env.IMPORT_PRIVATE_DATA === "true";
const sourceUploadDirectory = process.env.SOURCE_UPLOAD_DIR;
const destinationUploadDirectory = process.env.DESTINATION_UPLOAD_DIR || path.join(process.cwd(), "public", "uploads", "legacy");

if (!sourceUrl || !destinationUrl) {
  throw new Error("Set SOURCE_DATABASE_URL and DATABASE_URL before running this importer.");
}

function connectionOptions(url) {
  return {
    connectionString: url,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  };
}

function slugify(value, fallback) {
  const slug = String(value || fallback || "record")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || fallback;
}

function asArray(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function localizeAssetUrl(value) {
  if (typeof value === "string") {
    const marker = "/storage/v1/object/public/portfolio/";
    const index = value.indexOf(marker);
    if (index >= 0) return `/uploads/legacy/portfolio/${decodeURIComponent(value.slice(index + marker.length))}`;
    return value;
  }
  if (Array.isArray(value)) return value.map(localizeAssetUrl);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localizeAssetUrl(item)]));
  return value;
}

function externalUrl(value) {
  if (typeof value !== "string" || !value.trim()) return value || null;
  const url = value.trim();
  return /^(https?:\/\/|mailto:|tel:|#|\/)/i.test(url) ? url : `https://${url}`;
}

function normalizeSocials(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).map(([key, url]) => [key, externalUrl(url)]));
}

function asLocation(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  if (typeof value === "object") {
    const preferred = [value.city, value.state, value.region, value.country].filter(Boolean);
    return (preferred.length ? preferred : Object.values(value).filter((item) => typeof item === "string")).join(", ") || null;
  }
  return null;
}

function firstImage(project) {
  if (project.bg_image) return localizeAssetUrl(project.bg_image);
  const candidate = asArray(project.project_images)[0];
  if (typeof candidate === "string") return localizeAssetUrl(candidate);
  return localizeAssetUrl(candidate?.url || candidate?.src || candidate?.image_url || null);
}

function gallery(project) {
  return asArray(project.project_images).map((item) => typeof item === "string" ? { url: localizeAssetUrl(item) } : localizeAssetUrl(item)).filter(Boolean);
}

async function copyLegacyMedia() {
  if (!sourceUploadDirectory) return 0;
  const sourceRoot = path.join(sourceUploadDirectory, "portfolio");
  const destinationRoot = path.join(destinationUploadDirectory, "portfolio");
  try {
    await fs.access(sourceRoot);
    await fs.mkdir(destinationRoot, { recursive: true });
    await fs.cp(sourceRoot, destinationRoot, { recursive: true, force: true });
    const files = await fs.readdir(destinationRoot, { recursive: true });
    return files.length;
  } catch (error) {
    if (error.code === "ENOENT") return 0;
    throw error;
  }
}

async function readRows(client, table) {
  const result = await client.query(`SELECT * FROM ${table}`);
  return result.rows;
}

async function archive(destination, table, rows) {
  for (const row of rows) {
    const sourceId = String(row.id || row.gmail_message_id || `${table}-${row.created_at || Date.now()}`);
    await destination.query(
      `INSERT INTO legacy_source_records (source_table, source_id, payload)
       VALUES ($1, $2, $3::jsonb)
       ON CONFLICT (source_table, source_id) DO UPDATE SET payload = EXCLUDED.payload, imported_at = now()`,
      [table, sourceId, JSON.stringify(row)],
    );
  }
}

async function importProfile(destination, users, profileRows) {
  const active = users.find((user) => user.is_active) || users[0] || {};
  const storedProfile = profileRows[0] || {};
  const metadata = active.metadata || {};
  const title = storedProfile.title || active.profile_titles?.[0] || active.roles?.[0] || "Product Designer";
  const summary = storedProfile.summary || active.profile_summaries?.join(" ") || metadata.summary || "";
  await destination.query(
    `INSERT INTO profile (id, name, title, intro, summary, email, phone, location, avatar_url, socials, availability)
     VALUES ('primary', $1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name, title = EXCLUDED.title, intro = EXCLUDED.intro, summary = EXCLUDED.summary,
       email = EXCLUDED.email, phone = EXCLUDED.phone, location = EXCLUDED.location, avatar_url = EXCLUDED.avatar_url,
       socials = EXCLUDED.socials, availability = EXCLUDED.availability, updated_at = now()`,
    [
      storedProfile.name || active.name || "Portfolio owner",
      title,
      metadata.intro || summary,
      summary,
      active.email || null,
      active.phone || null,
      asLocation(active.location),
      localizeAssetUrl(storedProfile.profile_image_url || active.avatar_url || null),
      JSON.stringify(normalizeSocials(active.socials)),
      metadata.availability || "Available for select product work",
    ],
  );
}

async function importServices(destination, rows) {
  for (const [index, row] of rows.entries()) {
    await destination.query(
      `INSERT INTO services (id, title, slug, description, icon, tags, sort_order, published, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8)
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, slug = EXCLUDED.slug, description = EXCLUDED.description,
       icon = EXCLUDED.icon, tags = EXCLUDED.tags, sort_order = EXCLUDED.sort_order, published = true`,
      [row.id, row.title, row.slug || slugify(row.title, `service-${index + 1}`), row.description || "", row.icon || null, [], row.order ?? index + 1, row.created_at || new Date()],
    );
  }
}

async function importProjects(destination, rows) {
  for (const [index, row] of rows.entries()) {
    const description = row.description || "";
    await destination.query(
      `INSERT INTO projects (id, title, slug, excerpt, description, image_url, gallery, tags, tech_stack, category, role, year, project_url, sort_order, published, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11, $12, $13, $14, true, $15, $16)
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, slug = EXCLUDED.slug, excerpt = EXCLUDED.excerpt,
       description = EXCLUDED.description, image_url = EXCLUDED.image_url, gallery = EXCLUDED.gallery, tags = EXCLUDED.tags,
       tech_stack = EXCLUDED.tech_stack, category = EXCLUDED.category, role = EXCLUDED.role, year = EXCLUDED.year,
       project_url = EXCLUDED.project_url, sort_order = EXCLUDED.sort_order, published = true, updated_at = now()`,
      [row.id, row.title, row.slug || slugify(row.title, `project-${index + 1}`), row.meta_description || description.slice(0, 220), description, firstImage(row), JSON.stringify(gallery(row)), row.tags || [], row.tech_stack || [], row.category || row.service || null, row.service || null, row.created_at ? String(new Date(row.created_at).getFullYear()) : null, externalUrl(row.link), row.order ?? index + 1, row.created_at || new Date(), row.updated_at || row.created_at || new Date()],
    );
  }
}

async function importPosts(destination, rows) {
  for (const row of rows) {
    await destination.query(
      `INSERT INTO blog_posts (id, title, slug, excerpt, content, image_url, category, keywords, published, published_at, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, slug = EXCLUDED.slug, excerpt = EXCLUDED.excerpt,
       content = EXCLUDED.content, image_url = EXCLUDED.image_url, category = EXCLUDED.category, keywords = EXCLUDED.keywords,
       published = true, published_at = EXCLUDED.published_at, updated_at = now()`,
      [row.id, row.title, row.slug || slugify(row.title, `post-${row.id}`), row.description || row.meta_description || "", row.content || "", localizeAssetUrl(row.bg_image || null), row.category || null, row.keywords || null, row.created_at || new Date(), row.created_at || new Date(), row.updated_at || row.created_at || new Date()],
    );
  }
}

async function importSimple(destination, table, rows, mapper) {
  for (const [index, row] of rows.entries()) await mapper(destination, row, index);
}

async function importPrivate(destination, contacts, emails) {
  for (const row of contacts) {
    await destination.query(
      `INSERT INTO contacts (id, name, email, phone, topic, message, attachment_url, attachment_name, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone, topic = EXCLUDED.topic,
       message = EXCLUDED.message, attachment_url = EXCLUDED.attachment_url, attachment_name = EXCLUDED.attachment_name, status = EXCLUDED.status`,
      [row.id, row.name, row.email, row.phone || null, row.topic || null, row.message, localizeAssetUrl(row.attachment_url || null), row.attachment_name || null, row.status || "new", row.created_at || new Date()],
    );
  }
  for (const row of emails) {
    await destination.query(
      `INSERT INTO emails (id, gmail_message_id, gmail_thread_id, direction, from_email, from_name, to_email, subject, snippet, body_html, body_text, is_read, is_starred, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       ON CONFLICT (id) DO UPDATE SET gmail_message_id = EXCLUDED.gmail_message_id, gmail_thread_id = EXCLUDED.gmail_thread_id,
       direction = EXCLUDED.direction, from_email = EXCLUDED.from_email, from_name = EXCLUDED.from_name, to_email = EXCLUDED.to_email,
       subject = EXCLUDED.subject, snippet = EXCLUDED.snippet, body_html = EXCLUDED.body_html, body_text = EXCLUDED.body_text,
       is_read = EXCLUDED.is_read, is_starred = EXCLUDED.is_starred`,
      [row.id, row.gmail_message_id || null, row.gmail_thread_id || null, row.direction || null, row.from_email || null, row.from_name || null, row.to_email || null, row.subject || null, row.snippet || null, row.body_html || null, row.body_text || null, Boolean(row.is_read), Boolean(row.is_starred), row.created_at || new Date()],
    );
  }
  await destination.query("SELECT setval(pg_get_serial_sequence('contacts', 'id'), GREATEST(COALESCE((SELECT max(id) FROM contacts), 1), 1), true)");
}

async function importAdmins(destination, rows) {
  for (const row of rows) {
    await destination.query(
      `INSERT INTO admin_accounts (id, email, password_hash, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, is_active = EXCLUDED.is_active, updated_at = now()`,
      [row.id, row.email, row.password_hash, row.is_active !== false, row.created_at || new Date(), row.updated_at || row.created_at || new Date()],
    );
  }
}

async function main() {
  const source = new Client(connectionOptions(sourceUrl));
  const destination = new Client(connectionOptions(destinationUrl));
  await source.connect();
  await destination.connect();
  try {
    // A single pg Client serializes its work; reading sequentially avoids query
    // overlap and keeps this one-time migration deterministic.
    const users = await readRows(source, "users");
    const profile = await readRows(source, "profile");
    const services = await readRows(source, "services");
    const projects = await readRows(source, "projects");
    const skills = await readRows(source, "skills");
    const education = await readRows(source, "education");
    const experience = await readRows(source, "experience");
    const blogs = await readRows(source, "blogs");
    const contacts = includePrivate ? await readRows(source, "contacts") : [];
    const emails = includePrivate ? await readRows(source, "emails") : [];
    const admins = await readRows(source, "admin_accounts");
    const archiveSets = [["users", users], ["profile", profile], ["services", services], ["projects", projects], ["skills", skills], ["education", education], ["experience", experience], ["blogs", blogs], ["contacts", contacts], ["emails", emails]];
    const copiedMedia = await copyLegacyMedia();
    await destination.query("BEGIN");
    for (const [table, rows] of archiveSets) await archive(destination, table, rows);
    await importProfile(destination, users, profile);
    await importServices(destination, services);
    await importProjects(destination, projects);
    await importPosts(destination, blogs);
    await importSimple(destination, "skills", skills, (db, row, index) => db.query(`INSERT INTO skills (id, name, category, score, sort_order, created_at) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, score = EXCLUDED.score, sort_order = EXCLUDED.sort_order`, [row.id, row.name, row.category || null, row.score || 0, row.order ?? index + 1, row.created_at || new Date()]));
    await importSimple(destination, "experience", experience, (db, row, index) => db.query(`INSERT INTO experience (id, company, title, start_date, end_date, location, summary, bullets, sort_order, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO UPDATE SET company = EXCLUDED.company, title = EXCLUDED.title, start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date, location = EXCLUDED.location, summary = EXCLUDED.summary, bullets = EXCLUDED.bullets, sort_order = EXCLUDED.sort_order`, [row.id, row.company, row.title || null, row.start_date || null, row.end_date || null, row.location || null, row.responsibilities || null, row.bullets || [], row.order ?? index + 1, row.created_at || new Date()]));
    await importSimple(destination, "education", education, (db, row, index) => db.query(`INSERT INTO education (id, institution, degree, start_date, end_date, location, summary, sort_order, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO UPDATE SET institution = EXCLUDED.institution, degree = EXCLUDED.degree, start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date, location = EXCLUDED.location, summary = EXCLUDED.summary, sort_order = EXCLUDED.sort_order`, [row.id, row.institution, row.degree || null, row.start_date || null, row.end_date || null, row.location || null, row.description || null, row.order ?? index + 1, row.created_at || new Date()]));
    await importAdmins(destination, admins);
    if (includePrivate) await importPrivate(destination, contacts, emails);
    await destination.query("COMMIT");
    console.log(`Migrated ${projects.length} projects, ${blogs.length} posts, ${includePrivate ? `${contacts.length} inquiries plus ${emails.length} emails` : "public content"}, and ${copiedMedia} legacy media entries.`);
  } catch (error) {
    await destination.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    await Promise.all([source.end(), destination.end()]);
  }
}

main().catch((error) => {
  console.error(`Legacy import failed: ${error.message}`);
  process.exit(1);
});
