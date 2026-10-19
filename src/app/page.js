import { HomeContent } from "@/components/site/home-content";
import { HomeHero } from "@/components/site/home-hero";
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

export const revalidate = 60;

export async function generateMetadata() {
  const { profile } = await getSiteContext();
  return metadataFromConfig("home", {
    profile,
    image: profile.og_image_url || profile.avatar_url,
  });
}

export default async function HomePage() {
  const [{ profile, settings }, services, testimonials] = await Promise.all([
    getSiteContext(),
    getCollection("services"),
    getCollection("testimonials"),
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
      <HomeHero profile={profile} home={home} />
      <HomeContent
        profile={profile}
        services={services}
        testimonials={testimonials}
      />
    </SiteShell>
  );
}
