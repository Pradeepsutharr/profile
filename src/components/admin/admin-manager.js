"use client";
/* eslint-disable @next/next/no-img-element -- CMS and legacy records can reference arbitrary remote image URLs. */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Archive,
  ArrowLeft,
  Check,
  Eye,
  FileText,
  FileUp,
  ImageIcon,
  LoaderCircle,
  MessageCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Send,
  Star,
  Trash2,
} from "lucide-react";
import { RichTextEditor } from "./rich-text-editor";
import { Notification } from "@/components/ui/notification";
import {
  assembleHomeFromFields,
  flattenHomeFields,
  homeAdminFieldKeys,
} from "@/lib/profile-home";
import { adminResources, defaultColors } from "@/lib/site-config";

const jsonFields = new Set(["tags", "tech_stack", "metrics", "bullets"]);
const longFields = new Set([
  "excerpt",
  "description",
  "challenge",
  "approach",
  "outcome",
  "summary",
  "message",
  "seo_description",
]);
const socialKeys = [
  "github",
  "linkedin",
  "instagram",
  "dribbble",
  "behance",
  "x",
  "website",
];
const homeTextareaKeys = new Set([
  "home_stats",
  "home_pillars",
  "home_testimonials",
  "home_services_description",
  "home_philosophy",
  "home_faqs",
]);
const seoFields = new Set(["seo_title", "seo_description", "keywords", "og_image_url"]);
const labelize = (value) =>
  value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const inputClass =
  "mt-2 w-full rounded-xl border bg-background px-3.5 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60";
const profileFields = [
  ["name", "Name", "text"],
  ["title", "Professional title", "text"],
  ["intro", "Hero introduction", "textarea"],
  ["summary", "Profile summary", "textarea"],
  ["email", "Email address", "email"],
  ["phone", "Phone", "tel"],
  ["location", "Location", "text"],
  ["avatar_url", "Profile image", "image"],
  ["availability", "Availability label", "text"],
  ["seo_title", "SEO title", "text"],
  ["seo_description", "SEO description", "textarea"],
  ["keywords", "SEO keywords (comma separated)", "text"],
  ["og_image_url", "Social share image", "image"],
  ["home_eyebrow", "Hero eyebrow", "text"],
  ["home_headline", "Hero headline words", "text"],
  ["home_highlight", "Hero highlight title", "text"],
  ["home_suffix", "Hero title suffix", "text"],
  ["home_social_proof", "Hero social proof", "text"],
  ["home_stats", "Stats (one per line: value|label)", "textarea"],
  ["home_pillars", "Pillars (one per line: number|title|description)", "textarea"],
  [
    "home_services_description",
    "Services section description",
    "textarea",
  ],
  [
    "home_testimonials",
    "Testimonials (one per line: quote|name|role)",
    "textarea",
  ],
  ["home_philosophy", "Product philosophy", "textarea"],
  ["home_philosophy_highlight", "Philosophy highlight phrase", "text"],
  ["home_faqs", "FAQs (one per line: question|answer)", "textarea"],
  ...socialKeys.map((key) => [
    key,
    key === "x" ? "X / Twitter" : labelize(key),
    "social",
  ]),
];
const profileGroups = [
  {
    title: "Identity",
    description: "Sidebar name, title, avatar, and contact-facing summary.",
    fields: ["name", "title", "intro", "summary", "avatar_url", "availability"],
  },
  {
    title: "SEO & sharing",
    description:
      "Titles, descriptions, keywords, and the image used in Google and social previews. Keep the title under ~60 characters and the description under ~160.",
    fields: ["seo_title", "seo_description", "keywords", "og_image_url"],
  },
  {
    title: "Homepage hero",
    description:
      "Hero text only. Portrait and floating visuals stay in the frontend code.",
    fields: [
      "home_eyebrow",
      "home_headline",
      "home_highlight",
      "home_suffix",
      "home_social_proof",
    ],
  },
  {
    title: "Homepage sections",
    description: "Stats, pillars, testimonials, philosophy, and FAQs for AEO.",
    fields: [
      "home_stats",
      "home_pillars",
      "home_services_description",
      "home_testimonials",
      "home_philosophy",
      "home_philosophy_highlight",
      "home_faqs",
    ],
  },
  {
    title: "Contact",
    description: "Ways for prospective clients to reach you.",
    fields: ["email", "phone", "location"],
  },
  {
    title: "Social profiles",
    description: "One field per profile. No JSON editing is needed.",
    fields: socialKeys,
  },
];
const appearanceGroups = [
  {
    title: "Dark theme",
    description: "Colors used when visitors select dark mode.",
    fields: [
      "darkShell",
      "darkBackground",
      "darkSurface",
      "darkPanel",
      "darkText",
      "darkMuted",
      "darkBorder",
      "darkPrimary",
    ],
  },
  {
    title: "Light theme",
    description: "Colors used when visitors select light mode.",
    fields: [
      "lightShell",
      "lightBackground",
      "lightSurface",
      "lightPanel",
      "lightText",
      "lightMuted",
      "lightBorder",
      "lightPrimary",
    ],
  },
  {
    title: "Shared accent",
    description: "The accent gradient is shared by both themes.",
    fields: ["gradientStart", "gradientEnd"],
  },
];
const appearanceFields = appearanceGroups.flatMap((group) =>
  group.fields.map((key) => [key, labelize(key), "color"]),
);
const hexColor = /^#[0-9a-fA-F]{6}$/;

