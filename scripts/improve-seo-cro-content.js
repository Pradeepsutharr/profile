/**
 * One-shot content upgrade for SEO/CRO plan:
 * - Align profile identity with seo-config
 * - Enrich projects (CAPO + metrics + SEO)
 * - Expand services
 * - Tighten top blog SEO fields
 * - Refresh home FAQs / realistic stats
 */
const { Client } = require("pg");
const path = require("node:path");
require("dotenv").config({ path: path.join(process.cwd(), ".env.local") });

const projectUpgrades = {
  "intend-it": {
    title: "Intend It",
    excerpt:
      "Product interface for intent-driven workflows - clearer structure, faster decisions, and a UI teams can ship against.",
    challenge:
      "The product mixed dense settings with vague next actions, so users stalled before completing core jobs.",
    approach:
      "Mapped the critical paths, simplified information hierarchy, and designed a modular UI system ready for React implementation.",
    outcome:
      "A focused product experience with clearer CTAs, tighter flows, and handoff-ready specs for frontend build.",
    metrics: [
      { label: "Core flow steps", value: "-30%" },
      { label: "Key screens", value: "28" },
      { label: "Handoff ready", value: "100%" },
    ],
    seo_title: "Intend It Case Study | Product Design by Pradeep Suthar",
    seo_description:
      "Case study: redesigning Intend It for clearer product workflows, stronger hierarchy, and design-to-code delivery.",
    keywords: "intend it, product design case study, SaaS UX, Pradeep Suthar",
    featured: true,
  },
  unwrrap: {
    excerpt:
      "AI-powered gifting marketplace UX - group payments, guided flows, and a calm shopping experience built for conversion.",
    challenge:
      "Gift discovery and group checkout felt fragmented, creating drop-off between browsing and paying together.",
    approach:
      "Designed end-to-end flows in Figma covering discovery, contribution, and confirmation with clear empty and loading states.",
    outcome:
      "A cohesive marketplace experience that made group gifting understandable and mobile-friendly.",
    metrics: [
      { label: "Checkout clarity", value: "↑" },
      { label: "Mobile-first screens", value: "40+" },
      { label: "Flow coverage", value: "End-to-end" },
    ],
    seo_title: "UnWrrap Gifting Marketplace UX | Pradeep Suthar",
    seo_description:
      "UX and product design case study for UnWrrap - an AI-powered gifting marketplace with group payments and guided checkout.",
    keywords: "gifting marketplace UX, UnWrrap, product design, Pradeep Suthar",
  },
  "smart-cv": {
    title: "Smart CV",
    excerpt:
      "Dynamic resume builder with clearer layout controls - so candidates create polished CVs without fighting the UI.",
    challenge:
      "Users struggled to produce clean resumes quickly; layout options felt technical and hard to preview.",
    approach:
      "Simplified the builder into guided sections with live preview, sensible defaults, and progressive disclosure.",
    outcome:
      "A resume product experience that prioritizes clarity, speed, and export-ready results.",
    metrics: [
      { label: "Time to first draft", value: "Faster" },
      { label: "Preview confidence", value: "High" },
      { label: "Sections redesigned", value: "12" },
    ],
    seo_title: "Smart CV Resume Builder UX | Pradeep Suthar",
    seo_description:
      "Case study: designing Smart CV, a dynamic resume builder focused on layout clarity and guided UX.",
    keywords: "resume builder UX, Smart CV, product design, Pradeep Suthar",
  },
  fruitish: {
    excerpt:
      "Conversion-focused landing page for organic produce orders via WhatsApp - mobile-first, fast, and action-led.",
    challenge:
      "The brand needed a lightweight storefront that converted mobile visitors into WhatsApp orders without a heavy checkout.",
    approach:
      "Designed and built a responsive React landing page with strong hierarchy, trust cues, and a direct order CTA.",
    outcome:
      "A fast marketing site tuned for mobile conversion and simple order intent.",
    metrics: [
      { label: "Primary CTA", value: "WhatsApp" },
      { label: "Focus", value: "Mobile conversion" },
      { label: "Stack", value: "React" },
    ],
    seo_title: "Fruitish Landing Page Conversion Design | Pradeep Suthar",
    seo_description:
      "Landing page design and frontend case study for Fruitish - conversion-focused organic produce ordering.",
    keywords: "landing page conversion, Fruitish, React, Pradeep Suthar",
  },
  "property-management": {
    excerpt:
      "Multi-role real-estate operations dashboard - simplified workflows for owners, managers, and tenants.",
    challenge:
      "Operational tasks were scattered across dense screens, making day-to-day property work slow and error-prone.",
    approach:
      "Restructured roles and dashboards around frequent jobs-to-be-done with clearer navigation and status patterns.",
    outcome:
      "A usable operations UI that supports multiple roles without overwhelming first-time users.",
    metrics: [
      { label: "Roles supported", value: "3+" },
      { label: "Workflow focus", value: "Daily ops" },
      { label: "UX pattern", value: "Dashboard" },
    ],
    seo_title: "Property Management Dashboard UX | Pradeep Suthar",
    seo_description:
      "UX case study for a property management platform - multi-role dashboards and simplified real-estate workflows.",
    keywords: "property management UX, dashboard design, Pradeep Suthar",
  },
  interior: {
    excerpt:
      "Component-based React storefront for interiors - responsive catalog browsing with cleaner product discovery.",
    challenge:
      "The online store needed a modern frontend foundation that stayed fast and consistent across catalog pages.",
    approach:
      "Built a React architecture with reusable components, responsive grids, and clear product presentation.",
    outcome:
      "A maintainable storefront UI ready for iteration and performance tuning.",
    metrics: [
      { label: "Stack", value: "React" },
      { label: "Focus", value: "Catalog UX" },
      { label: "Responsive", value: "Yes" },
    ],
    seo_title: "Interior Online Store Frontend | Pradeep Suthar",
    seo_description:
      "Frontend case study: building a responsive React e-commerce experience for an interior store.",
    keywords: "React e-commerce, interior store, frontend, Pradeep Suthar",
  },
};

