import "server-only";

import sanitizeHtml from "sanitize-html";
import {
  adminResources,
  defaultColors,
  publicResources,
} from "@/lib/site-config";
import { ApiError } from "./errors";
import { query } from "./db";

function config(resource) {
  const found = adminResources[resource];
  if (!found) throw new ApiError(404, "Unknown resource");
  return found;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeGallery(value) {
  return (Array.isArray(value) ? value : [])
    .map((image) => {
      if (typeof image === "string") return image;
      if (image && typeof image === "object")
        return image.url || image.src || image.image_url;
      return null;
    })
    .filter((image) => typeof image === "string" && image.trim())
    .map((image) => image.trim());
}

function normalizeRecord(resource, record) {
  if (resource !== "projects") return record;
  return { ...record, gallery: normalizeGallery(record.gallery) };
}

function fieldLabel(key) {
  return String(key || "field")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const jsonbArrayFields = new Set(["gallery", "metrics"]);
const textArrayFields = new Set(["tags", "tech_stack", "bullets"]);

function parseListField(key, value) {
  const label = fieldLabel(key);
  const examples = {
    tags: '["UX research", "React"]',
    tech_stack: '["Figma", "Next.js"]',
    bullets: '["Led product discovery", "Shipped the redesign"]',
    gallery: '["https://cdn.example.com/shot-1.jpg"]',
    metrics: '[{"label":"Conversion lift","value":"+24%"}]',
  };
  if (value === null || value === undefined || value === "") return [];
  let parsed = value;
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      throw new ApiError(
        400,
        `${label} must be valid JSON. Example: ${examples[key] || "[]"}`,
        { field: key },
      );
    }
  }
  if (!Array.isArray(parsed))
    throw new ApiError(
      400,
      `${label} must be a JSON array. Example: ${examples[key] || "[]"}`,
      { field: key },
    );
  return parsed;
}

function normalizeMetrics(value) {
  return value.map((item, index) => {
    if (typeof item === "string" && item.trim()) {
      return { label: item.trim(), value: item.trim() };
    }
    if (item && typeof item === "object" && !Array.isArray(item)) {
      const label = String(item.label ?? item.name ?? item.title ?? "").trim();
      const metricValue = String(
        item.value ?? item.metric ?? item.stat ?? "",
      ).trim();
      if (!label || !metricValue)
        throw new ApiError(
          400,
          `Metrics item ${index + 1} needs both "label" and "value", for example {"label":"Conversion lift","value":"+24%"}.`,
          { field: "metrics" },
        );
      return { label, value: metricValue };
    }
    throw new ApiError(
      400,
      `Metrics must be objects with label and value, for example [{"label":"Conversion lift","value":"+24%"}]. Item ${index + 1} is invalid.`,
      { field: "metrics" },
    );
  });
}

function normalizeTextArray(key, value) {
  return value.map((item, index) => {
    if (typeof item === "string" && item.trim()) return item.trim();
    if (typeof item === "number" && Number.isFinite(item)) return String(item);
    throw new ApiError(
      400,
      `${fieldLabel(key)} item ${index + 1} must be text.`,
      { field: key },
    );
  });
}

