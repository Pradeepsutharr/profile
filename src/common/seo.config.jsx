// lib/seo.config.js
export const SITE = {
  siteName: "Pradeep",
  // change this to your real domain (e.g. https://pradeep.dev or https://yourname.com)
  siteUrl: "https://pradeep.dev",
  // replace with the absolute URL to your logo used for structured data / OG
  logo: "https://pradeep.dev/images/seo-logo.png",
  // replace with the absolute URL to your default OG image
  defaultOgImage: "https://pradeep.dev/images/og-image.png",
  // update with your real twitter handle if any (include @)
  twitter: "@pradeep_dev",
  // locale - change if needed (en_IN is suitable for India)
  locale: "en_IN",
};

const SEOConfig = {
  home: {
    pageTitle: "Pradeep | Front-End Developer & Product Designer",
    pageDescription:
      "I design and build fast, accessible, and delightful user interfaces using React, Next.js and modern design systems. Explore my UI/UX case studies and frontend projects.",
    keywords:
      "Front-End Developer, Product Designer, UI UX Designer, React Developer, Next.js Developer, Design Systems, Frontend Portfolio, Pradeep",
    ogTitle: "Pradeep | Front-End Development & Product Design",
    ogImage: SITE.defaultOgImage,
    ogUrl: `${SITE.siteUrl}/`,
    ogType: "website",
    locale: SITE.locale,
    canonical: `${SITE.siteUrl}/`,
  },

  about: {
    pageTitle: "About Pradeep | Front-End Developer & Designer",
    pageDescription:
      "Learn about Pradeep — a front-end developer and product designer focused on human-centered interfaces, performance-first front-end engineering, and product strategy.",
    keywords:
      "About Pradeep, Frontend Developer Bio, Product Designer Profile, UI UX Designer India, React Frontend Engineer, Design Systems",
    ogTitle: "About Pradeep | Front-End Developer & Product Designer",
    ogImage: SITE.defaultOgImage,
    ogUrl: `${SITE.siteUrl}/about`,
    ogType: "profile",
    locale: SITE.locale,
    canonical: `${SITE.siteUrl}/about`,
  },

  resume: {
    pageTitle: "Resume | Pradeep — Front-End Developer & Product Designer",
    pageDescription:
      "View Pradeep's resume: experience in front-end engineering, UI/UX design, React, Next.js, responsive interfaces, design systems and product design workflows.",
    keywords:
      "Pradeep Resume, Frontend Developer Resume, Product Designer Resume, React Resume, Next.js Resume, UI UX Resume",
    ogTitle: "Pradeep Resume | Front-End Developer & Product Designer",
    ogImage: SITE.defaultOgImage,
    ogUrl: `${SITE.siteUrl}/resume`,
    ogType: "article",
    locale: SITE.locale,
    canonical: `${SITE.siteUrl}/resume`,
  },

  portfolio: {
    pageTitle: "Portfolio | Front-End Projects & UI/UX Case Studies",
    pageDescription:
      "Explore frontend projects and product design case studies built with React and Next.js — focusing on usability, performance and measurable product outcomes.",
    keywords:
      "Frontend Portfolio, UI UX Case Studies, React Projects, Next.js Portfolio, Product Design Projects, Interface Design Portfolio",
    ogTitle: "Pradeep Portfolio | Front-End Development & Product Design Work",
    ogImage: SITE.defaultOgImage,
    ogUrl: `${SITE.siteUrl}/portfolio`,
    ogType: "website",
    locale: SITE.locale,
    canonical: `${SITE.siteUrl}/portfolio`,
  },

  contact: {
    pageTitle: "Contact | Hire Front-End Developer & Product Designer",
    pageDescription:
      "Get in touch with Pradeep for front-end development, UI/UX design, freelance projects or collaboration. Available for React and Next.js work.",
    keywords:
      "Contact Pradeep, Hire Frontend Developer, Hire Product Designer, React Developer Contact, Next.js Developer Hire, UI UX Designer Contact",
    ogTitle: "Contact Pradeep | Work With Me",
    ogImage: SITE.defaultOgImage,
    ogUrl: `${SITE.siteUrl}/contact`,
    ogType: "website",
    locale: SITE.locale,
    canonical: `${SITE.siteUrl}/contact`,
  },

  // optional blog / case-studies pages if you add them later
  blog: {
    pageTitle: "Blog | UX, Frontend & Product Design Notes",
    pageDescription:
      "Articles and notes about frontend development, UI/UX patterns, performance, accessibility and product design process.",
    keywords:
      "frontend blog, UI UX articles, React tutorials, Next.js guides, product design blog, accessibility best practices",
    ogTitle: "Pradeep Blog | Frontend & Product Design",
    ogImage: SITE.defaultOgImage,
    ogUrl: `${SITE.siteUrl}/blog`,
    ogType: "blog",
    locale: SITE.locale,
    canonical: `${SITE.siteUrl}/blog`,
  },

  caseStudies: {
    pageTitle: "Case Studies | Product Design & Frontend Engineering",
    pageDescription:
      "In-depth case studies showing product thinking, user research, design iterations, and front-end engineering that delivered measurable results.",
    keywords:
      "product design case study, UI UX case study, frontend engineering case study, design thinking, user research examples",
    ogTitle: "Case Studies | Product Design & Front-End Work",
    ogImage: SITE.defaultOgImage,
    ogUrl: `${SITE.siteUrl}/case-studies`,
    ogType: "website",
    locale: SITE.locale,
    canonical: `${SITE.siteUrl}/case-studies`,
  },

  // helper default
  default: {
    pageTitle: "Pradeep",
    pageDescription:
      "Pradeep — Front-End Developer and Product Designer building fast, accessible, and delightful digital experiences using React, Next.js and modern design systems.",
    keywords:
      "Front-End Developer, Product Designer, React, Next.js, UI UX, frontend portfolio, design systems",
    ogTitle: "Pradeep | Front-End Development & Product Design",
    ogImage: SITE.defaultOgImage,
    ogUrl: SITE.siteUrl,
    ogType: "website",
    locale: SITE.locale,
    canonical: SITE.siteUrl,
  },
};

export default SEOConfig;
