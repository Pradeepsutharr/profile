import { HomeContent } from "@/components/site/home-content";
import { SiteShell } from "@/components/site/site-shell";
import { getCollection, getSiteContext } from "@/lib/server/site-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ profile, settings }, projects, services] = await Promise.all([getSiteContext(), getCollection("projects"), getCollection("services")]);
  return <SiteShell profile={profile} settings={settings}><HomeContent profile={profile} projects={projects} services={services} /></SiteShell>;
}
