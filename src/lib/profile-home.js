/** Homepage copy managed from admin Profile (text sections only). */
export const defaultHomeContent = {
  eyebrow: "The designer & developer",
  headlineWords: ["Crafting", "SaaS", "&", "Web", "Interfaces", "as", "a"],
  highlight: "Product Designer",
  suffix: "& Frontend Developer",
  socialProof: "Trusted by founders & product teams",
  stats: [
    ["3+", "Years experience"],
    ["20+", "Projects shipped"],
    ["12-24h", "Typical reply time"],
  ],
  pillars: [
    [
      "01",
      "Product thinking & UX research",
      "I help startups and businesses design and build high-impact digital products - combining user research, interface design, product thinking and modern front-end development.",
    ],
    [
      "02",
      "Design-to-code engineering",
      "From validating ideas through research to pixel-perfect UI and production-ready React / Next.js - I deliver complete product solutions, not just screens.",
    ],
  ],
  servicesDescription:
    "Research-driven UI/UX design and front-end development that bridges creative visual logic and technical performance.",
  testimonials: [
    [
      "Pradeep didn't just design screens - he rethought our whole onboarding. Activation jumped within weeks.",
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
    "I help brands create modern, responsive and user-centred digital products - bridging design and engineering to bring your vision to life with",
  philosophyHighlight: "precision and creativity",
  faqs: [
    [
      "What kind of projects do you take on?",
      "SaaS and digital product work - UX research, interface design, design systems, and React/Next.js frontend builds. Best fit when you need design and implementation to move together.",
    ],
    [
      "Do you handle both design and development?",
      "Yes. I bridge Figma-to-production so handoff friction drops and the shipped UI matches the intent.",
    ],
    [
      "How quickly can we start?",
      "Share a brief on the contact page - you’ll usually get a clear next-step plan within 12-24 hours.",
    ],
    [
      "How do engagements usually work?",
      "Discovery call → scoped plan → design/build sprints with regular reviews. Remote-friendly for teams worldwide.",
    ],
    [
      "What’s a typical budget range?",
      "Project scope varies. Share goals and timeline on the contact form (budget optional) and I’ll recommend a realistic path.",
    ],
    [
      "Where are you based?",
      "Ahmedabad, India - working remotely with founders and product teams worldwide.",
    ],
  ],
};

export const defaultProfileIntro =
  "I specialise in UX research, UI/UX design, scalable design systems and high-performance web apps built with React and Next.js.";

export const defaultProfileSummary = `${defaultHomeContent.philosophy} ${defaultHomeContent.philosophyHighlight}.`;

function asArray(value, fallback) {
  return Array.isArray(value) && value.length ? value : fallback;
}

function asString(value, fallback) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || fallback;
}

function parsePipeLines(text, columns) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((part) => part.trim());
      while (parts.length < columns) parts.push("");
      return parts.slice(0, columns);
    })
    .filter((parts) => parts.some(Boolean));
}

function formatPipeLines(rows) {
  return (rows || [])
    .map((row) => (Array.isArray(row) ? row.join("|") : String(row)))
    .join("\n");
}

/** Merge stored home JSON with defaults so the UI never loses structure. */
export function resolveHomeContent(home) {
  const source = home && typeof home === "object" ? home : {};
  return {
    eyebrow: asString(source.eyebrow, defaultHomeContent.eyebrow),
    headlineWords: asArray(source.headlineWords, defaultHomeContent.headlineWords),
    highlight: asString(source.highlight, defaultHomeContent.highlight),
    suffix: asString(source.suffix, defaultHomeContent.suffix),
    socialProof: asString(source.socialProof, defaultHomeContent.socialProof),
    stats: asArray(source.stats, defaultHomeContent.stats),
    pillars: asArray(source.pillars, defaultHomeContent.pillars),
    servicesDescription: asString(
      source.servicesDescription,
      defaultHomeContent.servicesDescription,
    ),
    testimonials: asArray(source.testimonials, defaultHomeContent.testimonials),
    philosophy: asString(source.philosophy, defaultHomeContent.philosophy),
    philosophyHighlight: asString(
      source.philosophyHighlight,
      defaultHomeContent.philosophyHighlight,
    ),
    faqs: asArray(source.faqs, defaultHomeContent.faqs),
  };
}

/** Flatten profile.home into admin form fields. */
export function flattenHomeFields(home) {
  const resolved = resolveHomeContent(home);
  return {
    home_eyebrow: resolved.eyebrow,
    home_headline: resolved.headlineWords.join(" "),
    home_highlight: resolved.highlight,
    home_suffix: resolved.suffix,
    home_social_proof: resolved.socialProof,
    home_stats: formatPipeLines(resolved.stats),
    home_pillars: formatPipeLines(resolved.pillars),
    home_services_description: resolved.servicesDescription,
    home_testimonials: formatPipeLines(resolved.testimonials),
    home_philosophy: resolved.philosophy,
    home_philosophy_highlight: resolved.philosophyHighlight,
    home_faqs: formatPipeLines(resolved.faqs),
  };
}

/** Build profile.home from admin form values. */
export function assembleHomeFromFields(values = {}) {
  const headlineWords = String(values.home_headline || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const stats = parsePipeLines(values.home_stats, 2);
  const pillars = parsePipeLines(values.home_pillars, 3);
  const testimonials = parsePipeLines(values.home_testimonials, 3);
  const faqs = parsePipeLines(values.home_faqs, 2);

  return resolveHomeContent({
    eyebrow: values.home_eyebrow,
    headlineWords: headlineWords.length
      ? headlineWords
      : defaultHomeContent.headlineWords,
    highlight: values.home_highlight,
    suffix: values.home_suffix,
    socialProof: values.home_social_proof,
    stats: stats.length ? stats : defaultHomeContent.stats,
    pillars: pillars.length ? pillars : defaultHomeContent.pillars,
    servicesDescription: values.home_services_description,
    testimonials: testimonials.length
      ? testimonials
      : defaultHomeContent.testimonials,
    philosophy: values.home_philosophy,
    philosophyHighlight: values.home_philosophy_highlight,
    faqs: faqs.length ? faqs : defaultHomeContent.faqs,
  });
}

export const homeAdminFieldKeys = [
  "home_eyebrow",
  "home_headline",
  "home_highlight",
  "home_suffix",
  "home_social_proof",
  "home_stats",
  "home_pillars",
  "home_services_description",
  "home_testimonials",
  "home_philosophy",
  "home_philosophy_highlight",
  "home_faqs",
];
