import Head from "next/head";
import PropTypes from "prop-types";

/**
 * SEO component for personal portfolio (Pradeep)
 * - Defaults tuned for a Front-End Developer & Product Designer
 * - Accepts page-level overrides for title/description/og/twitter/schema
 * - Renders Person + WebSite JSON-LD by default and merges page structuredData if provided
 */

const DEFAULTS = {
  siteName: "Pradeep",
  // replace with your real domain, e.g. "https://pradeep.dev"
  siteUrl: "https://pradeep.dev",
  // absolute URL to your logo (used for structured data / OG)
  logo: "https://pradeep.dev/images/seo-logo.png",
  // absolute URL to your default OG image
  defaultOgImage: "https://pradeep.dev/images/og-image.png",
  // update with your twitter handle if available (include @)
  twitterHandle: "@pradeep_dev",
  locale: "en_IN",
  fbAppId: "", // optional
  defaultTitle: "Pradeep | Front-End Developer & Product Designer",
  defaultDescription:
    "I design and build fast, accessible, and delightful user experiences using React, Next.js and modern design systems. Case studies and frontend projects.",
  defaultKeywords:
    "Front-End Developer, Product Designer, React, Next.js, UI UX, Design Systems, Frontend Portfolio, Pradeep",
};

// Person schema (for personal portfolio)
const buildPersonSchema = ({ siteUrl, siteName, logo, sameAs = [] }) => ({
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: siteName,
  url: siteUrl,
  image: logo,
  sameAs,
  jobTitle: "Front-End Developer & Product Designer",
});

// Website schema
const buildWebsiteSchema = ({ siteUrl, siteName }) => ({
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: siteName,
  publisher: { "@id": `${siteUrl}/#person` },
});

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
  structuredData = null, // page-specific JSON-LD object or array
  children,
  titleTemplate = "%s | Pradeep",
}) => {
  // Title handling
  const title = pageTitle
    ? titleTemplate.replace("%s", pageTitle)
    : DEFAULTS.defaultTitle;
  const description = pageDescription ?? DEFAULTS.defaultDescription;
  const keywordString = keywords ?? DEFAULTS.defaultKeywords;
  const canonical = ogUrl ?? DEFAULTS.siteUrl;
  const image = ogImage ?? DEFAULTS.defaultOgImage;
  const socialTitle = ogTitle ?? pageTitle ?? DEFAULTS.siteName;

  // default social profiles — replace these with your actual profiles
  const defaultSameAs = [
    "https://twitter.com/pradeep_dev",
    "https://www.linkedin.com/in/pradeep",
    "https://github.com/pradeep",
  ];

  // Core structured data (Person + WebSite)
  const personSchema = buildPersonSchema({
    siteUrl: DEFAULTS.siteUrl,
    siteName: DEFAULTS.siteName,
    logo: DEFAULTS.logo,
    sameAs: defaultSameAs,
  });

  const websiteSchema = buildWebsiteSchema({
    siteUrl: DEFAULTS.siteUrl,
    siteName: DEFAULTS.siteName,
  });

  // Merge default schema with page-level structuredData if given
  const jsonLdArray = [
    { "@context": "https://schema.org" },
    personSchema,
    websiteSchema,
  ];

  if (structuredData) {
    if (Array.isArray(structuredData)) {
      jsonLdArray.push(...structuredData);
    } else {
      jsonLdArray.push(structuredData);
    }
  }

  return (
    <Head>
      {/* Core */}
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" type="image/png" href="/favicon.ico" sizes="any" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="canonical" href={canonical} />

      {/* SEO */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordString} />
      <meta name="author" content={DEFAULTS.siteName} />
      <meta
        name="copyright"
        content={`${DEFAULTS.siteName} © ${new Date().getFullYear()}`}
      />
      <meta name="theme-color" content="#0b4b6f" />
      <meta name="distribution" content="Global" />
      <meta name="owner" content={new URL(DEFAULTS.siteUrl).hostname} />
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
      {DEFAULTS.fbAppId && (
        <meta property="fb:app_id" content={DEFAULTS.fbAppId} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={DEFAULTS.twitterHandle} />
      <meta name="twitter:site" content={DEFAULTS.twitterHandle} />
      <meta name="twitter:title" content={socialTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Performance / assets */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="icon" type="image/png" href="/favicon-16.png" />
      <link rel="icon" type="image/png" href="/favicon-32.png" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdArray),
        }}
      />

      {/* allow insertion of page-specific head tags */}
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
  structuredData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  titleTemplate: PropTypes.string,
};

export default SEO;
