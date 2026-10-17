"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, BriefcaseBusiness, GraduationCap, Inbox, Layers3, MessageSquareText, Palette, Sparkles, Wrench } from "lucide-react";

const sections = [
  ["projects", "Projects", "Case studies in your portfolio", BriefcaseBusiness], ["posts", "Posts", "Published journal entries", BookOpen],
  ["services", "Services", "Capabilities offered to clients", Sparkles], ["skills", "Skills", "Tools and areas of expertise", Wrench],
  ["experience", "Experience", "Professional roles and impact", Layers3], ["education", "Education", "Academic history", GraduationCap],
  ["contacts", "Inquiries", "Messages from the contact form", MessageSquareText], ["emails", "Inbox", "Synced email conversations", Inbox],
];

async function loadCount(resource) {
  const response = await fetch(`/api/admin/resources/${resource}`);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Could not load overview.");
  return body.data.length;
}

export function AdminOverviewDashboard() {
  const [counts, setCounts] = useState({}); const [error, setError] = useState("");
  useEffect(() => { Promise.all(sections.map(async ([resource]) => [resource, await loadCount(resource)])).then((entries) => setCounts(Object.fromEntries(entries))).catch((issue) => setError(issue.message)); }, []);
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  return <section><header className="mb-8 border-b pb-6"><span className="text-xs font-semibold uppercase tracking-[.16em] text-primary">Admin panel</span><div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-2"><h1 className="font-display text-3xl font-semibold tracking-[-.04em]">Portfolio control room</h1><span className="rounded-full border bg-secondary/50 px-2.5 py-1 text-xs font-semibold text-muted-foreground">{Object.keys(counts).length ? `${total} records` : "Loading records"}</span></div><p className="mt-2 max-w-2xl text-sm text-muted-foreground">A concise view of the live content behind your portfolio. Open any area to manage it without leaving the control panel.</p>{error && <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-500">{error}</p>}</header><div className="overflow-hidden rounded-2xl border bg-card"><div className="hidden grid-cols-[minmax(0,1fr)_110px_34px] gap-4 border-b bg-secondary/20 px-5 py-3 text-[11px] font-semibold uppercase tracking-[.14em] text-muted-foreground] md:grid"><span>Content area</span><span>Records</span><span /></div><div className="divide-y">{sections.map(([resource, title, description, Icon]) => <Link key={resource} href={`/admin/${resource}`} className="group grid grid-cols-[minmax(0,1fr)_34px] items-center gap-4 px-5 py-4 transition hover:bg-secondary/25 md:grid-cols-[minmax(0,1fr)_110px_34px]"><span className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border bg-secondary/35 text-primary"><Icon className="h-4 w-4" /></span><span className="min-w-0"><span className="font-display block font-semibold">{title}</span><span className="mt-0.5 block truncate text-sm text-muted-foreground">{description}</span></span></span><span className="hidden font-display text-lg font-semibold md:block">{counts[resource] ?? <span className="inline-block h-4 w-7 animate-pulse rounded bg-secondary" />}</span><ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" /></Link>)}</div></div><Link href="/admin/appearance" className="mt-5 flex items-center justify-between rounded-2xl border bg-secondary/15 px-5 py-4 transition hover:border-primary/40"><span className="flex items-center gap-3"><Palette className="h-4 w-4 text-primary" /><span><span className="font-semibold">Appearance preview</span><span className="ml-2 text-sm text-muted-foreground">Review light and dark colors on the actual homepage.</span></span></span><ArrowUpRight className="h-4 w-4 text-primary" /></Link></section>;
}
