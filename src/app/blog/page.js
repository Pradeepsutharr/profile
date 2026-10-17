import { BlogContent } from "@/components/site/blog-content";
import { SiteShell } from "@/components/site/site-shell";
import { getCollection, getSiteContext } from "@/lib/server/site-data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Journal" };
export default async function BlogPage() { const [{ profile, settings }, posts] = await Promise.all([getSiteContext(), getCollection("posts")]); return <SiteShell profile={profile} settings={settings}><BlogContent posts={posts} /></SiteShell>; }
