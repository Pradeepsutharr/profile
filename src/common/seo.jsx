// import Head from "next/head";
// import PropTypes from "prop-types";

// /**
//  * SEO component for personal portfolio (Pradeep)
//  * - Defaults tuned for a Front-End Developer & Product Designer
//  * - Accepts page-level overrides for title/description/og/twitter/schema
//  * - Renders Person + WebSite JSON-LD by default and merges page structuredData if provided
//  *
//  * NOTE:
//  * - Replace DEFAULTS.logo and DEFAULTS.defaultOgImage with absolute URLs after you upload them.
//  * - Update DEFAULTS.twitterHandle and `defaultSameAs` with your real social profile URLs.
//  */

// const DEFAULTS = {
//   siteName: "Pradeep",
//   // your live website
//   siteUrl: "https://pradeep-suthar.vercel.app",
//   logo: "https://pradeep-suthar.vercel.app/seo-logo.svg",
//   defaultOgImage: "https://pradeep-suthar.vercel.app/seo-logo.svg",
//   // twitterHandle: "@pradeep_dev",
//   locale: "en_IN",
//   // fbAppId: "",
//   defaultTitle: "Pradeep | Front-End Developer & Product Designer",
//   defaultDescription:
//     "I design and build fast, accessible, and delightful user experiences using React, Next.js and modern design systems. Case studies and frontend projects.",
//   defaultKeywords:
//     "Front-End Developer, Product Designer, UI UX Designer, UI UX Design, React, Next.js, UI UX, Design Systems, Frontend Portfolio, Pradeep",
// };

// const organizationSchema = ({ siteUrl, siteName, logo, sameAs = [] }) => ({
//   "@context": "https://schema.org",
//   "@type": "Organization",
//   "@id": `${siteUrl}/#organization`,
//   name: siteName,
//   url: siteUrl,
//   logo: { "@type": "ImageObject", url: logo },
//   sameAs: sameAs,
// });

// // Person schema (for personal portfolio)
// const buildPersonSchema = ({ siteUrl, siteName, logo, sameAs = [] }) => ({
//   "@type": "Person",
//   "@id": `${siteUrl}/#person`,
//   name: siteName,
//   url: siteUrl,
//   image: logo,
//   sameAs,
//   jobTitle: "Front-End Developer & Product Designer",
// });

// // Website schema
// const buildWebsiteSchema = ({ siteUrl, siteName }) => ({
//   "@type": "WebSite",
//   "@id": `${siteUrl}/#website`,
//   url: siteUrl,
//   name: siteName,
//   publisher: { "@id": `${siteUrl}/#person` },
// });

// const SEO = ({
//   pageTitle,
//   pageDescription,
//   keywords,
//   ogImage,
//   ogTitle,
//   ogUrl,
//   ogType = "website",
//   locale = DEFAULTS.locale,
//   noindex = false,
//   structuredData = null, // page-specific JSON-LD object or array
//   children,
//   titleTemplate = "%s | Pradeep",
// }) => {
//   // Title handling
//   const title = pageTitle
//     ? titleTemplate.replace("%s", pageTitle)
//     : DEFAULTS.defaultTitle;
//   const description = pageDescription ?? DEFAULTS.defaultDescription;
//   const keywordString = keywords ?? DEFAULTS.defaultKeywords;
//   const canonical = ogUrl ?? DEFAULTS.siteUrl;
//   const image = ogImage ?? DEFAULTS.defaultOgImage;
//   const socialTitle = ogTitle ?? pageTitle ?? DEFAULTS.siteName;

//   // default social profiles — update these with your real profile URLs
//   const defaultSameAs = [
//     // replace or remove entries as needed
//     // "https://twitter.com/your_handle",
//     "https://www.linkedin.com/in/pradeep-suthar-a47432273/",
//     "https://github.com/sutharpradip",
//   ];

//   // Core structured data (Person + WebSite)
//   const personSchema = buildPersonSchema({
//     siteUrl: DEFAULTS.siteUrl,
//     siteName: DEFAULTS.siteName,
//     logo: DEFAULTS.logo,
//     sameAs: defaultSameAs,
//   });

//   const websiteSchema = buildWebsiteSchema({
//     siteUrl: DEFAULTS.siteUrl,
//     siteName: DEFAULTS.siteName,
//   });

//   const organization = organizationSchema({
//     siteUrl: DEFAULTS.siteUrl,
//     siteName: DEFAULTS.siteName,
//     logo: DEFAULTS.logo,
//     sameAs: defaultSameAs,
//   });