function cleanValue(key, value) {
  if (key === "content") {
    return sanitizeHtml(String(value || ""), {
      allowedTags: [
        "p",
        "br",
        "strong",
        "em",
        "u",
        "s",
        "h2",
        "h3",
        "h4",
        "blockquote",
        "pre",
        "code",
        "ol",
        "ul",
        "li",
        "a",
      ],
      allowedAttributes: {
        a: ["href", "target", "rel"],
        pre: ["class", "data-language"],
        code: ["class"],
      },
      allowedClasses: {
        pre: ["ql-syntax", "blog-code-block", /^language-/],
        code: ["blog-code-inline", "blog-code-line", /^language-/],
      },
      allowedSchemes: ["http", "https", "mailto"],
      transformTags: {
        a: sanitizeHtml.simpleTransform("a", {
          rel: "noopener noreferrer",
          target: "_blank",
        }),
        // Quill 2 code-block markup → semantic <pre>/<code>
        div: (_tagName, attribs) => {
          const className = String(attribs.class || "");
          if (className.includes("ql-code-block-container")) {
            return {
              tagName: "pre",
              attribs: {
                class: "blog-code-block",
                ...(attribs["data-language"]
                  ? { "data-language": attribs["data-language"] }
                  : {}),
              },
            };
          }
          if (className.includes("ql-code-block")) {
            return {
              tagName: "code",
              attribs: { class: "blog-code-line" },
            };
          }
          // Discard Quill UI chrome and unknown wrappers; keep text children.
          return {};
        },
      },
    }).trim();
  }
  if (["sort_order", "score"].includes(key)) {
    if (value === null || value === undefined || value === "") return 0;
    const number = Number(value);
    if (!Number.isFinite(number))
      throw new ApiError(
        400,
        `${fieldLabel(key)} must be a whole number, for example ${key === "score" ? "85" : "0"}.`,
        { field: key },
      );
    if (key === "score" && (number < 0 || number > 100))
      throw new ApiError(400, "Score must be between 0 and 100.", {
        field: "score",
      });
    return number;
  }
  if (["published", "featured", "is_read", "is_starred"].includes(key)) {
    if (typeof value === "boolean") return value;
    if (value === "true" || value === 1 || value === "1") return true;
    if (value === "false" || value === 0 || value === "0" || value === "")
      return false;
    throw new ApiError(
      400,
      `${fieldLabel(key)} must be turned on or off.`,
      { field: key },
    );
  }
  if (["start_date", "end_date", "published_at"].includes(key)) {
    if (!value) return null;
    const raw = String(value).trim();
    if (!/^\d{4}-\d{2}-\d{2}/.test(raw))
      throw new ApiError(
        400,
        `${fieldLabel(key)} must be a valid date in YYYY-MM-DD format.`,
        { field: key },
      );
    return raw.slice(0, 10);
  }
  if (key === "gallery") return normalizeGallery(parseListField(key, value));
  if (key === "metrics") return normalizeMetrics(parseListField(key, value));
  if (textArrayFields.has(key))
    return normalizeTextArray(key, parseListField(key, value));
  if (key === "status") {
    const allowed = new Set(["new", "read", "replied", "archived"]);
    const status = String(value || "new").trim().toLowerCase();
    if (!allowed.has(status))
      throw new ApiError(
        400,
        "Status must be one of: new, read, replied, or archived.",
        { field: "status" },
      );
    return status;
  }
  if (typeof value === "string") return value.trim();
  return value ?? null;
}

/** node-pg encodes JS arrays as Postgres arrays; jsonb columns need JSON text. */
function encodeDbValues(data) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      jsonbArrayFields.has(key) ? JSON.stringify(value ?? []) : value,
    ]),
  );
}

export function validatePayload(resource, payload, { partial = false } = {}) {
  const { fields } = config(resource);
  const data = {};
  for (const field of fields) {
    if (Object.hasOwn(payload, field))
      data[field] = cleanValue(field, payload[field]);
  }
  if (
    ["projects", "posts", "services"].includes(resource) &&
    Object.hasOwn(data, "title") &&
    !data.title
  )
    throw new ApiError(400, "Title cannot be empty.", { field: "title" });
  if (
    !partial &&
    ["projects", "posts", "services"].includes(resource) &&
    !data.title
  )
    throw new ApiError(400, "Title is required.", { field: "title" });
  if (!partial && resource === "skills" && !data.name)
    throw new ApiError(400, "Skill name is required.", { field: "name" });
  if (!partial && resource === "experience" && !data.company)
    throw new ApiError(400, "Company is required.", { field: "company" });
  if (!partial && resource === "education" && !data.institution)
    throw new ApiError(400, "Institution is required.", {
      field: "institution",
    });
  if (!partial && resource === "contacts") {
    if (!data.name)
      throw new ApiError(400, "Name is required.", { field: "name" });
    if (!data.email)
      throw new ApiError(400, "Email is required.", { field: "email" });
    if (!data.message)
      throw new ApiError(400, "Message is required.", { field: "message" });
  }
  if (!Object.keys(data).length)
    throw new ApiError(400, "No valid fields were supplied.");
  if (
    !partial &&
    ["projects", "posts", "services"].includes(resource) &&
    !data.slug
  )
    data.slug = slugify(data.title);
  if (
    !partial &&
    ["projects", "posts", "services"].includes(resource) &&
    !data.slug
  )
    throw new ApiError(400, "A title is required to generate a slug.", {
      field: "title",
    });
  return data;
}