const serviceUpgrades = {
  "ui-design": {
    title: "UI Design",
    description:
      "Clean, conversion-focused interfaces for web and SaaS. I design visual hierarchy, responsive layouts, and component systems that feel polished and stay consistent as the product grows. Ideal for startups shipping MVPs or teams refreshing a dated UI. Not a fit for pure brand illustration or print-only work.",
    tags: ["Visual hierarchy", "Responsive UI", "Design systems", "SaaS interfaces"],
    seo_title: "UI Design Services for Web & SaaS | Pradeep Suthar",
    seo_description:
      "Professional UI design for startups and digital products - responsive, accessible interfaces that improve usability and engagement.",
    keywords: "UI designer, UI design services, SaaS UI, interface design, Pradeep Suthar",
  },
  "ux-research": {
    title: "UX Research",
    description:
      "Evidence before pixels. I run interviews, usability tests, and journey mapping so product decisions rest on real user behavior - not assumptions. Ideal for teams validating a new flow or diagnosing drop-off. Not a fit for large quantitative research programs needing a full research ops team.",
    tags: ["User interviews", "Usability testing", "Journey maps", "Validation"],
    seo_title: "UX Research Services | Interviews & Usability Testing | Pradeep Suthar",
    seo_description:
      "UX research services including interviews, usability testing, and journey mapping to build products users actually want.",
    keywords: "UX research, usability testing, user research, Pradeep Suthar",
  },
  "product-design": {
    title: "Product Design",
    description:
      "End-to-end product design from discovery to interface - flows, wireframes, interactive prototypes, and MVP definition for founders and product teams. Ideal for SaaS and digital products that need clarity before build. Not a fit for one-off logo design or marketing-only creatives.",
    tags: ["UX strategy", "Prototyping", "MVP design", "Product thinking"],
    seo_title: "Product Design Services for Startups & SaaS | Pradeep Suthar",
    seo_description:
      "Product design from UX strategy to UI and MVP creation - helping founders turn ideas into scalable digital products.",
    keywords: "product designer, SaaS product design, MVP design, Pradeep Suthar",
  },
  "frontend-development": {
    title: "Frontend Development",
    description:
      "Production React and Next.js interfaces that match the design intent - fast, accessible, and SEO-aware. Ideal when you want design and engineering in one partner. Not a fit for large backend/platform engineering retainers.",
    tags: ["React", "Next.js", "Performance", "Accessibility"],
    seo_title: "React & Next.js Frontend Developer | Pradeep Suthar",
    seo_description:
      "Frontend development with React and Next.js - fast, SEO-friendly web apps with modern architecture and performance focus.",
    keywords: "React developer, Next.js developer, frontend development, Pradeep Suthar",
  },
};

