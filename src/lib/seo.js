import { fallbackProfile } from "@/lib/content";
import SEOConfig, { SITE } from "@/lib/seo-config";

const DEFAULT_SITE_URL = "http://localhost:3000";

export function getSiteUrl() {
  const raw =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    DEFAULT_SITE_URL;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  if (!path) return getSiteUrl();
  if (/^https?:\/\//i.test(path)) return path;
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function truncate(text, max = 160) {
  const value = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}…`;
}

function pickImage(...candidates) {
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim())
      return absoluteUrl(candidate.trim());
  }
  return absoluteUrl("/images/portrait.webp");
}

export function parseKeywords(keywords) {
  if (Array.isArray(keywords)) return keywords.map(String).map((k) => k.trim()).filter(Boolean);
  return String(keywords || "")
    .split(/[,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function defaultSiteDescription(profile = fallbackProfile) {
  return truncate(
    profile.seo_description ||
      profile.summary ||
      profile.intro ||
      SEOConfig.home.pageDescription ||
      SEOConfig.default.pageDescription,
  );
}

export function defaultSiteTitle(profile = fallbackProfile) {
  return (
    profile.seo_title ||
    SEOConfig.home.pageTitle ||
    SEOConfig.default.pageTitle ||
    `${profile.name || fallbackProfile.name} - ${profile.title || fallbackProfile.title}`
  );
}

export function defaultKeywords(profile = fallbackProfile) {
  const fromProfile = parseKeywords(profile.keywords);
  if (fromProfile.length) return fromProfile;
  return parseKeywords(SEOConfig.home.keywords || SEOConfig.default.keywords);
}

function applyTemplate(template, value) {
  if (!template) return value || "";
  if (!value) return String(template).replaceAll("%s", "").replace(/\s+/g, " ").trim();
  return String(template).replaceAll("%s", value);
}

/** Read a page entry from seo-config.js */
export function getSeoPage(pageKey = "default") {
  return SEOConfig[pageKey] || SEOConfig.default;
}

/**
 * Build Next.js metadata from the central seo-config entry.
 * Optional overrides win (useful for CMS detail pages).
 */
export function metadataFromConfig(
  pageKey,
  {
    profile,
    title,
    description,
    keywords,
    path,
    image,
    type,
    noIndex = false,
    publishedTime,
    modifiedTime,
    name,
  } = {},
) {
  const page = getSeoPage(pageKey);
  const resolvedTitle = title
    ? title.includes("|") || !page.pageTitle?.includes("%s")
      ? title
      : applyTemplate(page.pageTitle, title)
    : page.pageTitle?.includes("%s") && name
      ? applyTemplate(page.pageTitle, name)
      : page.pageTitle || defaultSiteTitle(profile);
  const resolvedDescription = description
    ? description
    : page.pageDescription?.includes("%s") && (name || title)
      ? applyTemplate(page.pageDescription, name || title)
      : page.pageDescription || defaultSiteDescription(profile);

  return buildPageMetadata({
    title: resolvedTitle,
    description: resolvedDescription,
    path: path || page.path || "/",
    image: image || page.ogImage || SITE.defaultOgImage,
    profile,
    keywords: keywords || page.keywords,
    type: type || page.ogType || "website",
    ogTitle: page.ogTitle
      ? page.ogTitle.includes("%s")
        ? applyTemplate(page.ogTitle, name || title || "")
        : page.ogTitle
      : undefined,
    noIndex,
    publishedTime,
    modifiedTime,
  });
}

/** Build Next.js Metadata for a public page. */
export function buildPageMetadata({
  title,
  description,
  path = "/",
  image,
  profile,
  keywords,
  type = "website",
  ogTitle,
  noIndex = false,
  publishedTime,
  modifiedTime,
}) {
  const siteName = SITE.siteName || `${profile?.name || fallbackProfile.name} Portfolio`;
  const pageTitle = title || defaultSiteTitle(profile);
  const socialTitle = ogTitle || pageTitle;
  const pageDescription = truncate(
    description || defaultSiteDescription(profile),
  );
  const url = absoluteUrl(path);
  const ogImage = pickImage(
    image,
    profile?.og_image_url,
    profile?.avatar_url,
    SITE.defaultOgImage,
    "/images/portrait.webp",
  );
  const keywordList = parseKeywords(keywords).filter(
    (value, index, list) => list.indexOf(value) === index,
  );

  // Titles in seo-config already include the brand - avoid layout template doubling.
  const resolvedTitle = { absolute: pageTitle };

  return {
    title: resolvedTitle,
    description: pageDescription,
    keywords: keywordList.length ? keywordList : undefined,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type,
      locale: SITE.locale || "en_IN",
      url,
      siteName,
      title: socialTitle,
      description: pageDescription,
      images: [{ url: ogImage, width: 1200, height: 630, alt: socialTitle }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: pageDescription,
      images: [ogImage],
      ...(SITE.twitterHandle ? { site: SITE.twitterHandle, creator: SITE.twitterHandle } : {}),
    },
  };
}

export function personJsonLd(profile) {
  const sameAs = Object.values(profile.socials || {}).filter(
    (href) => typeof href === "string" && href.startsWith("http"),
  );
  const knowsAbout = defaultKeywords(profile);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${getSiteUrl()}/#person`,
    name: profile.name,
    jobTitle: profile.title,
    description: defaultSiteDescription(profile),
    url: getSiteUrl(),
    email: profile.email || undefined,
    telephone: profile.phone || undefined,
    image: absoluteUrl(profile.avatar_url || "/images/logo.png"),
    knowsAbout: knowsAbout.length ? knowsAbout : undefined,
    address: profile.location
      ? {
          "@type": "PostalAddress",
          addressLocality: profile.location,
          addressCountry: "IN",
        }
      : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

export function websiteJsonLd(profile) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${getSiteUrl()}/#website`,
    name: `${profile.name} Portfolio`,
    url: getSiteUrl(),
    description: defaultSiteDescription(profile),
    inLanguage: "en-IN",
    publisher: { "@id": `${getSiteUrl()}/#person` },
  };
}