async function api(path, options) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      body.error || "The request could not be completed.",
    );
    error.details = body.details;
    throw error;
  }
  return body.data;
}
function Notice({ message, tone = "error" }) {
  if (!message) return null;
  const success = tone === "success";
  const style = success
    ? "border-primary/30 bg-primary/10 text-primary"
    : "border-red-500/30 bg-red-500/10 text-red-500";
  const Icon = success ? Check : AlertCircle;
  return (
    <>
      <Notification
        key={`${tone}-${message}`}
        message={message}
        variant={success ? "success" : "error"}
      />
      <p
        role="alert"
        className={`mt-4 flex items-start gap-2 rounded-xl border px-3.5 py-3 text-sm ${style}`}
      >
        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
        {message}
      </p>
    </>
  );
}
function Skeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 border-b p-4 last:border-b-0"
        >
          <div className="h-16 w-24 animate-pulse rounded-xl bg-secondary" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-2/5 animate-pulse rounded bg-secondary" />
            <div className="h-2.5 w-3/5 animate-pulse rounded bg-secondary/80" />
          </div>
        </div>
      ))}
    </div>
  );
}
function initialValue(record, field) {
  const value = record?.[field];
  if (field === "gallery") return Array.isArray(value) ? value : [];
  if (jsonFields.has(field))
    return Array.isArray(value)
      ? JSON.stringify(value, null, 2)
      : value
        ? JSON.stringify(value, null, 2)
        : "[]";
  if (["published", "featured", "is_read", "is_starred"].includes(field))
    return Boolean(value);
  if (["start_date", "end_date", "published_at"].includes(field) && value)
    return String(value).slice(0, 10);
  return value ?? "";
}
function recordTitle(record = {}) {
  return (
    record.title ||
    record.name ||
    record.company ||
    record.institution ||
    record.subject ||
    "New record"
  );
}
function recordSummary(record = {}) {
  return (
    record.excerpt ||
    record.description ||
    record.summary ||
    record.message ||
    record.from_email ||
    "No summary added yet."
  );
}
function formatDate(value) {
  return value
    ? new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value))
    : " - ";
}

const linkUrlFields = new Set(["project_url"]);
const imageUploadFields = new Set([
  "image_url",
  "gallery",
  "avatar_url",
  "og_image_url",
]);
const fileUploadFields = new Set(["attachment_url"]);

function isImageUploadField(field) {
  if (imageUploadFields.has(field) || field === "gallery") return true;
  return /(image|avatar|portrait|banner|photo|cover)_?url$|^(image|avatar|portrait|banner|photo|cover)$/i.test(
    field,
  );
}

function isFileUploadField(field) {
  if (fileUploadFields.has(field)) return true;
  return /attachment/i.test(field);
}

function isLinkUrlField(field) {
  if (linkUrlFields.has(field)) return true;
  return (
    field.includes("url") &&
    !isImageUploadField(field) &&
    !isFileUploadField(field)
  );
}

function fileNameFromUrl(url) {
  try {
    const path = String(url || "").split("?")[0];
    return decodeURIComponent(path.split("/").filter(Boolean).pop() || "File");
  } catch {
    return "File";
  }
}

function isProbablyImageUrl(url) {
  return /\.(png|jpe?g|gif|webp|avif|svg)(\?|$)/i.test(String(url || ""));
}

