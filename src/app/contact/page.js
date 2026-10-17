import { ContactContent } from "@/components/site/contact-content";
import { SiteShell } from "@/components/site/site-shell";
import { getSiteContext } from "@/lib/server/site-data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact" };
export default async function ContactPage() { const { profile, settings } = await getSiteContext(); return <SiteShell profile={profile} settings={settings}><ContactContent profile={profile} /></SiteShell>; }
