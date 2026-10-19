"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Ellipsis,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Moon,
  Phone,
  Sun,
  Twitter,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const nav = [
  { href: "/", label: "About" },
  { href: "/resume", label: "Resume" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact" },
];

const ease = [0.16, 1, 0.3, 1];

function colorVariables(colors = {}, theme = "dark") {
  const tone = theme === "dark" ? "dark" : "light";
  const values = Object.fromEntries(
    Object.entries(colors).map(([name, value]) => [
      `--${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
      value,
    ]),
  );
  return {
    ...values,
    "--shell": `var(--${tone}-shell)`,
    "--background": `var(--${tone}-background)`,
    "--foreground": `var(--${tone}-text)`,
    "--card": `var(--${tone}-surface)`,
    "--card-foreground": `var(--${tone}-text)`,
    "--secondary": `var(--${tone}-panel)`,
    "--secondary-foreground": `var(--${tone}-text)`,
    "--muted": `var(--${tone}-panel)`,
    "--muted-foreground": `var(--${tone}-muted)`,
    "--primary": `var(--${tone}-primary)`,
    "--primary-foreground": theme === "dark" ? "var(--dark-shell)" : "#ffffff",
    "--border": `var(--${tone}-border)`,
    "--input": `var(--${tone}-border)`,
    "--ring": `var(--${tone}-primary)`,
    "--glow": "var(--gradient-start)",
    "--gradient-accent": "linear-gradient(120deg, var(--gradient-start), var(--gradient-end))",
    "--glass-fill":
      theme === "dark"
        ? "color-mix(in srgb, #ffffff 5%, transparent)"
        : "color-mix(in srgb, #ffffff 18%, transparent)",
    "--glass-fill-soft":
      theme === "dark"
        ? "color-mix(in srgb, #ffffff 2.5%, transparent)"
        : "color-mix(in srgb, #ffffff 10%, transparent)",
    "--glass-tint":
      theme === "dark"
        ? "color-mix(in srgb, #16161c 58%, transparent)"
        : `color-mix(in srgb, var(--${tone}-surface) 55%, transparent)`,
    "--glass-hi":
      theme === "dark"
        ? "color-mix(in srgb, #ffffff 9%, transparent)"
        : "color-mix(in srgb, #ffffff 28%, transparent)",
    "--glass-lo":
      theme === "dark"
        ? "color-mix(in srgb, #ffffff 1.5%, transparent)"
        : "color-mix(in srgb, #ffffff 6%, transparent)",
    "--glass-edge":
      theme === "dark"
        ? "color-mix(in srgb, #ffffff 7%, transparent)"
        : "color-mix(in srgb, #ffffff 16%, transparent)",
    "--glass-edge-dim":
      theme === "dark"
        ? "color-mix(in srgb, #000000 22%, transparent)"
        : `color-mix(in srgb, var(--${tone}-text) 4%, transparent)`,
    "--glass-shine":
      theme === "dark"
        ? "color-mix(in srgb, #ffffff 12%, transparent)"
        : "color-mix(in srgb, #ffffff 28%, transparent)",
    "--glass-specular":
      theme === "dark"
        ? "color-mix(in srgb, #ffffff 14%, transparent)"
        : "color-mix(in srgb, #ffffff 22%, transparent)",
    "--glass-shadow":
      theme === "dark"
        ? "0 22px 60px -24px rgb(0 0 0 / 55%)"
        : "0 18px 50px -22px rgb(36 29 22 / 18%)",
  };
}
// theme toggle button
function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle theme"
      className="liquid relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-primary transition hover:scale-105 hover:shadow-glow"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "dark" : "light"}
          initial={{ y: 20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

// social icons
function SocialIcon({ type }) {
  const Icon =
    type === "github"
      ? Github
      : type === "linkedin"
        ? Linkedin
        : type === "twitter"
          ? Twitter
          : Instagram;
  return <Icon className="h-4 w-4" />;
}

// sidebar panel
function ProfileCard({ profile }) {
  const [open, setOpen] = useState(false);
  const info = [
    [Mail, "Email", profile.email, `mailto:${profile.email}`],
    [
      Phone,
      "Phone",
      profile.phone,
      `tel:${String(profile.phone || "").replace(/\s/g, "")}`,
    ],
    [MapPin, "Location", profile.location, null],
  ];
  const socials = [
    ["github", profile.socials?.github],
    ["linkedin", profile.socials?.linkedin],
    ["instagram", profile.socials?.instagram],
    ["twitter", profile.socials?.twitter || profile.socials?.x],
  ].filter(([, href]) => href && href !== "#");
  const title = profile.title || "Product Designer";
  return (
    <aside
      className={`panel relative z-10 w-full self-stretch overflow-hidden rounded-4xl p-4 transition-all duration-700 ease-in-out lg:sticky lg:top-6 lg:flex lg:h-fit lg:min-h-[calc(100dvh-3rem)] lg:w-[300px] lg:shrink-0 lg:flex-col lg:self-start lg:p-6 ${
        open ? "max-h-[900px]" : "max-h-[112px]"
      } lg:max-h-none`}
    >
      <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-foreground/4 blur-3xl" />
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="liquid absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-xl text-primary lg:hidden"
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        aria-expanded={open}
      >
        {open ? <X className="h-4 w-4" /> : <Ellipsis className="h-4 w-4" />}
      </button>
      <div className="relative flex items-center gap-4 lg:flex-col lg:text-center">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center lg:h-32 lg:w-32">
          <div className="spin-slow absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--border),transparent_45%,color-mix(in_srgb,var(--primary)_45%,transparent),transparent_80%,var(--border))] p-[2px]">
            <div className="h-full w-full rounded-full bg-card" />
          </div>
          <Image
            src={profile.avatar_url || "/images/logo.png"}
            alt={`${profile.name} logo`}
            width={256}
            height={256}
            priority
            className="relative h-[84%] w-[84%] rounded-full object-contain"
          />
        </div>
        <div className="min-w-0 pr-10 lg:mt-5 lg:pr-0">
          <p className="font-display truncate text-lg font-semibold tracking-[-0.025em] lg:text-2xl">
            {profile.name}
          </p>
          <span className="mt-2 inline-flex max-w-full items-center gap-1.5 truncate rounded-full border bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span className="truncate">{title}</span>
          </span>
        </div>
      </div>
      <div className="relative my-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <ul className="relative space-y-3">
        {info.map(
          ([Icon, label, value, href]) =>
            value && (
              <li key={label}>
                {href ? (
                  <a
                    href={href}
                    className="group flex items-center gap-3 rounded-2xl p-2 transition hover:bg-secondary/50"
                  >
                    <span className="liquid flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition group-hover:border-primary/40 group-hover:text-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] uppercase tracking-widest text-muted-foreground">
                        {label}
                      </span>
                      <span className="block truncate text-sm font-medium">
                        {value}
                      </span>
                    </span>
                  </a>
                ) : (
                  <div className="group flex items-center gap-3 p-2">
                    <span className="liquid flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] uppercase tracking-widest text-muted-foreground">
                        {label}
                      </span>
                      <span className="block truncate text-sm font-medium">
                        {value}
                      </span>
                    </span>
                  </div>
                )}
              </li>
            ),
        )}
      </ul>
      {socials.length > 0 && (
        <div className="relative mt-6 flex gap-2 lg:mt-auto">
          {socials.map(([type, href]) => (
            <a
              key={type}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={type}
              className="liquid flex h-10 flex-1 items-center justify-center rounded-xl text-muted-foreground transition hover:-translate-y-0.5 hover:border-foreground/25 hover:text-foreground"
            >
              <SocialIcon type={type} />
            </a>
          ))}
        </div>
      )}
      <Link
        href="/contact"
        className="bg-gradient-accent shadow-soft relative mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5"
      >
        Start a project <ArrowUpRight className="h-4 w-4" />
      </Link>
    </aside>
  );
}

function HeaderNav({ currentPath }) {
  return (
    <nav
      className="nav-glass hidden items-center gap-1 rounded-full p-1 md:flex"
      aria-label="Main navigation"
    >
      {nav.map((item) => {
        const active =
          item.href === "/"
            ? currentPath === "/"
            : currentPath.startsWith(item.href);
        return (
          <Link
            href={item.href}
            key={item.href}
            className={`relative rounded-full px-4 py-2 text-sm transition ${active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {active && (
              <motion.span
                layoutId="nav-pill"
                className="bg-gradient-accent shadow-glow absolute inset-0 rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNav({ currentPath }) {
  return (
    <nav
      className="mobile-navbar select-none md:hidden"
      aria-label="Mobile navigation"
    >
      <ul className="grid grid-cols-5 gap-1 px-2 py-2">
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? currentPath === "/"
              : currentPath.startsWith(item.href);
          return (
            <li key={item.href} className="min-w-0">
              <Link
                href={item.href}
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

export function SiteShell({ profile, settings, children }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState("dark");
  const [previewColors, setPreviewColors] = useState(null);
  const current = useMemo(
    () =>
      nav.find((item) =>
        item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
      ) || nav[0],
    [pathname],
  );
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const preferred =
        window.localStorage.getItem("portfolio-theme") || "dark";
      setTheme(preferred);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
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
    <div
      style={colorVariables(previewColors || settings?.colors, theme)}
      className="relative min-h-screen bg-[var(--shell)]"
    >
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground opacity-0 transition focus:translate-y-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>
      <div className="aurora pointer-events-none fixed inset-0 -z-10" />
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, 120, -40, 0], y: [0, 80, 160, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-20 top-10 h-[420px] w-[420px] rounded-full bg-primary/2 blur-[110px]"
        />
        <motion.div
          animate={{ x: [0, -140, 60, 0], y: [0, 120, -60, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 top-1/3 h-[380px] w-[380px] rounded-full bg-foreground/[0.03] blur-[110px]"
        />
        <motion.div
          animate={{ x: [0, 100, -80, 0], y: [0, -100, 40, 0] }}
          transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-foreground/[0.03] blur-[100px]"
        />
      </div>
      <div className="dots pointer-events-none fixed inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="mx-auto flex flex-col gap-6 px-4 pb-24 pt-4 md:px-6 md:pt-6 lg:flex-row lg:items-start lg:pb-10">
        <ProfileCard profile={profile} />
        <div className="panel relative min-w-0 flex-1 overflow-hidden rounded-[2rem]">
          <header className="flex items-center justify-between gap-4 border-b p-5 md:px-8">
            <div className="flex items-center gap-3">
              <span className="bg-gradient-accent h-6 w-1 rounded-full" />
              <AnimatePresence mode="wait">
                <motion.p
                  key={current.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease }}
                  className="font-display text-2xl font-semibold tracking-[-0.025em] md:text-3xl"
                >
                  {current.label}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-2">
              <HeaderNav currentPath={pathname} />
              <ThemeToggle dark={theme === "dark"} onToggle={toggleTheme} />
            </div>
          </header>
          <motion.main
            id="main-content"
            key={pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="p-5 md:p-8"
            tabIndex={-1}
          >
            {children}
          </motion.main>
          <footer className="flex flex-col justify-between gap-2 border-t px-5 py-5 text-xs text-muted-foreground md:flex-row md:px-8">
            <span>© 2026 {profile.name}. Crafted with care in Ahmedabad.</span>
            <a href={`mailto:${profile.email}`} className="hover:text-primary">
              {profile.email}
            </a>
          </footer>
        </div>
      </div>
      <MobileNav currentPath={pathname} />
    </div>
  );
}
