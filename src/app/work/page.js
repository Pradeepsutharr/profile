import { SiteShell } from "@/components/site/site-shell";
import { WorkContent } from "@/components/site/work-content";
import { getCollection, getSiteContext } from "@/lib/server/site-data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Portfolio" };
export default async function WorkPage() { const [{ profile, settings }, projects] = await Promise.all([getSiteContext(), getCollection("projects")]); return <SiteShell profile={profile} settings={settings}><WorkContent projects={projects} /></SiteShell>; }
