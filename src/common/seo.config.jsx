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
      "I design and build fast, accessible, and delightful user interfaces using React, Next.js and modern design systems. Explore my UI/UX work and frontend projects.",
    keywords:
      "Front-End Developer, Product Designer, UI UX Designer, React Developer, Next.js Developer, Interface Design, Pradeep Portfolio",
    ogTitle: "Pradeep | Product Designer & Front-End Developer",
    ogImage: SITE.defaultOgImage,
    ogUrl: `${SITE.siteUrl}/`,
    ogType: "website",
    locale: SITE.locale,
    canonical: `${SITE.siteUrl}/`,
  },

  about: {
    pageTitle: "About | Pradeep – Product Designer & Front-End Developer",
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
    pageTitle: "Resume | Pradeep – Product Designer & Front-End Developer",
    pageDescription:
      "Explore my resume: skills, experience, UI/UX expertise, React and Next.js projects, design systems, and frontend engineering background.",
    keywords:
      "Pradeep Resume, Frontend Developer Resume, Product Designer Resume, UI UX Resume, React Resume, Next.js Resume",
    ogTitle: "Pradeep Resume | Front-End Developer & Product Designer",
    ogImage: SITE.defaultOgImage,
    ogUrl: `${SITE.siteUrl}/resume`,
    ogType: "article",
    locale: SITE.locale,
    canonical: `${SITE.siteUrl}/resume`,
  },

  portfolio: {
    pageTitle: "Portfolio | Front-End Projects & Product Design Work",
    pageDescription:
      "View selected frontend development and product design projects built with React, Next.js, and modern UI/UX principles focused on usability and performance.",
    keywords:
      "Frontend Portfolio, UI UX Portfolio, React Projects, Next.js Portfolio, Product Design Work, Interface Design Portfolio",
    ogTitle: "Pradeep Portfolio | Front-End & Product Design",
    ogImage: SITE.defaultOgImage,
    ogUrl: `${SITE.siteUrl}/portfolio`,
    ogType: "website",
    locale: SITE.locale,
    canonical: `${SITE.siteUrl}/portfolio`,
  },

  contact: {
    pageTitle: "Contact | Hire Product Designer & Front-End Developer",
    pageDescription:
      "Contact Pradeep for frontend development, product design, UI/UX work, freelance projects, or collaborations. Available for React and Next.js roles.",
    keywords:
      "Contact Pradeep, Hire Frontend Developer, Hire Product Designer, React Developer Contact, Next.js Hire, UI UX Contact",
    ogTitle: "Contact Pradeep | Let's Work Together",
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
      "Pradeep – Front-End Developer and Product Designer creating intuitive, accessible, and high-performance web experiences using React, Next.js, and design systems.",
    keywords:
      "Front-End Developer, Product Designer, UI UX, React, Next.js, Portfolio, Web Design",
    ogTitle: "Pradeep | Front-End Developer & Product Designer",
    ogImage: SITE.defaultOgImage,
    ogUrl: SITE.siteUrl,
    ogType: "website",
    locale: SITE.locale,
    canonical: SITE.siteUrl,
  },
};

export default SEOConfig;
