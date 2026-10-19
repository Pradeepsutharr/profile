"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Ellipsis,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  X,
} from "lucide-react";
import { useState } from "react";

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

export function ProfileCard({ profile }) {
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
            sizes="(max-width: 1024px) 80px, 128px"
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
