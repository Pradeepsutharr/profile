import { HomeContent } from "@/components/site/home-content";
import { JsonLd } from "@/components/site/json-ld";
import { NivaLoader } from "@/components/site/niva-loader";
import { SiteShell } from "@/components/site/site-shell";
import { resolveHomeContent } from "@/lib/profile-home";
import { getCollection, getSiteContext } from "@/lib/server/site-data";
import {
  faqJsonLd,
  metadataFromConfig,
  personJsonLd,
  professionalServiceJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { profile } = await getSiteContext();
  return metadataFromConfig("home", {
    profile,
    image: profile.og_image_url || profile.avatar_url,
  });
}

export default async function HomePage() {
  const [{ profile, settings }, projects, services] = await Promise.all([
    getSiteContext(),
    getCollection("projects"),
    getCollection("services"),
  ]);
  const home = resolveHomeContent(profile.home);
  return (
    <SiteShell profile={profile} settings={settings}>
      <JsonLd
        data={[
          personJsonLd(profile),
          websiteJsonLd(profile),
          professionalServiceJsonLd(profile),
          faqJsonLd(home.faqs),
        ]}
      />
      <NivaLoader />
      <HomeContent profile={profile} projects={projects} services={services} />
    </SiteShell>
  );
}