export async function list(resource, { publicOnly = false, slug } = {}) {
  const { table, order } = config(resource);
  if (publicOnly && !publicResources.has(resource))
    throw new ApiError(404, "Resource is not public");
  const conditions = [];
  const values = [];
  if (publicOnly && ["projects", "posts", "services"].includes(resource))
    conditions.push("published = true");
  if (slug) {
    values.push(slug);
    conditions.push(`slug = $${values.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const { rows } = await query(
    `SELECT * FROM ${table} ${where} ORDER BY ${order}`,
    values,
  );
  return rows.map((row) => normalizeRecord(resource, row));
}

export async function getOne(resource, id) {
  const { table } = config(resource);
  const { rows } = await query(`SELECT * FROM ${table} WHERE id = $1 LIMIT 1`, [
    id,
  ]);
  if (!rows[0]) throw new ApiError(404, "Record not found");
  return normalizeRecord(resource, rows[0]);
}

export async function create(resource, payload) {
  const { table } = config(resource);
  const data = encodeDbValues(validatePayload(resource, payload));
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
  const { rows } = await query(
    `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`,
    values,
  );
  return normalizeRecord(resource, rows[0]);
}

export async function update(resource, id, payload) {
  const { table } = config(resource);
  const data = encodeDbValues(
    validatePayload(resource, payload, { partial: true }),
  );
  const columns = Object.keys(data);
  const values = Object.values(data);
  const assignments = columns
    .map((column, index) => `${column} = $${index + 1}`)
    .join(", ");
  const timestamp = [
    "projects",
    "posts",
    "services",
    "skills",
    "experience",
    "education",
  ].includes(resource)
    ? ", updated_at = now()"
    : "";
  const { rows } = await query(
    `UPDATE ${table} SET ${assignments}${timestamp} WHERE id = $${values.length + 1} RETURNING *`,
    [...values, id],
  );
  if (!rows[0]) throw new ApiError(404, "Record not found");
  return normalizeRecord(resource, rows[0]);
}

export async function remove(resource, id) {
  const { table } = config(resource);
  const { rowCount } = await query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  if (!rowCount) throw new ApiError(404, "Record not found");
}

export async function getProfile() {
  const { rows } = await query(
    "SELECT * FROM profile WHERE id = 'primary' LIMIT 1",
  );
  return rows[0] || null;
}

export async function saveProfile(payload) {
  const allowed = [
    "name",
    "title",
    "intro",
    "summary",
    "email",
    "phone",
    "location",
    "avatar_url",
    "socials",
    "availability",
    "home",
  ];
  const data = Object.fromEntries(
    allowed
      .filter((field) => Object.hasOwn(payload, field))
      .map((field) => {
        if (field === "socials") return [field, payload[field] || {}];
        if (field === "home")
          return [
            field,
            typeof payload[field] === "string"
              ? payload[field]
              : JSON.stringify(payload[field] || {}),
          ];
        return [field, payload[field]];
      }),
  );
  if (!data.name || !data.title)
    throw new ApiError(400, "Name and title are required");
  const columns = Object.keys(data);
  const values = Object.values(data);
  const casts = columns.map((column, index) =>
    column === "socials" || column === "home"
      ? `$${index + 1}::jsonb`
      : `$${index + 1}`,
  );
  const updates = columns
    .map((column) => `${column} = EXCLUDED.${column}`)
    .join(", ");
  const { rows } = await query(
    `INSERT INTO profile (id, ${columns.join(", ")}) VALUES ('primary', ${casts.join(", ")}) ON CONFLICT (id) DO UPDATE SET ${updates}, updated_at = now() RETURNING *`,
    values,
  );
  return rows[0];
}

export async function getSettings() {
  const { rows } = await query(
    "SELECT colors FROM site_settings WHERE id = 'primary' LIMIT 1",
  );
  return { colors: { ...defaultColors, ...(rows[0]?.colors || {}) } };
}

export async function saveSettings(payload) {
  if (
    !payload?.colors ||
    typeof payload.colors !== "object" ||
    Array.isArray(payload.colors)
  )
    throw new ApiError(400, "Color settings must be sent as an object.");
  for (const [key, value] of Object.entries(payload.colors)) {
    if (Object.hasOwn(defaultColors, key) && !/^#[0-9a-fA-F]{6}$/.test(value)) {
      throw new ApiError(
        400,
        `${key.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)} must be a six-digit hex color, such as #FFDB70.`,
      );
    }
  }
  const colors = { ...defaultColors, ...payload.colors };
  const { rows } = await query(
    "INSERT INTO site_settings (id, colors) VALUES ('primary', $1) ON CONFLICT (id) DO UPDATE SET colors = EXCLUDED.colors, updated_at = now() RETURNING *",
    [colors],
  );
  return { colors: rows[0].colors };
}
