import "server-only";

import { ApiError } from "./errors";

const buckets = new Map();

export function limit(key, max, windowMs) {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || entry.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  entry.count += 1;
  if (entry.count > max) throw new ApiError(429, "Too many requests. Please try again shortly.");
}
