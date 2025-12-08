// lib/seo.config.js
export const SITE = {
  siteName: "Pradeep",
  siteUrl: "https://pradeep-suthar.vercel.app",
  // replace with real absolute URLs when you upload your logo/og image
  logo: "https://pradeep-suthar.vercel.app/seo_logo.svg",
  defaultOgImage: "https://pradeep-suthar.vercel.app/seo_logo.svg",
  // twitter: "@pradeep_dev",
  locale: "en_IN",
};

const SEOConfig = {
  home: {
    pageTitle: "Pradeep | Product Designer & Front-End Developer",
    pageDescription:
      "Pradeep | A Product Designer and Front-End Developer crafting intuitive, elegant, and performance-driven digital experiences using UI/UX principles, React, Next.js, and modern design systems.",
    keywords:
      "Product Designer, Front-End Developer, UI UX Designer, React Developer, Next.js Developer, Web Designer India, Portfolio Designer, Interface Design Expert",
    ogTitle:
      "Pradeep | Product Designer & Front-End Developer Crafting Exceptional Digital Experiences",
    ogImage: SITE.defaultOgImage,
    ogUrl: `${SITE.siteUrl}/`,
    ogType: "website",
    locale: SITE.locale,
    canonical: `${SITE.siteUrl}/`,
  },

  about: {
    pageTitle: "About | Pradeep - Product Designer & Front-End Developer",
    pageDescription:
      "I'm Pradeep, a front-end developer and product designer crafting human-centered digital experiences. I blend UI/UX, aesthetics, and performance engineering.",
    keywords:
      "About Pradeep, Frontend Developer, Product Designer, UI UX Designer India, React Engineer, Next.js Developer, Design Systems",
    ogTitle: "About Pradeep | Front-End Developer & Product Designer",
    ogImage: SITE.defaultOgImage,
    ogUrl: `${SITE.siteUrl}/about`,
    ogType: "profile",
    locale: SITE.locale,
    canonical: `${SITE.siteUrl}/about`,
  },

  resume: {
    pageTitle: "Resume | Pradeep - Product Designer & Front-End Developer",
    pageDescription:
      "Explore my resume: skills, experience, UI/UX expertise, React and Next.js projects, design systems, and frontend engineering background.",
    keywords:
      "Pradeep Resume, Frontend Developer Resume, Product Designer Resume, UI UX Resume, React Resume, Next.js Resume",
    ogTitle:
      "Pradeep Resume | Proven Expertise in Product Design, UI/UX & Front-End Development",
    ogImage: SITE.defaultOgImage,
    ogUrl: `${SITE.siteUrl}/resume`,
    ogType: "article",
    locale: SITE.locale,
    canonical: `${SITE.siteUrl}/resume`,
  },

  portfolio: {
    pageTitle: "Portfolio | Front-End Projects & Product Design Work",
    pageDescription:
      "Browse Pradeep’s portfolio showcasing UI/UX design work, product design case studies, and front-end development projects built with React, Next.js, and modern design systems.",
    keywords:
      "UI UX Portfolio, Product Design Portfolio, Front-End Developer Projects, React Projects, Next.js Portfolio, Website Design Work, Interface Design Portfolio",
    ogTitle:
      "Pradeep Portfolio | UI/UX Design, Product Design & Front-End Development Work",
    ogImage: SITE.defaultOgImage,
    ogUrl: `${SITE.siteUrl}/portfolio`,
    ogType: "website",
    locale: SITE.locale,
    canonical: `${SITE.siteUrl}/portfolio`,
  },

  contact: {
    pageTitle: "Contact | Hire Product Designer & Front-End Developer",
    pageDescription:
      "Contact Pradeep for UI/UX design, product design, and front-end development services. Available for freelance work, collaborations, and React/Next.js development projects.",
    keywords:
      "Hire Product Designer, Hire Front-End Developer, Hire UI UX Designer, React Developer Hire, Next.js Developer Hire, Contact Pradeep, Freelance Designer India",
    ogTitle:
      "Contact Pradeep | Work With a Skilled Product Designer & Front-End Developer",
    ogImage: SITE.defaultOgImage,
    ogUrl: `${SITE.siteUrl}/contact`,
    ogType: "website",
    locale: SITE.locale,
    canonical: `${SITE.siteUrl}/contact`,
  },

  //  caseStudies: {
  //   pageTitle: "Case Studies | Product Design & Frontend Engineering",
  //   pageDescription:
  //     "In-depth case studies showing product thinking, user research, design iterations, and front-end engineering that delivered measurable results.",
  //   keywords:
  //     "product design case study, UI UX case study, frontend engineering case study, design thinking, user research examples",
  //   ogTitle: "Case Studies | Product Design & Front-End Work",
  //   ogImage: SITE.defaultOgImage,
  //   ogUrl: `${SITE.siteUrl}/case-studies`,
  //   ogType: "website",
  //   locale: SITE.locale,
  //   canonical: `${SITE.siteUrl}/case-studies`,
  // },

  default: {
    pageTitle: "Pradeep",
    pageDescription:
      "Pradeep | A Product Designer and Front-End Developer crafting intuitive, elegant, and performance-driven digital experiences using UI/UX principles, React, Next.js, and modern design systems.",
    keywords:
      "Product Designer, Front-End Developer, UI UX, React, Next.js, Web Designer, Digital Product Designer, Portfolio Website",
    ogTitle:
      "Pradeep | Product Designer & Front-End Developer Crafting Exceptional Digital Experiences",
    ogImage: SITE.defaultOgImage,
    ogUrl: SITE.siteUrl,
    ogType: "website",
    locale: SITE.locale,
    canonical: SITE.siteUrl,
  },
};

export default SEOConfig;
