import { ServicesContent } from "@/components/site/services-content";
import { SiteShell } from "@/components/site/site-shell";
import { getCollection, getSiteContext } from "@/lib/server/site-data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Services" };
export default async function ServicesPage() { const [{ profile, settings }, services] = await Promise.all([getSiteContext(), getCollection("services")]); return <SiteShell profile={profile} settings={settings}><ServicesContent services={services} /></SiteShell>; }
