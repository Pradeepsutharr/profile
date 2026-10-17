import Link from "next/link";
import { ArrowUpRight, BookOpen, BriefcaseBusiness, Inbox, Sparkles } from "lucide-react";

const links = [["/admin/projects", "Projects", "Create and publish case studies", BriefcaseBusiness], ["/admin/posts", "Posts", "Write and publish journal entries", BookOpen], ["/admin/services", "Services", "Keep capabilities current", Sparkles], ["/admin/contacts", "Inquiries", "Read new portfolio messages", Inbox]];
export default function AdminOverview() { return <section><div className="admin-page-head"><div><span>Admin panel</span><h1>Good to see you.</h1><p>Manage your portfolio content, appearance, and customer conversations from one place.</p></div></div><div className="admin-overview-grid">{links.map(([href, title, description, Icon]) => <Link href={href} className="overview-card liquid" key={href}><Icon size={22} /><h2>{title}</h2><p>{description}</p><span>Open <ArrowUpRight size={15} /></span></Link>)}</div></section>; }