//   // Merge default schema with page-level structuredData if given
//   const jsonLdArray = [
//     { "@context": "https://schema.org" },
//     personSchema,
//     organization,
//     websiteSchema,
//   ];

//   if (structuredData) {
//     if (Array.isArray(structuredData)) {
//       jsonLdArray.push(...structuredData);
//     } else {
//       jsonLdArray.push(structuredData);
//     }
//   }

//   return (
//     <Head>
//       {/* Core */}
//       <meta charSet="utf-8" />
//       <title>{title}</title>
//       <meta name="viewport" content="width=device-width, initial-scale=1" />
//       <link rel="icon" type="image/png" href="/favicon.ico" sizes="any" />
//       <link rel="shortcut icon" href="/favicon.ico" />
//       <link rel="canonical" href={canonical} />

//       {/* SEO */}
//       <meta name="application-name" content="Pradeep" />
//       <meta name="description" content={description} />
//       <meta name="keywords" content={keywordString} />
//       <meta name="author" content={DEFAULTS.siteName} />
//       <meta
//         name="copyright"
//         content={`${DEFAULTS.siteName} © ${new Date().getFullYear()}`}
//       />
//       <meta name="theme-color" content="#0b4b6f" />
//       <meta name="distribution" content="Global" />
//       <meta
//         name="owner"
//         content="Pradeep – Product Designer & Front-End Developer"
//       />
//       <meta
//         name="robots"
//         content={
//           noindex
//             ? "noindex, nofollow"
//             : "index, follow, max-image-preview:large"
//         }
//       />

//       {/* Open Graph */}
//       <meta property="og:title" content={socialTitle} />
//       <meta property="og:description" content={description} />
//       <meta property="og:url" content={canonical} />
//       <meta property="og:site_name" content={DEFAULTS.siteName} />
//       <meta property="og:type" content={ogType} />
//       <meta property="og:locale" content={locale} />
//       <meta property="og:image" content={image} />
//       {DEFAULTS.fbAppId && (
//         <meta property="fb:app_id" content={DEFAULTS.fbAppId} />
//       )}

//       {/* Twitter
//       <meta name="twitter:card" content="summary_large_image" />
//       <meta name="twitter:creator" content={DEFAULTS.twitterHandle} />
//       <meta name="twitter:site" content={DEFAULTS.twitterHandle} />
//       <meta name="twitter:title" content={socialTitle} />
//       <meta name="twitter:description" content={description} />
//       <meta name="twitter:image" content={image} /> */}

//       {/* Performance / assets */}
//       <link rel="preconnect" href="https://fonts.googleapis.com" />
//       <link
//         rel="preconnect"
//         href="https://fonts.gstatic.com"
//         crossOrigin="true"
//       />
//       <link rel="manifest" href="/site.webmanifest" />
//       <link
//         rel="apple-touch-icon"
//         sizes="180x180"
//         href="/apple-touch-icon.png"
//       />

//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(jsonLdArray),
//         }}
//       />

//       {children}
//     </Head>
//   );
// };

// SEO.propTypes = {
//   pageTitle: PropTypes.string,
//   pageDescription: PropTypes.string,
//   keywords: PropTypes.string,
//   ogImage: PropTypes.string,
//   ogTitle: PropTypes.string,
//   ogUrl: PropTypes.string,
//   ogType: PropTypes.string,
//   locale: PropTypes.string,
//   noindex: PropTypes.bool,
//   structuredData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
//   children: PropTypes.node,
//   titleTemplate: PropTypes.string,
// };

// export default SEO;

import Head from "next/head";
import PropTypes from "prop-types";

/**
 * SEO Component – Final & Google-safe
 * - Personal portfolio (Person + WebSite)
 * - Strong site name signals
 * - Homepage-only WebSite schema
 * - Inner pages supported without SEO loss
 */

const DEFAULTS = {
  siteName: "Pradeep Suthar",
  personName: "Pradeep Suthar",
  siteUrl: "https://pradeep-suthar.vercel.app",
  logo: "https://pradeep-suthar.vercel.app/seo-logo.svg",
  defaultOgImage: "https://pradeep-suthar.vercel.app/seo-logo.svg",
  locale: "en_IN",
  defaultTitle:
    "Product Designer, UI UX Designer & React Developer | Pradeep Suthar",
  defaultDescription:
    "I design and build fast, accessible, and delightful user experiences using React, Next.js and modern design systems. Case studies and frontend projects.",
  defaultKeywords:
    "Front-End Developer, Product Designer, UI UX Designer, React, Next.js, Design Systems, Portfolio",
};

