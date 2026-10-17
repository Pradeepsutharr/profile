import "server-only";

import { fallbackData, fallbackProfile, fallbackSettings } from "@/lib/content";
import { getProfile, getSettings, list } from "./repository";

async function withFallback(work, fallback) {
  try {
    const result = await work();
    return Array.isArray(result) && result.length === 0 ? fallback : result || fallback;
  } catch (error) {
    return fallback;
  }
}

export async function getSiteContext() {
  const [profile, settings] = await Promise.all([
    withFallback(getProfile, fallbackProfile),
    withFallback(getSettings, fallbackSettings),
  ]);
  return { profile, settings };
}

export async function getCollection(resource) {
  return withFallback(() => list(resource, { publicOnly: true }), fallbackData[resource] || []);
}

export async function getBySlug(resource, slug) {
  const rows = await getCollection(resource);
  return rows.find((item) => item.slug === slug) || null;
}
