/**
 * Central SEO copy for static/public pages.
 * Edit titles, descriptions, and keywords here - pages read from this file.
 *
 * Dynamic records (projects, posts, services) still prefer admin SEO fields,
 * then fall back to the *Detail templates below.
 */

export const SITE = {
  siteName: "Pradeep Suthar",
  locale: "en_IN",
  defaultOgImage: "/images/portrait.webp",
  logo: "/images/logo.png",
  twitterHandle: "",
};

const SEOConfig = {
  home: {
    pageTitle: "Product Designer & Front-End Developer | Pradeep Suthar",
    pageDescription:
      "Pradeep Suthar - Product Designer and Front-End Developer crafting intuitive, elegant, and performance-driven digital experiences with UI/UX, React, Next.js, and modern design systems.",
    keywords:
      "Product Designer, Front-End Developer, UI UX Designer, React Developer, Next.js Developer, Web Designer India, Portfolio Designer, Interface Design Expert, Hire Product Designer",
    ogTitle:
      "Product Designer & Front-End Developer Crafting Exceptional Digital Experiences | Pradeep Suthar",
    path: "/",
    ogType: "website",
  },

  resume: {
    // Intent: CV / hire-ready skills proof (~55-60 chars)
    pageTitle: "Product Designer & React Developer Resume | Pradeep Suthar",
    pageDescription:
      "View Pradeep Suthar resume: product design, UI/UX, design systems, and React/Next.js frontend experience for startups and SaaS teams.",
    keywords:
      "product designer resume, frontend developer CV, React developer resume, UI UX resume, Next.js developer, hire product designer India",
    ogTitle: "Product Designer & React Developer Resume | Pradeep Suthar",
    path: "/resume",
    ogType: "profile",
  },

  work: {
    // Intent: portfolio / case studies (topic first, brand last)
    pageTitle: "UI/UX & Product Design Case Studies | Pradeep Suthar",
    pageDescription:
      "Selected UI/UX and product design case studies plus React/Next.js frontend work - outcomes, process, and measurable results.",
    keywords:
      "UI UX portfolio, product design case studies, SaaS design portfolio, React Next.js projects, interface design portfolio, hire UX designer",
    ogTitle: "UI/UX & Product Design Case Studies | Pradeep Suthar",
    path: "/work",
    ogType: "website",
  },

  blog: {
    // Avoid vague "Blogs"; name the topics people search
    pageTitle: "Product Design & Frontend Blog | Pradeep Suthar",
    pageDescription:
      "Practical articles on product design, UX, React, Next.js, design systems, and frontend performance from Pradeep Suthar.",
    keywords:
      "product design blog, UX design articles, React Next.js blog, design systems, frontend performance, Core Web Vitals",
    ogTitle: "Product Design & Frontend Blog | Pradeep Suthar",
    path: "/blog",
    ogType: "website",
  },

  services: {
    pageTitle: "UX, Product Design & Frontend Services | Pradeep Suthar",
    pageDescription:
      "UX research, product design, design systems, and React/Next.js frontend development for startups and SaaS teams.",
    keywords:
      "UX research services, product design services, design systems, frontend development, hire UI UX designer, React Next.js developer",
    ogTitle: "UX, Product Design & Frontend Services | Pradeep Suthar",
    path: "/services",
    ogType: "website",
  },

  contact: {
    // Intent: commercial "hire …" queries
    pageTitle: "Hire a Product Designer & Frontend Developer | Pradeep Suthar",
    pageDescription:
      "Hire Pradeep Suthar for UI/UX, product design, and React/Next.js builds. Share your brief - typical reply within 12-24 hours.",
    keywords:
      "hire product designer, hire frontend developer, hire UI UX designer, React developer freelance, Next.js developer India, contact Pradeep Suthar",
    ogTitle: "Hire a Product Designer & Frontend Developer | Pradeep Suthar",
    path: "/contact",
    ogType: "website",
  },

  /** Templates for CMS detail pages. Use %s for the record title. */
  workDetail: {
    pageTitle: "%s - UI/UX Case Study | Pradeep Suthar",
    pageDescription:
      "%s - product design and frontend case study by Pradeep Suthar: challenge, approach, and outcomes.",
    keywords:
      "product design case study, UX case study, frontend project, Pradeep Suthar portfolio",
    ogType: "article",
  },

  blogDetail: {
    pageTitle: "%s | Pradeep Suthar",
    pageDescription:
      "%s - product design and frontend insights by Pradeep Suthar.",
    keywords:
      "product design blog, UX article, frontend engineering, Pradeep Suthar",
    ogType: "article",
  },

  serviceDetail: {
    pageTitle: "%s - Design & Frontend Services | Pradeep Suthar",
    pageDescription:
      "%s by Pradeep Suthar - UX, product design, and frontend craft for digital products.",
    keywords:
      "design services, UX services, frontend development services, Pradeep Suthar",
    ogType: "website",
  },

  default: {
    pageTitle: "Product Designer & Front-End Developer | Pradeep Suthar",
    pageDescription:
      "Pradeep Suthar - Product Designer and Front-End Developer crafting intuitive, elegant, and performance-driven digital experiences.",
    keywords:
      "Product Designer, Front-End Developer, UI UX, React, Next.js, Web Designer, Digital Product Designer, Portfolio Website",
    ogTitle:
      "Pradeep Suthar | Product Designer & Front-End Developer",
    path: "/",
    ogType: "website",
  },
};

export default SEOConfig;