const SEO = ({
  pageTitle,
  pageDescription,
  keywords,
  ogImage,
  ogTitle,
  ogUrl,
  ogType = "website",
  locale = DEFAULTS.locale,
  noindex = false,
  isHome = false, // 🔑 important
  children,
  titleTemplate = "%s | Pradeep Suthar",
}) => {
  const title = pageTitle
    ? titleTemplate.replace("%s", pageTitle)
    : DEFAULTS.defaultTitle;

  const description = pageDescription ?? DEFAULTS.defaultDescription;
  const keywordString = keywords ?? DEFAULTS.defaultKeywords;
  const canonical = ogUrl ?? DEFAULTS.siteUrl;
  const image = ogImage ?? DEFAULTS.defaultOgImage;
  const socialTitle = ogTitle ?? pageTitle ?? DEFAULTS.siteName;

  const sameAs = [
    "https://www.linkedin.com/in/pradeep-suthar-a47432273/",
    "https://github.com/sutharpradip",
  ];

  // ✅ Google-valid structured data (homepage only)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${DEFAULTS.siteUrl}/#person`,
        name: DEFAULTS.personName,
        url: DEFAULTS.siteUrl,
        image: DEFAULTS.logo,
        jobTitle: "Front-End Developer & Product Designer",
        sameAs,
        knowsAbout: [
          "Product Design",
          "UI UX Design",
          "React",
          "Next.js",
          "Frontend Development",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91-7023927315",
          contactType: "customer support",
          areaServed: "IN",
          availableLanguage: ["English"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${DEFAULTS.siteUrl}/#website`,
        url: DEFAULTS.siteUrl,
        name: DEFAULTS.siteName,
        alternateName: "Pradeep Suthar",
        publisher: {
          "@id": `${DEFAULTS.siteUrl}/#person`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${DEFAULTS.siteUrl}/?s={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${DEFAULTS.siteUrl}/#professionalservice`,
        name: "Pradeep Suthar – UI/UX & Frontend Development Services",
        url: DEFAULTS.siteUrl,
        image: DEFAULTS.logo,
        description:
          "UI/UX design, product design, and frontend development services using React and Next.js.",

        provider: {
          "@id": `${DEFAULTS.siteUrl}/#person`,
        },

        telephone: "+91-XXXXXXXXXX",

        priceRange: "₹₹",

        address: {
          "@type": "PostalAddress",
          addressLocality: "Ahmedabad",
          addressRegion: "Gujarat",
          addressCountry: "IN",
        },

        areaServed: {
          "@type": "Country",
          name: "India",
        },

        availableChannel: {
          "@type": "ServiceChannel",
          serviceLocation: {
            "@type": "Place",
            name: "Remote",
          },
        },

        serviceType: [
          "UI Design",
          "UX Design",
          "Product Design",
          "Frontend Development",
          "React Development",
          "Next.js Development",
        ],

        sameAs: [
          "https://www.linkedin.com/in/pradeep-suthar-a47432273/",
          "https://github.com/sutharpradip",
        ],
      },
    ],
  };

  return (
    <Head>
      {/* Core */}
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonical} />
      <link rel="icon" href="/favicon.ico" sizes="any" />

      {/* SEO */}
      <meta name="application-name" content={DEFAULTS.siteName} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordString} />
      <meta name="author" content={DEFAULTS.personName} />
      <meta name="theme-color" content="#0b4b6f" />
      <meta
        name="robots"
        content={
          noindex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large"
        }
      />

      {/* Open Graph */}
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={DEFAULTS.siteName} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content={locale} />
      <meta property="og:image" content={image} />

      {/* Assets */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />

      {/* Structured Data – HOMEPAGE ONLY */}
      {isHome && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      )}

      {children}
    </Head>
  );
};

SEO.propTypes = {
  pageTitle: PropTypes.string,
  pageDescription: PropTypes.string,
  keywords: PropTypes.string,
  ogImage: PropTypes.string,
  ogTitle: PropTypes.string,
  ogUrl: PropTypes.string,
  ogType: PropTypes.string,
  locale: PropTypes.string,
  noindex: PropTypes.bool,
  isHome: PropTypes.bool,
  children: PropTypes.node,
  titleTemplate: PropTypes.string,
};

export default SEO;
