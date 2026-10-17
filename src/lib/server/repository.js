import "server-only";

import { adminResources, defaultColors, publicResources } from "@/lib/site-config";
import { ApiError } from "./errors";
import { query } from "./db";

function config(resource) {
  const found = adminResources[resource];
  if (!found) throw new ApiError(404, "Unknown resource");
  return found;
}

function cleanValue(key, value) {
  if (["sort_order", "score"].includes(key)) return Number(value || 0);
  if (["published", "is_read", "is_starred"].includes(key)) return Boolean(value);
  if (["tags", "tech_stack", "bullets", "gallery", "metrics"].includes(key)) return Array.isArray(value) ? value : value ? JSON.parse(value) : [];
  if (typeof value === "string") return value.trim();
  return value ?? null;
}

export function validatePayload(resource, payload, { partial = false } = {}) {
  const { fields } = config(resource);
  const data = {};
  for (const field of fields) {
    if (Object.hasOwn(payload, field)) data[field] = cleanValue(field, payload[field]);
  }
  if (!partial && ["projects", "posts", "services"].includes(resource) && !data.title) throw new ApiError(400, "Title is required");
  if (!partial && resource === "skills" && !data.name) throw new ApiError(400, "Name is required");
  if (!partial && resource === "experience" && !data.company) throw new ApiError(400, "Company is required");
  if (!partial && resource === "education" && !data.institution) throw new ApiError(400, "Institution is required");
  if (!partial && resource === "contacts" && (!data.name || !data.email || !data.message)) throw new ApiError(400, "Name, email, and message are required");
  if (!Object.keys(data).length) throw new ApiError(400, "No valid fields were supplied");
  return data;
}

export async function list(resource, { publicOnly = false, slug } = {}) {
  const { table, order } = config(resource);
  if (publicOnly && !publicResources.has(resource)) throw new ApiError(404, "Resource is not public");
  const conditions = [];
  const values = [];
  if (publicOnly && ["projects", "posts", "services"].includes(resource)) conditions.push("published = true");
  if (slug) { values.push(slug); conditions.push(`slug = $${values.length}`); }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const { rows } = await query(`SELECT * FROM ${table} ${where} ORDER BY ${order}`, values);
  return rows;
}

export async function getOne(resource, id) {
  const { table } = config(resource);
  const { rows } = await query(`SELECT * FROM ${table} WHERE id = $1 LIMIT 1`, [id]);
  if (!rows[0]) throw new ApiError(404, "Record not found");
  return rows[0];
}

export async function create(resource, payload) {
  const { table } = config(resource);
  const data = validatePayload(resource, payload);
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
  const { rows } = await query(`INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`, values);
  return rows[0];
}

export async function update(resource, id, payload) {
  const { table } = config(resource);
  const data = validatePayload(resource, payload, { partial: true });
  const columns = Object.keys(data);
  const values = Object.values(data);
  const assignments = columns.map((column, index) => `${column} = $${index + 1}`).join(", ");
  const timestamp = ["projects", "posts", "services", "skills", "experience", "education"].includes(resource) ? ", updated_at = now()" : "";
  const { rows } = await query(`UPDATE ${table} SET ${assignments}${timestamp} WHERE id = $${values.length + 1} RETURNING *`, [...values, id]);
  if (!rows[0]) throw new ApiError(404, "Record not found");
  return rows[0];
}

export async function remove(resource, id) {
  const { table } = config(resource);
  const { rowCount } = await query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  if (!rowCount) throw new ApiError(404, "Record not found");
}

export async function getProfile() {
  const { rows } = await query("SELECT * FROM profile WHERE id = 'primary' LIMIT 1");
  return rows[0] || null;
}

export async function saveProfile(payload) {
  const allowed = ["name", "title", "intro", "summary", "email", "phone", "location", "avatar_url", "socials", "availability"];
  const data = Object.fromEntries(allowed.filter((field) => Object.hasOwn(payload, field)).map((field) => [field, field === "socials" ? payload[field] || {} : payload[field]]));
  if (!data.name || !data.title) throw new ApiError(400, "Name and title are required");
  const columns = Object.keys(data);
  const values = Object.values(data);
  const updates = columns.map((column) => `${column} = EXCLUDED.${column}`).join(", ");
  const { rows } = await query(`INSERT INTO profile (id, ${columns.join(", ")}) VALUES ('primary', ${columns.map((_, i) => `$${i + 1}`).join(", ")}) ON CONFLICT (id) DO UPDATE SET ${updates}, updated_at = now() RETURNING *`, values);
  return rows[0];
}

export async function getSettings() {
  const { rows } = await query("SELECT colors FROM site_settings WHERE id = 'primary' LIMIT 1");
  return { colors: { ...defaultColors, ...(rows[0]?.colors || {}) } };
}

export async function saveSettings(payload) {
  const colors = { ...defaultColors, ...(payload.colors || {}) };
  const { rows } = await query("INSERT INTO site_settings (id, colors) VALUES ('primary', $1) ON CONFLICT (id) DO UPDATE SET colors = EXCLUDED.colors, updated_at = now() RETURNING *", [colors]);
  return { colors: rows[0].colors };
}
