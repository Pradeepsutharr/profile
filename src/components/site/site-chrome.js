"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { colorVariables, SITE_NAV } from "@/lib/theme-colors";

function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle theme"
      className="liquid relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-primary transition hover:scale-105 hover:shadow-glow"
    >
      <span className="transition-transform duration-200">
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </span>
    </button>
  );
}

function HeaderNav({ currentPath }) {
  return (
    <nav
      className="nav-glass hidden items-center gap-1 rounded-full p-1 md:flex"
      aria-label="Main navigation"
    >
      {SITE_NAV.map((item) => {
        const active =
          item.href === "/"
            ? currentPath === "/"
            : currentPath.startsWith(item.href);
        return (
          <Link
            href={item.href}
            key={item.href}
            prefetch={false}
            className={`relative rounded-full px-4 py-2 text-sm transition ${active ? "bg-gradient-accent shadow-glow text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <span className="relative font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      className="mobile-navbar select-none md:hidden"
      aria-label="Mobile navigation"
    >
      <ul className="grid grid-cols-5 gap-1 px-2 py-2">
        {SITE_NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="min-w-0">
              <Link
                href={item.href}
                prefetch={false}
                className={`flex min-h-11 items-center justify-center rounded-full px-1 py-2 text-[11px] font-semibold capitalize transition-all duration-300 ${
                  active
                    ? "border border-primary/15 bg-primary/10 text-primary"
                    : "border border-transparent text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SiteHeader({ settings }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState("dark");
  const [previewColors, setPreviewColors] = useState(null);
  const current = useMemo(
    () =>
      SITE_NAV.find((item) =>
        item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
      ) || SITE_NAV[0],
    [pathname],
  );

  useEffect(() => {
    const preferred =
      window.localStorage.getItem("portfolio-theme") ||
      document.documentElement.dataset.theme ||
      "dark";
    setTheme((currentTheme) =>
      currentTheme === preferred ? currentTheme : preferred,
    );
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const root = document.getElementById("site-shell");
    if (!root) return;
    const vars = colorVariables(previewColors || settings?.colors, theme);
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme, previewColors, settings?.colors]);

  useEffect(() => {
    function receivePreview(event) {
      if (
        event.origin !== window.location.origin ||
        event.data?.type !== "portfolio-home-preview"
      )
        return;
      if (event.data.colors && typeof event.data.colors === "object")
        setPreviewColors(event.data.colors);
      if (["light", "dark"].includes(event.data.theme))
        setTheme(event.data.theme);
    }
    window.addEventListener("message", receivePreview);
    if (new URLSearchParams(window.location.search).has("adminPreview")) {
      window.parent.postMessage(
        { type: "portfolio-home-preview-ready" },
        window.location.origin,
      );
    }
    return () => window.removeEventListener("message", receivePreview);
  }, []);

  function toggleTheme() {
    setTheme((currentTheme) => {
      const next = currentTheme === "dark" ? "light" : "dark";
      window.localStorage.setItem("portfolio-theme", next);
      return next;
    });
  }

  return (
    <header className="flex items-center justify-between gap-4 border-b p-5 md:px-8">
      <div className="flex items-center gap-3">
        <span className="bg-gradient-accent h-6 w-1 rounded-full" />
        <p className="font-display text-2xl font-semibold tracking-[-0.025em] md:text-3xl">
          {current.label}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <HeaderNav currentPath={pathname} />
        <ThemeToggle dark={theme === "dark"} onToggle={toggleTheme} />
      </div>
    </header>
  );
}
