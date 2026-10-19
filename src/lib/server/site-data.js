import "server-only";

import { unstable_cache } from "next/cache";
import { fallbackData, fallbackProfile, fallbackSettings } from "@/lib/content";
import { getProfile, getSettings, list } from "./repository";

async function withFallback(work, fallback) {
  try {
    const result = await work();
    return Array.isArray(result) && result.length === 0
      ? fallback
      : result || fallback;
  } catch {
    return fallback;
  }
}

const getCachedSiteContext = unstable_cache(
  async () => {
    const [profile, settings] = await Promise.all([
      withFallback(getProfile, fallbackProfile),
      withFallback(getSettings, fallbackSettings),
    ]);
    return { profile, settings };
  },
  ["site-context"],
  { revalidate: 60 },
);

const getCachedCollection = unstable_cache(
  async (resource) =>
    withFallback(
      () => list(resource, { publicOnly: true }),
      fallbackData[resource] || [],
    ),
  ["public-collection"],
  { revalidate: 60 },
);

export async function getSiteContext() {
  return getCachedSiteContext();
}

export async function getCollection(resource) {
  return getCachedCollection(resource);
}

export async function getBySlug(resource, slug) {
  const rows = await getCollection(resource);
  return rows.find((item) => item.slug === slug) || null;
}
