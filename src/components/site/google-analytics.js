"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const SCRIPT_SRC = GA_ID
  ? `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  : null;

function pageview(url) {
  if (!GA_ID || typeof window.gtag !== "function") return;
  window.gtag("config", GA_ID, { page_path: url });
}

function ensureGa() {
  if (!GA_ID || !SCRIPT_SRC) return;
  if (typeof window.gtag === "function") return;
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);

  const script = document.createElement("script");
  script.src = SCRIPT_SRC;
  script.async = true;
  document.head.appendChild(script);
}

function AnalyticsRouteListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID) return;
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) return;
    if (typeof window.gtag !== "function") return;
    const query = searchParams?.toString();
    pageview(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  return null;
}

/**
 * Load GA only after a real user gesture so PSI/Lighthouse
 * do not pay for ~180KB of Tag Manager on first paint.
 */
export function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_ID) return undefined;

    function load() {
      ensureGa();
      cleanup();
    }

    function cleanup() {
      window.removeEventListener("pointerdown", load);
      window.removeEventListener("keydown", load);
      window.removeEventListener("touchstart", load);
    }

    window.addEventListener("pointerdown", load, { once: true, passive: true });
    window.addEventListener("keydown", load, { once: true });
    window.addEventListener("touchstart", load, { once: true, passive: true });

    return cleanup;
  }, []);

  if (!GA_ID) return null;

  return (
    <Suspense fallback={null}>
      <AnalyticsRouteListener />
    </Suspense>
  );
}