export function professionalServiceJsonLd(profile) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${getSiteUrl()}/#business`,
    name: `${profile.name} - ${profile.title}`,
    description: defaultSiteDescription(profile),
    url: getSiteUrl(),
    image: pickImage(profile.og_image_url, profile.avatar_url),
    email: profile.email || undefined,
    telephone: profile.phone || undefined,
    areaServed: "Worldwide",
    priceRange: "$$",
    address: profile.location
      ? {
          "@type": "PostalAddress",
          addressLocality: profile.location,
          addressCountry: "IN",
        }
      : undefined,
    founder: { "@id": `${getSiteUrl()}/#person` },
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function webPageJsonLd({
  name,
  description,
  path,
  type = "WebPage",
  profile,
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description: truncate(description || defaultSiteDescription(profile)),
    url: absoluteUrl(path),
    isPartOf: { "@id": `${getSiteUrl()}/#website` },
    about: { "@id": `${getSiteUrl()}/#person` },
    inLanguage: "en-IN",
  };
}

export function collectionPageJsonLd({ name, description, path, profile, items = [] }) {
  return {
    ...webPageJsonLd({ name, description, path, type: "CollectionPage", profile }),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.slice(0, 20).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title || item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}

export function faqJsonLd(faqs = []) {
  const entities = faqs
    .map((row) => {
      const question = Array.isArray(row) ? row[0] : row?.question;
      const answer = Array.isArray(row) ? row[1] : row?.answer;
      if (!question || !answer) return null;
      return {
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      };
    })
    .filter(Boolean);
  if (!entities.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entities,
  };
}

export function articleJsonLd(post, profile) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seo_title || post.title,
    description: truncate(post.seo_description || post.excerpt || post.title),
    image: pickImage(post.image_url, profile?.og_image_url),
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    author: {
      "@type": "Person",
      "@id": `${getSiteUrl()}/#person`,
      name: profile?.name || fallbackProfile.name,
      url: getSiteUrl(),
    },
    mainEntityOfPage: absoluteUrl(`/blogs/${post.slug}`),
    keywords: post.keywords || undefined,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "article p"],
    },
  };
}

export function projectJsonLd(project, profile) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.seo_title || project.title,
    description: truncate(
      project.seo_description ||
        project.excerpt ||
        project.description ||
        project.title,
    ),
    image: pickImage(project.image_url, profile?.og_image_url),
    url: absoluteUrl(`/portfolio/${project.slug}`),
    creator: {
      "@type": "Person",
      "@id": `${getSiteUrl()}/#person`,
      name: profile?.name || fallbackProfile.name,
    },
    keywords: Array.isArray(project.tags)
      ? project.tags.join(", ")
      : project.keywords || undefined,
  };
}

export function serviceJsonLd(service, profile) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.seo_title || service.title,
    description: truncate(
      service.seo_description || service.description || service.title,
    ),
    url: absoluteUrl(`/services/${service.slug}`),
    provider: {
      "@type": "Person",
      "@id": `${getSiteUrl()}/#person`,
      name: profile?.name || fallbackProfile.name,
      url: getSiteUrl(),
    },
    areaServed: "Worldwide",
    serviceType: service.title,
  };
}