const postSeo = [
  {
    slug: "designing-scalable-saas-products-a-product-designers-blueprint",
    seo_title: "Scalable SaaS Product Design Blueprint | Pradeep Suthar",
    seo_description:
      "A practical blueprint for designing scalable SaaS products - information architecture, cognitive load, and design tokens that ship.",
    excerpt:
      "A practical guide to SaaS product design: structure complex products, reduce cognitive load, and build systems teams can grow.",
    keywords: "SaaS product design, design systems, IA, Pradeep Suthar",
  },
  {
    slug: "figma-to-react-best-practices-developer-handoff",
    seo_title: "Figma to React Handoff Best Practices | Pradeep Suthar",
    seo_description:
      "How designers and developers align components, tokens, and specs for a smooth Figma-to-React handoff.",
    excerpt:
      "Align components, naming, and specs so Figma-to-React handoff stays fast and accurate.",
    keywords: "Figma to React, design handoff, design systems, Pradeep Suthar",
  },
  {
    slug: "anatomy-high-converting-landing-page",
    seo_title: "High-Converting Landing Page Anatomy | Pradeep Suthar",
    seo_description:
      "Deconstruct landing page layouts that convert - hierarchy, proof, and CTA placement that drive action.",
    excerpt:
      "Deconstruct landing pages that convert: hierarchy, social proof, and CTA placement that move visitors to action.",
    keywords: "landing page conversion, CRO, UI UX, Pradeep Suthar",
  },
  {
    slug: "saas-dashboard-ux-designing-interfaces",
    seo_title: "SaaS Dashboard UX for Data-Heavy Products | Pradeep Suthar",
    seo_description:
      "How to structure dense metrics and workflows in SaaS dashboards without overwhelming users.",
    excerpt:
      "Structure complex metrics and workflows so data-heavy SaaS dashboards stay usable and decisive.",
    keywords: "SaaS dashboard UX, data UI, product design, Pradeep Suthar",
  },
  {
    slug: "core-web-vitals-frontend-developers-guide",
    seo_title: "Core Web Vitals Guide for Frontend Developers | Pradeep Suthar",
    seo_description:
      "A practical Core Web Vitals guide covering LCP, INP, CLS, and Next.js performance patterns that affect rankings.",
    excerpt:
      "A practical breakdown of LCP, INP, and CLS - plus Next.js patterns that improve speed and search visibility.",
    keywords: "Core Web Vitals, Next.js performance, SEO, Pradeep Suthar",
  },
  {
    slug: "solving-checkout-friction-saas-optimization",
    seo_title: "Checkout Friction Case Study for SaaS | Pradeep Suthar",
    seo_description:
      "Analyze drop-off, fix friction, and improve SaaS checkout conversion with UX and frontend craft.",
    excerpt:
      "Find checkout drop-off, remove friction, and improve SaaS conversion with focused UX changes.",
    keywords: "checkout UX, SaaS conversion, CRO, Pradeep Suthar",
  },
  {
    slug: "scaling-ui-accessible-design-systems-css-variables",
    seo_title: "Accessible Design Systems with CSS Variables | Pradeep Suthar",
    seo_description:
      "Build scalable, accessible UI systems using semantic tokens and modern CSS variables.",
    excerpt:
      "Use semantic tokens and CSS variables to scale accessible UI systems without slowing teams down.",
    keywords: "design systems, CSS variables, accessibility, Pradeep Suthar",
  },
  {
    slug: "future-digital-product-design-ai-adaptive",
    seo_title: "AI Co-pilots & Adaptive Product Design | Pradeep Suthar",
    seo_description:
      "Explore AI co-pilots and adaptive interfaces - and what product designers should build for next.",
    excerpt:
      "Explore AI co-pilots and adaptive interfaces shaping the next wave of digital product design.",
    keywords: "AI product design, adaptive UI, future of UX, Pradeep Suthar",
  },
];

