import { HomeContent } from "@/components/site/home-content";
import { SiteShell } from "@/components/site/site-shell";
import { getCollection, getSiteContext } from "@/lib/server/site-data";
import Script from "next/script";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ profile, settings }, projects, services] = await Promise.all([
    getSiteContext(),
    getCollection("projects"),
    getCollection("services"),
  ]);
  return (
    <SiteShell profile={profile} settings={settings}>
      <Script
        src="https://app.getniva.ai/pradeep-suthar/widget.js"
        data-bot-key="pk_live_05bdd5b34731a5e7d88611bc5c456b8d"
        strategy="afterInteractive"
      />
      <HomeContent profile={profile} projects={projects} services={services} />
    </SiteShell>
  );
}
