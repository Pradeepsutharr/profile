import "server-only";

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ApiError } from "./errors";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]);
const MAX_BYTES = 8 * 1024 * 1024;

function extension(name) {
  const result = path.extname(name || "").toLowerCase().replace(/[^.a-z0-9]/g, "");
  return result || ".bin";
}

function keyFor(file, folder) {
  return `${folder}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}${extension(file.name)}`;
}

function s3Configured() {
  return Boolean(process.env.S3_BUCKET && process.env.S3_REGION && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY);
}

function client() {
  return new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: Boolean(process.env.S3_ENDPOINT),
    credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY },
  });
}

export async function uploadFile(file, folder = "uploads") {
  if (!file || typeof file.arrayBuffer !== "function") throw new ApiError(400, "A file is required");
  if (file.size > MAX_BYTES) throw new ApiError(400, "Files must be 8 MB or smaller");
  if (!ALLOWED_TYPES.has(file.type)) throw new ApiError(400, "Only JPG, PNG, WebP, GIF, and PDF files are allowed");
  const objectKey = keyFor(file, folder);
  const body = Buffer.from(await file.arrayBuffer());

  if (s3Configured()) {
    await client().send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: objectKey, Body: body, ContentType: file.type }));
    const base = process.env.S3_PUBLIC_URL?.replace(/\/$/, "");
    if (!base) throw new ApiError(503, "S3_PUBLIC_URL is required when S3 uploads are enabled");
    return { key: objectKey, url: `${base}/${objectKey}`, name: file.name };
  }

  if (process.env.NODE_ENV === "production") throw new ApiError(503, "Configure S3-compatible storage before accepting uploads in production");
  const localRoot = path.join(process.cwd(), "public", "uploads");
  const destination = path.join(localRoot, objectKey.replace(/^uploads\//, ""));
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, body);
  return { key: objectKey, url: `/uploads/${objectKey.replace(/^uploads\//, "")}`, name: file.name };
}
