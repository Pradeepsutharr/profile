import "./globals.css";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@/components/site/google-analytics";
import { fallbackProfile } from "@/lib/content";
import {
  defaultKeywords,
  defaultSiteDescription,
  defaultSiteTitle,
  getSiteUrl,
} from "@/lib/seo";

const dmSans = DM_Sans({
  subsets: ["latin"],
  // optional: avoid LCP text waiting on webfont (PSI mobile render-delay).
  display: "optional",
  variable: "--font-dm-sans",
  weight: ["400", "600", "700"],
  // Don't preload: frees bandwidth for the LCP portrait under slow-4G PSI.
  preload: false,
  adjustFontFallback: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const profile = fallbackProfile;
const description = defaultSiteDescription(profile);
const titleDefault = defaultSiteTitle(profile);
const siteUrl = getSiteUrl();
const ogImage =
  profile.og_image_url || profile.avatar_url || "/images/portrait.webp";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: titleDefault,
    template: `%s - ${profile.name}`,
  },
  description,
  keywords: defaultKeywords(profile),
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  publisher: profile.name,
  category: "portfolio",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: "/",
    types: {
      "text/plain": [
        { url: "/llms.txt", title: "llms.txt" },
        { url: "/llms-full.txt", title: "llms-full.txt" },
      ],
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: `${profile.name} Portfolio`,
    title: titleDefault,
    description,
    images: [{ url: ogImage, width: 1200, height: 630, alt: titleDefault }],
  },
  twitter: {
    card: "summary_large_image",
    title: titleDefault,
    description,
    images: [ogImage],
  },
  robots: {
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  // Manifest is useful for installability but competes on the critical path in PSI.
  // Keep the file in /public; link it from the document after first paint via chrome if needed.
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0e" },
    { media: "(prefers-color-scheme: light)", color: "#ecf0f8" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" className={dmSans.variable} suppressHydrationWarning>
      <body className={dmSans.className}>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem("portfolio-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;}catch(e){}})();`}
        </Script>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
