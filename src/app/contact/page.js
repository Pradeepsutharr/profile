import { ContactContent } from "@/components/site/contact-content";
import { JsonLd } from "@/components/site/json-ld";
import { SiteShell } from "@/components/site/site-shell";
import { getSiteContext } from "@/lib/server/site-data";
import {
  breadcrumbJsonLd,
  metadataFromConfig,
  personJsonLd,
  professionalServiceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { profile } = await getSiteContext();
  return metadataFromConfig("contact", { profile });
}

export default async function ContactPage() {
  const { profile, settings } = await getSiteContext();
  return (
    <SiteShell profile={profile} settings={settings}>
      <JsonLd
        data={[
          personJsonLd(profile),
          professionalServiceJsonLd(profile),
          webPageJsonLd({
            name: `Contact ${profile.name}`,
            description: `Hire ${profile.name} for product design and frontend work.`,
            path: "/contact",
            type: "ContactPage",
            profile,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      <ContactContent profile={profile} />
    </SiteShell>
  );
}