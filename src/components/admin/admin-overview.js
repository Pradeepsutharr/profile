"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, BriefcaseBusiness, GraduationCap, Inbox, Layers3, MessageSquareText, Sparkles, Wrench } from "lucide-react";

const links = [
  ["projects", "Projects", "Create and publish case studies", BriefcaseBusiness],
  ["posts", "Posts", "Write and publish journal entries", BookOpen],
  ["services", "Services", "Keep capabilities current", Sparkles],
  ["skills", "Skills", "Show your areas of expertise", Wrench],
  ["experience", "Experience", "Maintain your professional history", Layers3],
  ["education", "Education", "Keep your academic record current", GraduationCap],
  ["contacts", "Inquiries", "Read messages from your contact form", MessageSquareText],
  ["emails", "Inbox", "Review synced email conversations", Inbox],
];

async function count(resource) {
  const response = await fetch(`/api/admin/resources/${resource}`);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Could not load overview counts.");
  return body.data.length;
}

export function AdminOverviewDashboard() {
  const [counts, setCounts] = useState({}); const [error, setError] = useState("");
  useEffect(() => { Promise.all(links.map(async ([resource]) => [resource, await count(resource)])).then((entries) => setCounts(Object.fromEntries(entries))).catch((issue) => setError(issue.message)); }, []);
  return <section><div className="mb-8"><span className="text-xs font-semibold uppercase tracking-[.16em] text-primary">Admin panel</span><h1 className="font-display mt-1 text-3xl font-semibold tracking-[-.035em]">Good to see you.</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Manage your portfolio content, appearance, and customer conversations from one place.</p>{error && <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-500">{error}</p>}</div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{links.map(([resource, title, description, Icon]) => <Link href={`/admin/${resource}`} className="liquid group relative flex min-h-52 flex-col overflow-hidden rounded-2xl p-5 transition hover:-translate-y-1 hover:border-primary/40" key={resource}><span className="absolute right-4 top-4 rounded-full border bg-background/60 px-2.5 py-1 text-xs font-semibold text-muted-foreground backdrop-blur">{counts[resource] === undefined ? <span className="inline-block h-3 w-5 animate-pulse rounded bg-secondary" /> : `${counts[resource]} ${counts[resource] === 1 ? "item" : "items"}`}</span><Icon className="h-6 w-6 text-primary" /><h2 className="font-display mt-6 text-xl font-semibold">{title}</h2><p className="mt-2 flex-1 max-w-[22ch] text-sm leading-relaxed text-muted-foreground">{description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">Open <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45 group-hover:text-primary" /></span></Link>)}</div></section>;
}
