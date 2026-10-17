"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, BriefcaseBusiness, ChevronRight, GraduationCap, Inbox, Layers3, LogOut, Palette, Settings2, Sparkles, UserRound, Wrench } from "lucide-react";

const links = [
  ["/admin", "Overview", Settings2], ["/admin/projects", "Projects", BriefcaseBusiness], ["/admin/posts", "Posts", BookOpen], ["/admin/services", "Services", Sparkles], ["/admin/skills", "Skills", Wrench], ["/admin/experience", "Experience", Layers3], ["/admin/education", "Education", GraduationCap], ["/admin/contacts", "Inquiries", Inbox], ["/admin/emails", "Inbox", Inbox], ["/admin/profile", "Profile", UserRound], ["/admin/appearance", "Appearance", Palette],
];

export function AdminShell({ email, children }) {
  const pathname = usePathname(); const router = useRouter();
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); router.replace("/login"); router.refresh(); }
  return <div className="admin-app"><aside className="admin-sidebar"><Link href="/admin" className="admin-brand">PS<span>Control</span></Link><nav>{links.map(([href, label, Icon]) => <Link href={href} className={pathname === href ? "active" : ""} key={href}><Icon size={16} /><span>{label}</span>{pathname === href && <ChevronRight size={14} />}</Link>)}</nav><div className="admin-user"><span>{email}</span><button onClick={logout}><LogOut size={15} /> Sign out</button></div></aside><main className="admin-main">{children}</main></div>;
}
