"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, BriefcaseBusiness, ChevronRight, GraduationCap, Inbox, Layers3, LogOut, Palette, Settings2, Sparkles, UserRound, Wrench } from "lucide-react";

const links = [["/admin", "Overview", Settings2], ["/admin/projects", "Projects", BriefcaseBusiness], ["/admin/posts", "Posts", BookOpen], ["/admin/services", "Services", Sparkles], ["/admin/skills", "Skills", Wrench], ["/admin/experience", "Experience", Layers3], ["/admin/education", "Education", GraduationCap], ["/admin/contacts", "Inquiries", Inbox], ["/admin/emails", "Inbox", Inbox], ["/admin/profile", "Profile", UserRound], ["/admin/appearance", "Appearance", Palette]];

export function AdminShell({ email, children }) {
  const pathname = usePathname(); const router = useRouter();
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); router.replace("/login"); router.refresh(); }
  return <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[260px_1fr]"><aside className="border-b border-border bg-card/70 p-4 backdrop-blur lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r lg:p-5"><Link href="/admin" className="font-display flex items-center gap-2 text-2xl font-semibold tracking-[-.035em]">PS<span className="text-primary">Control</span></Link><nav className="mt-6 grid grid-cols-2 gap-1 sm:grid-cols-3 lg:block">{links.map(([href, label, Icon]) => { const active = pathname === href; return <Link key={href} href={href} className={`mb-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}><Icon className="h-4 w-4" /><span className="truncate">{label}</span>{active && <ChevronRight className="ml-auto h-4 w-4" />}</Link>; })}</nav><div className="mt-5 flex items-center justify-between border-t pt-4 lg:mt-auto"><span className="max-w-[145px] truncate text-xs text-muted-foreground">{email}</span><button type="button" onClick={logout} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition hover:bg-secondary hover:text-foreground"><LogOut className="h-4 w-4" />Sign out</button></div></aside><main className="mx-auto w-full max-w-7xl p-5 md:p-8">{children}</main></div>;
}
