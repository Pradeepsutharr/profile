import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/site/services-content";
import { SiteShell } from "@/components/site/site-shell";
import { getBySlug, getSiteContext } from "@/lib/server/site-data";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }) { const { slug } = await params; const service = await getBySlug("services", slug); return { title: service ? service.title : "Service" }; }
export default async function ServicePage({ params }) { const { slug } = await params; const [{ profile, settings }, service] = await Promise.all([getSiteContext(), getBySlug("services", slug)]); if (!service) notFound(); return <SiteShell profile={profile} settings={settings}><ServiceDetail service={service} /></SiteShell>; }