function MediaField({
  field,
  value,
  change,
  upload,
  disabled,
  error,
  label,
  help,
  accept = "image/*",
  multiple = false,
}) {
  const isGallery = multiple || field === "gallery";
  const items = isGallery ? value || [] : value ? [value] : [];
  const imagesOnly = accept.includes("image/") && !accept.includes("pdf");
  const emptyLabel = isGallery
    ? "Upload images"
    : imagesOnly
      ? "Upload image"
      : "Upload file";
  const filledLabel = isGallery
    ? "Add images"
    : imagesOnly
      ? "Replace image"
      : "Replace file";
  return (
    <div
      className={`${isGallery || !imagesOnly ? "md:col-span-2" : ""} ${error ? "rounded-xl border border-red-500/70 p-3" : ""}`}
    >
      <span className="text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">
        {label || (isGallery ? "Gallery images" : imagesOnly ? "Image" : "File")}
      </span>
      <p className="mt-1 text-sm text-muted-foreground">
        {help ||
          (isGallery
            ? "Upload any additional images. They will be saved with this record."
            : "Upload a file to replace the current one. The previous file stays until you save.")}
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        {items.map((item, index) => {
          const showImage = imagesOnly || isProbablyImageUrl(item);
          return (
            <div
              key={`${item}-${index}`}
              className="group relative h-28 w-40 overflow-hidden rounded-xl border bg-secondary"
            >
              {showImage ? (
                <img
                  src={item}
                  alt="Uploaded media"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-3 text-center">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="line-clamp-2 text-[11px] font-medium text-muted-foreground">
                    {fileNameFromUrl(item)}
                  </span>
                </div>
              )}
              <button
                type="button"
                disabled={disabled}
                onClick={() =>
                  change(
                    field,
                    isGallery
                      ? items.filter((_, itemIndex) => itemIndex !== index)
                      : "",
                  )
                }
                className="absolute right-2 top-2 rounded-lg bg-background/90 p-1.5 text-muted-foreground opacity-0 shadow-sm transition group-hover:opacity-100 hover:text-red-500 disabled:opacity-50"
                aria-label={isGallery ? "Remove file" : "Remove uploaded file"}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
        <label className="flex h-28 w-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-secondary/20 text-center text-xs font-semibold text-muted-foreground transition hover:border-primary/50 hover:text-primary">
          <FileUp className="h-5 w-5" />
          {items.length ? filledLabel : emptyLabel}
          <input
            disabled={disabled}
            type="file"
            accept={accept}
            multiple={isGallery}
            className="hidden"
            onChange={(event) => upload(field, event.target.files)}
          />
        </label>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}

function ResourceField({ field, value, change, upload, disabled, error }) {
  const boolean = ["published", "featured", "is_read", "is_starred"].includes(
    field,
  );
  const long = longFields.has(field) || jsonFields.has(field);
  const required = ["title", "name", "company", "institution"].includes(field);
  const type = field.includes("date")
    ? "date"
    : field === "score" || field === "sort_order"
      ? "number"
      : isLinkUrlField(field)
        ? "url"
        : "text";
  const toggleCopy =
    field === "featured"
      ? value
        ? "Featured item shown first on the public page"
        : "Turn on to show this as the first large public item"
      : value
        ? "Visible to visitors"
        : "Hidden from visitors";
  if (isImageUploadField(field) || field === "gallery") {
    return (
      <MediaField
        field={field}
        value={value}
        change={change}
        upload={upload}
        disabled={disabled}
        error={error}
        label={field === "gallery" ? "Gallery images" : "Banner image"}
        help={
          field === "gallery"
            ? "Upload any additional project images. They will be saved with this project."
            : "The current banner stays unchanged unless you upload a replacement."
        }
        accept="image/*"
        multiple={field === "gallery"}
      />
    );
  }
  if (isFileUploadField(field)) {
    return (
      <MediaField
        field={field}
        value={value}
        change={change}
        upload={upload}
        disabled={disabled}
        error={error}
        label={labelize(field)}
        help="Upload a PDF or image file. External URL pasting is disabled for media fields."
        accept="image/*,application/pdf"
      />
    );
  }
  return (
    <label className={long || field === "content" ? "md:col-span-2" : ""}>
      <span className="text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">
        {labelize(field)}
        {required && <span className="ml-1 text-primary">*</span>}
      </span>
      {field === "content" ? (
        <>
          <RichTextEditor
            value={value}
            onChange={(next) => change(field, next)}
            disabled={disabled}
          />
          <small className="mt-2 block text-muted-foreground">
            Formatting is saved as clean HTML and appears on the public article.
          </small>
        </>
      ) : boolean ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => change(field, !value)}
          className={`mt-2 flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left text-sm ${error ? "border-red-500 bg-red-500/5" : value ? "border-primary/40 bg-primary/10" : "bg-background"}`}
        >
          <span className="text-muted-foreground">{toggleCopy}</span>
          <span
            className={`h-5 w-9 rounded-full p-0.5 ${value ? "bg-primary" : "bg-muted-foreground/30"}`}
          >
            <span
              className={`block h-4 w-4 rounded-full bg-primary-foreground transition ${value ? "translate-x-4" : ""}`}
            />
          </span>
        </button>
      ) : long ? (
        <textarea
          disabled={disabled}
          name={field}
          aria-invalid={Boolean(error)}
          rows={jsonFields.has(field) ? 7 : 5}
          value={value}
          onChange={(event) => change(field, event.target.value)}
          className={`${inputClass} resize-y ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""}`}
        />
      ) : (
        <input
          disabled={disabled}
          name={field}
          aria-invalid={Boolean(error)}
          required={required}
          type={type}
          value={value}
          onChange={(event) => change(field, event.target.value)}
          className={`${inputClass} ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""}`}
        />
      )}
      {jsonFields.has(field) && (
        <small className="mt-2 block text-muted-foreground">
          {field === "metrics" ? (
            <>
              Use a JSON array of objects, for example{" "}
              <code className="text-foreground">
                {'[{"label":"Conversion lift","value":"+24%"}]'}
              </code>
              .
            </>
          ) : (
            <>
              Use a JSON array of text items, for example{" "}
              <code className="text-foreground">{'["Item one"]'}</code>.
            </>
          )}
        </small>
      )}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </label>
  );
}
function sections(fields) {
  const media = new Set([
    "image_url",
    "gallery",
    "project_url",
    "attachment_url",
  ]);
  const primary = new Set([
    "title",
    "name",
    "company",
    "institution",
    "slug",
    "category",
    "client",
    "role",
    "year",
    "degree",
    "location",
    "start_date",
    "end_date",
  ]);
  const details = new Set([
    "icon",
    "score",
    "sort_order",
    "featured",
    "published",
    "published_at",
    "status",
  ]);
  return [
    [
      "Core details",
      "Identity and context for this record.",
      fields.filter((field) => primary.has(field)),
    ],
    [
      "Content",
      "The information visitors will read.",
      fields.filter(
        (field) =>
          (longFields.has(field) || field === "content") &&
          !seoFields.has(field),
      ),
    ],
    [
      "Media & links",
      "Upload images or files here. Project links stay as URLs.",
      fields.filter((field) => media.has(field)),
    ],
    [
      "SEO",
      "Custom title, description, and keywords for Google and social previews. Leave blank to auto-generate from the content.",
      fields.filter((field) => seoFields.has(field)),
    ],
    [
      "Visibility & placement",
      "Publish makes an item visible on the website. Featured places it first as the large lead item.",
      fields.filter(
        (field) =>
          jsonFields.has(field) ||
          details.has(field) ||
          (!primary.has(field) &&
            !media.has(field) &&
            !seoFields.has(field) &&
            !longFields.has(field) &&
            field !== "content"),
      ),
    ],
  ].filter(([, , list]) => list.length);
}
function ResourceEditor({ resource, record, onClose, onSaved, onRemove }) {
  const config = adminResources[resource];
  const [values, setValues] = useState(() =>
    Object.fromEntries(
      config.fields.map((field) => [field, initialValue(record, field)]),
    ),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const existing = Boolean(record?.id);
  function change(field, value) {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (field === "slug") setSlugEdited(true);
    setValues((current) => {
      const next = { ...current, [field]: value };
      if (field === "title" && !slugEdited)
        next.slug = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      return next;
    });
  }
  async function upload(field, files) {
    const allowFiles = isFileUploadField(field);
    const selected = Array.from(files || []).filter((file) => {
      if (!file?.type) return false;
      if (file.type.startsWith("image/")) return true;
      return allowFiles && file.type === "application/pdf";
    });
    if (!selected.length) return;
    setSaving(true);
    setError("");
    setFieldErrors({});
    try {
      const urls = await Promise.all(
        selected.map(async (file) => {
          const form = new FormData();
          form.append("file", file);
          form.append("folder", resource);
          const response = await fetch("/api/upload", {
            method: "POST",
            body: form,
          });
          const body = await response.json().catch(() => ({}));
          if (!response.ok)
            throw new Error(body.error || "Upload failed.");
          return body.data.url;
        }),
      );
      change(
        field,
        field === "gallery" ? [...(values.gallery || []), ...urls] : urls[0],
      );
      setNotice(
        `${urls.length > 1 ? `${urls.length} files` : "File"} uploaded. Save this record to keep the change.`,
      );
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setSaving(false);
    }
  }
  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const result = await api(
        `/api/admin/resources/${resource}${existing ? `/${record.id}` : ""}`,
        { method: existing ? "PATCH" : "POST", body: JSON.stringify(values) },
      );
      onSaved(result, existing);
      setNotice("Changes saved successfully.");
    } catch (saveError) {
      const field = saveError.details?.field;
      const message = saveError.message || "Could not save this record.";
      setError(field ? `${labelize(field)}: ${message}` : message);
      if (field) setFieldErrors({ [field]: message });
    } finally {
      setSaving(false);
    }
  }
  function showNativeFieldError(event) {
    event.preventDefault();
    const field = event.target.name;
    if (!field) return;
    const message =
      event.target.validationMessage || "Please complete this field.";
    setFieldErrors((current) => ({ ...current, [field]: message }));
    setError("Please correct the highlighted field before saving.");
  }
  return (
    <section>
      <header className="mb-8 flex flex-col justify-between gap-5 border-b pb-6 sm:flex-row">
        <div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {config.label.toLowerCase()}
          </button>
          <span className="mt-6 block text-xs font-semibold uppercase tracking-[.16em] text-primary">
            {existing ? "Editing" : "New record"}
          </span>
          <h1 className="font-display mt-1 text-3xl font-semibold tracking-[-.035em]">
            {recordTitle(record)}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Changes are made in this dedicated editor and publish when saved.
          </p>
        </div>
        {existing && (
          <button
            type="button"
            disabled={saving}
            onClick={() => onRemove(record.id)}
            className="inline-flex h-fit items-center gap-2 rounded-xl border border-red-500/25 px-3.5 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        )}
      </header>
      <form
        onSubmit={save}
        onInvalid={showNativeFieldError}
        className="space-y-5"
      >
        {sections(config.fields).map(([title, description, fields]) => (
          <section
            key={title}
            className="overflow-hidden rounded-2xl border bg-card"
          >
            <header className="border-b bg-secondary/20 px-5 py-4">
              <h2 className="font-display text-lg font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            </header>
            <div className="grid gap-5 p-5 md:grid-cols-2">
              {fields.map((field) => (
                <ResourceField
                  key={field}
                  field={field}
                  value={values[field]}
                  change={change}
                  upload={upload}
                  disabled={saving}
                  error={fieldErrors[field]}
                />
              ))}
            </div>
          </section>
        ))}
        <Notice message={error} />
        <Notice message={notice} tone="success" />
        <footer className="sticky bottom-4 z-10 flex justify-end rounded-2xl border bg-background/90 p-3 backdrop-blur">
          <button
            disabled={saving}
            className="bg-gradient-accent inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft active:scale-[.98] disabled:opacity-60"
          >
            {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {existing ? "Save changes" : "Create record"}
          </button>
        </footer>
      </form>
    </section>
  );
}

function ListVisual({ record }) {
  if (record.image_url)
    return (
      <span
        style={{ backgroundImage: `url(${record.image_url})` }}
        className="h-16 w-24 shrink-0 rounded-xl border bg-cover bg-center sm:h-20 sm:w-32"
      />
    );
  const initials = recordTitle(record)
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  return (
    <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl border bg-secondary text-sm font-semibold text-muted-foreground sm:h-20 sm:w-20">
      {initials || <ImageIcon className="h-5 w-5" />}
    </span>
  );
}
function ResourceList({
  config,
  resource,
  records,
  loading,
  error,
  onSelect,
  onNew,
  onSync,
  syncing,
  onChat,
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const email = resource === "emails";
  const inquiry = resource === "contacts";
  const hasPublished = records.some(
    (item) => typeof item.published === "boolean",
  );
  const filtered = records.filter(
    (item) =>
      `${recordTitle(item)} ${recordSummary(item)} ${item.category || ""} ${item.email || ""}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (filter === "all" ||
        (filter === "published" ? item.published : !item.published)),
  );
  return (
    <section>
      <header className="mb-7 flex flex-col justify-between gap-5 border-b pb-6 lg:flex-row lg:items-end">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[.16em] text-primary">
            Content library
          </span>
          <div className="mt-2 flex items-baseline gap-3">
            <h1 className="font-display text-3xl font-semibold tracking-[-.04em]">
              {config.label}
            </h1>
            <span className="rounded-full border bg-secondary/50 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              {records.length}
            </span>
          </div>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            A focused index of every {config.label.toLowerCase().slice(0, -1)}.
            Open one to edit it on its own page.
          </p>
        </div>
        <div className="flex gap-2">
          {email && (
            <button
              type="button"
              onClick={onSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-sm font-semibold hover:border-primary/45"
            >
              {syncing ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Sync Gmail
            </button>
          )}
          {!email && (
            <button
              type="button"
              onClick={onNew}
              className="bg-gradient-accent inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft active:scale-[.98]"
            >
              <Plus className="h-4 w-4" />
              New {config.label.slice(0, -1)}
            </button>
          )}
        </div>
      </header>
      <Notice message={error} />
      {loading ? (
        <Skeleton />
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative max-w-md flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search ${config.label.toLowerCase()}…`}
                className="w-full rounded-xl border bg-card py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </label>
            {hasPublished && (
              <div className="flex rounded-xl border bg-card p-1">
                {[
                  ["all", "All"],
                  ["published", "Published"],
                  ["draft", "Drafts"],
                ].map(([value, label]) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setFilter(value)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${filter === value ? "bg-secondary text-foreground" : "text-muted-foreground"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {filtered.length ? (
            <div className="overflow-hidden rounded-2xl border bg-card">
              <div className="hidden grid-cols-[minmax(0,1fr)_150px_105px] gap-4 border-b bg-secondary/20 px-5 py-3 text-[11px] font-semibold uppercase tracking-[.14em] text-muted-foreground md:grid">
                <span>Record</span>
                <span>Details</span>
                <span>Updated</span>
              </div>
              <div className="divide-y">
                {filtered.map((record) => (
                  <div
                    key={record.id}
                    className="group flex items-center gap-3 px-3 py-3 hover:bg-secondary/25 sm:gap-4 sm:px-5"
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(record)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left sm:gap-4"
                    >
                      <ListVisual record={record} />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-display truncate text-base font-semibold group-hover:text-primary">
                            {recordTitle(record)}
                          </span>
                          {typeof record.published === "boolean" && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${record.published ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}
                            >
                              {record.published ? "Published" : "Draft"}
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block max-w-2xl truncate text-sm text-muted-foreground">
                          {recordSummary(record)}
                        </span>
                        <small className="mt-2 block text-muted-foreground md:hidden">
                          {record.category ||
                            record.location ||
                            record.email ||
                            record.degree ||
                            "Portfolio record"}{" "}
                          · {formatDate(record.updated_at || record.created_at)}
                        </small>
                      </span>
                    </button>
                    <span className="hidden w-[150px] text-sm text-muted-foreground md:block">
                      {record.category ||
                        record.location ||
                        record.email ||
                        record.degree ||
                        " - "}
                    </span>
                    <span className="hidden w-[105px] text-xs text-muted-foreground md:block">
                      {formatDate(record.updated_at || record.created_at)}
                    </span>
                    {inquiry && (
                      <button
                        type="button"
                        title="Open conversation"
                        onClick={() => onChat(record)}
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border text-muted-foreground hover:border-primary/45 hover:text-primary"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      title={email ? "Open thread" : "Edit"}
                      onClick={() => onSelect(record)}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-primary"
                    >
                      {email ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <Pencil className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed bg-secondary/15 px-5 py-14 text-center">
              <FileText className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-3 text-sm font-medium">
                {query
                  ? "No matching records"
                  : `No ${config.label.toLowerCase()} yet`}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {query
                  ? "Try a different search term."
                  : "Create the first record to populate this section."}
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function Conversation({ inquiry, messages, onClose }) {
  const items = messages
    .filter((message) =>
      [message.from_email, message.to_email].some(
        (email) => email?.toLowerCase() === inquiry.email?.toLowerCase(),
      ),
    )
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  return (
    <section>
      <header className="mb-7 border-b pb-6">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to inquiries
        </button>
        <span className="mt-6 block text-xs font-semibold uppercase tracking-[.16em] text-primary">
          Conversation
        </span>
        <h1 className="font-display mt-1 text-3xl font-semibold tracking-[-.035em]">
          {inquiry.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {inquiry.email}
          {inquiry.topic ? ` · ${inquiry.topic}` : ""}
        </p>
      </header>
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex justify-between gap-4 text-sm">
            <b>{inquiry.name}</b>
            <small className="text-muted-foreground">
              {formatDate(inquiry.created_at)}
            </small>
          </div>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
            {inquiry.message}
          </p>
        </div>
        {items.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.direction === "outbound" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-4 ${message.direction === "outbound" ? "bg-primary text-primary-foreground" : "border bg-card"}`}
            >
              <small
                className={
                  message.direction === "outbound"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }
              >
                {message.direction === "outbound"
                  ? "You replied"
                  : message.from_name || message.from_email}{" "}
                · {formatDate(message.created_at)}
              </small>
              <p
                className={`mt-3 whitespace-pre-wrap text-sm leading-7 ${message.direction === "outbound" ? "text-primary-foreground" : "text-muted-foreground"}`}
              >
                {message.body_text || message.snippet}
              </p>
            </div>
          </div>
        ))}
        {!items.length && (
          <div className="rounded-2xl border border-dashed bg-secondary/15 px-5 py-10 text-center text-sm text-muted-foreground">
            No synced email replies match this inquiry yet. Replies will appear
            here after Gmail sync.
          </div>
        )}
      </div>
    </section>
  );
}
function EmailThread({ record, messages, onDone }) {
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const thread = messages
    .filter((message) => message.gmail_thread_id === record.gmail_thread_id)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  async function action(name, data) {
    setBusy(true);
    try {
      await api(`/api/admin/email-actions/${name}`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      onDone();
    } catch (issue) {
      setError(issue.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section>
      <header className="mb-7 border-b pb-6">
        <button
          type="button"
          onClick={() => onDone(null)}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to inbox
        </button>
        <span className="mt-6 block text-xs font-semibold uppercase tracking-[.16em] text-primary">
          Email thread
        </span>
        <h1 className="font-display mt-1 text-3xl font-semibold tracking-[-.035em]">
          {record.subject}
        </h1>
      </header>
      <div className="mx-auto max-w-4xl space-y-5">
        {thread.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.direction === "outbound" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-4 ${message.direction === "outbound" ? "bg-primary text-primary-foreground" : "border bg-card"}`}
            >
              <small
                className={
                  message.direction === "outbound"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }
              >
                {message.direction === "outbound"
                  ? "You"
                  : message.from_name || message.from_email}{" "}
                · {formatDate(message.created_at)}
              </small>
              <p
                className={`mt-3 whitespace-pre-wrap text-sm leading-7 ${message.direction === "outbound" ? "text-primary-foreground" : "text-muted-foreground"}`}
              >
                {message.body_text || message.snippet}
              </p>
            </div>
          </div>
        ))}
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              action("star", {
                messageId: record.gmail_message_id,
                enabled: !record.is_starred,
              })
            }
            className="inline-flex items-center gap-2 rounded-xl border bg-card px-3.5 py-2.5 text-sm font-semibold"
          >
            <Star
              className="h-4 w-4"
              fill={record.is_starred ? "currentColor" : "none"}
            />
            {record.is_starred ? "Unstar" : "Star"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              action("archive", { threadId: record.gmail_thread_id })
            }
            className="inline-flex items-center gap-2 rounded-xl border bg-card px-3.5 py-2.5 text-sm font-semibold"
          >
            <Archive className="h-4 w-4" />
            Archive
          </button>
        </div>
        <form
          className="rounded-2xl border bg-card p-5"
          onSubmit={(event) => {
            event.preventDefault();
            action("reply", {
              threadId: record.gmail_thread_id,
              to: record.from_email,
              subject: `Re: ${record.subject}`,
              html: reply.replaceAll("\n", "<br/>"),
            });
          }}
        >
          <label>
            <span className="text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">
              Reply
            </span>
            <textarea
              required
              rows="7"
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              placeholder="Write a reply…"
              className={`${inputClass} resize-y`}
            />
          </label>
          <button
            disabled={busy}
            className="bg-gradient-accent mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft"
          >
            <Send className="h-4 w-4" />
            Send reply
          </button>
          <Notice message={error} />
        </form>
      </div>
    </section>
  );
}

function HomepagePreview({ colors }) {
  const frame = useRef(null);
  const [theme, setTheme] = useState("dark");
  const send = useCallback(
    () =>
      frame.current?.contentWindow?.postMessage(
        { type: "portfolio-home-preview", colors, theme },
        window.location.origin,
      ),
    [colors, theme],
  );
  useEffect(() => {
    send();
    function receiveReady(event) {
      if (
        event.origin === window.location.origin &&
        event.data?.type === "portfolio-home-preview-ready"
      )
        send();
    }
    window.addEventListener("message", receiveReady);
    return () => window.removeEventListener("message", receiveReady);
  }, [send]);
  return (
    <section className="overflow-hidden rounded-2xl border bg-card">
      <header className="flex flex-col gap-3 border-b bg-secondary/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">
            Live homepage preview
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The actual homepage, using unsaved colors in real time.
          </p>
        </div>
        <div className="flex rounded-xl border bg-card p-1">
          {["dark", "light"].map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => setTheme(option)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize ${theme === option ? "bg-secondary text-foreground" : "text-muted-foreground"}`}
            >
              {option}
            </button>
          ))}
        </div>
      </header>
      <div className="relative h-[360px] overflow-hidden bg-secondary/20 sm:h-[500px]">
        <iframe
          ref={frame}
          title="Live homepage color preview"
          src="/?adminPreview=1"
          onLoad={send}
          className="pointer-events-none absolute left-0 top-0 h-[1000px] w-[200%] origin-top-left scale-50 border-0"
        />
      </div>
    </section>
  );
}
function ConfigEditor({
  endpoint,
  title,
  description,
  initial,
  fields,
  isColors = false,
  groups,
  profile = false,
}) {
  const [values, setValues] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const hydrate = useCallback(
    (source) => {
      const homeValues = profile ? flattenHomeFields(source.home) : {};
      setValues(
        Object.fromEntries(
          fields.map(([key, , type]) => {
            if (type === "social") {
              if (key === "x")
                return [key, source.socials?.x || source.socials?.twitter || ""];
              return [key, source.socials?.[key] || ""];
            }
            if (homeAdminFieldKeys.includes(key))
              return [key, homeValues[key] || ""];
            return [key, source[key] || ""];
          }),
        ),
      );
    },
    [fields, profile],
  );
  useEffect(() => {
    api(endpoint)
      .then((data) => hydrate(isColors ? data.colors : data || {}))
      .catch((issue) => setMessage(issue.message))
      .finally(() => setLoading(false));
  }, [endpoint, hydrate, isColors]);
  async function upload(field, files) {
    const selected = Array.from(files || []).filter((file) =>
      file?.type?.startsWith("image/"),
    );
    if (!selected.length) return;
    setSaving(true);
    setMessage("");
    try {
      const [file] = selected;
      const form = new FormData();
      form.append("file", file);
      form.append("folder", profile ? "profile" : "media");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Upload failed.");
      setValues((current) => ({ ...current, [field]: body.data.url }));
      setMessage("Image uploaded. Save changes to publish it.");
    } catch (issue) {
      setMessage(issue.message);
    } finally {
      setSaving(false);
    }
  }
  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      if (
        isColors &&
        fields.some(
          ([key, , type]) =>
            type === "color" && !hexColor.test(values[key] || ""),
        )
      )
        throw new Error(
          "Each color must be a six-digit hex value, such as #FFDB70.",
        );
      const payload = Object.fromEntries(
        fields
          .filter(
            ([key, , type]) =>
              type !== "social" && !homeAdminFieldKeys.includes(key),
          )
          .map(([key]) => [key, values[key]]),
      );
      if (profile) {
        payload.socials = Object.fromEntries(
          socialKeys
            .map((key) => [key, values[key]?.trim()])
            .filter(([, value]) => value),
        );
        if (payload.socials.x) payload.socials.twitter = payload.socials.x;
        payload.home = assembleHomeFromFields(values);
      }
      const data = await api(endpoint, {
        method: "PUT",
        body: JSON.stringify(isColors ? { colors: payload } : payload),
      });
      hydrate(isColors ? data.colors : data);
      setMessage("Saved successfully. Your changes are now live.");
    } catch (issue) {
      setMessage(issue.message);
    } finally {
      setSaving(false);
    }
  }
  function field([key, label, type]) {
    const valid = hexColor.test(values[key] || "");
    const wide = type === "textarea" || homeTextareaKeys.has(key);
    if (type === "image" || type === "file") {
      return (
        <MediaField
          key={key}
          field={key}
          value={values[key] || ""}
          change={(name, next) => setValues((current) => ({ ...current, [name]: next }))}
          upload={upload}
          disabled={loading || saving}
          label={label}
          help={
            type === "image"
              ? "Upload an image. It replaces the current one after you save."
              : "Upload a PDF or image file."
          }
          accept={type === "image" ? "image/*" : "image/*,application/pdf"}
        />
      );
    }
    return (
      <label key={key} className={wide ? "md:col-span-2" : ""}>
        <span className="text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">
          {label}
        </span>
        {type === "textarea" ? (
          <textarea
            rows={homeTextareaKeys.has(key) ? 6 : 5}
            value={values[key] || ""}
            onChange={(event) =>
              setValues({ ...values, [key]: event.target.value })
            }
            className={`${inputClass} resize-y`}
          />
        ) : type === "color" ? (
          <span className="mt-2 flex gap-2">
            <input
              type="color"
              value={valid ? values[key] : "#000000"}
              onChange={(event) =>
                setValues({ ...values, [key]: event.target.value })
              }
              className="h-12 w-14 rounded-lg border bg-background p-1"
            />
            <input
              value={values[key] || ""}
              onChange={(event) =>
                setValues({ ...values, [key]: event.target.value })
              }
              className={`${inputClass} mt-0 ${valid ? "" : "border-red-500"}`}
            />
          </span>
        ) : (
          <input
            type={["url", "social"].includes(type) ? "url" : type}
            value={values[key] || ""}
            onChange={(event) =>
              setValues({ ...values, [key]: event.target.value })
            }
            className={inputClass}
          />
        )}
        {type === "social" && (
          <small className="mt-2 block text-muted-foreground">
            Use the full profile URL.
          </small>
        )}
      </label>
    );
  }
  return (
    <section>
      <header className="mb-8 border-b pb-6">
        <span className="text-xs font-semibold uppercase tracking-[.16em] text-primary">
          Settings
        </span>
        <h1 className="font-display mt-1 text-3xl font-semibold tracking-[-.035em]">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {description}
        </p>
      </header>
      <form onSubmit={save} className="space-y-5">
        {loading ? (
          <Skeleton />
        ) : (
          <>
            {isColors && <HomepagePreview colors={values} />}
            {groups.map((group) => (
              <section
                key={group.title}
                className="overflow-hidden rounded-2xl border bg-card"
              >
                <header className="border-b bg-secondary/20 px-5 py-4">
                  <h2 className="font-display text-lg font-semibold">
                    {group.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {group.description}
                  </p>
                </header>
                <div className="grid gap-5 p-5 md:grid-cols-2">
                  {group.fields.map((key) =>
                    field(fields.find(([name]) => name === key)),
                  )}
                </div>
              </section>
            ))}
          </>
        )}
        <Notice
          message={message}
          tone={message.startsWith("Saved") ? "success" : "error"}
        />
        <footer className="sticky bottom-4 z-10 flex justify-end rounded-2xl border bg-background/90 p-3 backdrop-blur">
          <button
            disabled={loading || saving}
            className="bg-gradient-accent inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
          >
            {saving ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Save changes
          </button>
        </footer>
      </form>
    </section>
  );
}

export function ResourceManager({ resource }) {
  const config = adminResources[resource];
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(undefined);
  const [email, setEmail] = useState(null);
  const [inquiry, setInquiry] = useState(null);
  const [messages, setMessages] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRecords(await api(`/api/admin/resources/${resource}`));
    } catch (issue) {
      setError(issue.message);
    } finally {
      setLoading(false);
    }
  }, [resource]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);
  async function openInquiry(record) {
    try {
      setMessages(await api("/api/admin/resources/emails"));
      setInquiry(record);
    } catch (issue) {
      setError(issue.message);
    }
  }
  async function remove(id) {
    if (!window.confirm("Delete this record? This cannot be undone.")) return;
    try {
      await api(`/api/admin/resources/${resource}/${id}`, { method: "DELETE" });
      setRecords((items) => items.filter((item) => item.id !== id));
      setSelected(undefined);
    } catch (issue) {
      setError(issue.message);
    }
  }
  async function sync() {
    setSyncing(true);
    try {
      await api("/api/admin/email-actions/sync", {
        method: "POST",
        body: "{}",
      });
      await load();
    } catch (issue) {
      setError(issue.message);
    } finally {
      setSyncing(false);
    }
  }
  function saved(record, changed) {
    setRecords((items) =>
      changed
        ? items.map((item) => (item.id === record.id ? record : item))
        : [record, ...items],
    );
    setSelected(record);
  }
  if (!config) return null;
  if (inquiry)
    return (
      <Conversation
        inquiry={inquiry}
        messages={messages}
        onClose={() => setInquiry(null)}
      />
    );
  if (resource === "emails" && email)
    return (
      <EmailThread
        record={email}
        messages={records}
        onDone={(next) => {
          setEmail(next);
          void load();
        }}
      />
    );
  if (resource !== "emails" && selected !== undefined)
    return (
      <ResourceEditor
        resource={resource}
        record={selected}
        onClose={() => setSelected(undefined)}
        onSaved={saved}
        onRemove={remove}
      />
    );
  return (
    <ResourceList
      config={config}
      resource={resource}
      records={records}
      loading={loading}
      error={error}
      onSelect={(record) =>
        resource === "emails" ? setEmail(record) : setSelected(record)
      }
      onNew={() => setSelected(null)}
      onSync={sync}
      syncing={syncing}
      onChat={openInquiry}
    />
  );
}
export function ProfileManager() {
  return (
    <ConfigEditor
      endpoint="/api/admin/profile"
      title="Profile details"
      description="Manage sidebar identity and homepage content from one form. Changes go live immediately."
      initial={{}}
      fields={profileFields}
      groups={profileGroups}
      profile
    />
  );
}
export function AppearanceManager() {
  return (
    <ConfigEditor
      endpoint="/api/admin/settings"
      title="Brand colors"
      description="Edit each theme independently, then evaluate the actual homepage before publishing a change."
      initial={defaultColors}
      fields={appearanceFields}
      groups={appearanceGroups}
      isColors
    />
  );
}