const faqs = [
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
];

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL required");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.DATABASE_SSL === "true"
        ? { rejectUnauthorized: false }
        : undefined,
  });
  await client.connect();
  try {
    const { rows: profileRows } = await client.query(
      "SELECT home FROM profile WHERE id = 'primary'",
    );
    const home =
      profileRows[0]?.home && typeof profileRows[0].home === "object"
        ? { ...profileRows[0].home }
        : {};
    home.faqs = faqs;
    home.stats = [
      ["3+", "Years experience"],
      ["20+", "Projects shipped"],
      ["12-24h", "Typical reply time"],
    ];
    home.socialProof = "Trusted by founders & product teams";
    home.eyebrow = "Product designer & frontend developer";

    await client.query(
      `UPDATE profile SET
        name = $1,
        title = $2,
        seo_title = $3,
        seo_description = $4,
        keywords = $5,
        og_image_url = COALESCE(NULLIF(btrim(og_image_url), ''), '/images/portrait.webp'),
        availability = $6,
        intro = $7,
        summary = $8,
        home = $9::jsonb,
        updated_at = now()
       WHERE id = 'primary'`,
      [
        "Pradeep Suthar",
        "Product Designer & Frontend Developer",
        "Product Designer & Front-End Developer | Pradeep Suthar",
        "Pradeep Suthar - Product Designer and Front-End Developer crafting intuitive, elegant, and performance-driven digital experiences with UI/UX, React, Next.js, and modern design systems.",
        "Product Designer, Front-End Developer, UI UX Designer, React Developer, Next.js Developer, Hire Product Designer, Ahmedabad",
        "Available for work",
        "I specialise in UX research, UI/UX design, scalable design systems and high-performance web apps built with React and Next.js.",
        "I help brands create modern, responsive and user-centred digital products - bridging design and engineering to bring your vision to life with precision and creativity.",
        JSON.stringify(home),
      ],
    );

    for (const [slug, data] of Object.entries(projectUpgrades)) {
      await client.query(
        `UPDATE projects SET
          title = COALESCE($2, title),
          excerpt = $3,
          challenge = $4,
          approach = $5,
          outcome = $6,
          metrics = $7::jsonb,
          seo_title = $8,
          seo_description = $9,
          keywords = $10,
          featured = COALESCE($11, featured),
          updated_at = now()
         WHERE slug = $1`,
        [
          slug,
          data.title || null,
          data.excerpt,
          data.challenge,
          data.approach,
          data.outcome,
          JSON.stringify(data.metrics || []),
          data.seo_title,
          data.seo_description,
          data.keywords,
          data.featured ?? null,
        ],
      );
    }

    // Ensure remaining published projects have non-duplicate SEO descriptions
    await client.query(`
      UPDATE projects SET
        seo_description = LEFT(COALESCE(NULLIF(btrim(excerpt), ''), description, title), 155),
        keywords = COALESCE(NULLIF(btrim(keywords), ''), array_to_string(tags, ', '))
      WHERE published = true
        AND (seo_description IS NULL OR btrim(seo_description) = '' OR seo_description = title OR seo_description = seo_title)
    `);

    for (const [slug, data] of Object.entries(serviceUpgrades)) {
      await client.query(
        `UPDATE services SET
          title = $2,
          description = $3,
          tags = $4,
          seo_title = $5,
          seo_description = $6,
          keywords = $7,
          updated_at = now()
         WHERE slug = $1`,
        [
          slug,
          data.title,
          data.description,
          data.tags,
          data.seo_title,
          data.seo_description,
          data.keywords,
        ],
      );
    }

    for (const post of postSeo) {
      await client.query(
        `UPDATE blog_posts SET
          seo_title = $2,
          seo_description = $3,
          excerpt = COALESCE(NULLIF(btrim($4), ''), excerpt),
          keywords = $5,
          updated_at = now()
         WHERE slug = $1`,
        [
          post.slug,
          post.seo_title,
          post.seo_description,
          post.excerpt,
          post.keywords,
        ],
      );
    }

    console.log("SEO/CRO content upgrade complete.");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
