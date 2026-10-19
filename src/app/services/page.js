import { CtaBanner } from "@/components/site/cta-banner";
import { JsonLd } from "@/components/site/json-ld";
import { ServicesContent } from "@/components/site/services-content";
import { SiteShell } from "@/components/site/site-shell";
import { getCollection, getSiteContext } from "@/lib/server/site-data";
import {
  breadcrumbJsonLd,
  collectionPageJsonLd,
  metadataFromConfig,
} from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  const { profile } = await getSiteContext();
  return metadataFromConfig("services", { profile });
}

export default async function ServicesPage() {
  const [{ profile, settings }, services] = await Promise.all([
    getSiteContext(),
    getCollection("services"),
  ]);
  return (
    <SiteShell profile={profile} settings={settings}>
      <JsonLd
        data={[
          collectionPageJsonLd({
            name: "Services",
            description: `Capabilities offered by ${profile.name}`,
            path: "/services",
            profile,
            items: services.map((service) => ({
              title: service.title,
              path: `/services/${service.slug}`,
            })),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
        ]}
      />
      <ServicesContent services={services} />
      <CtaBanner
        title="Ready to start?"
        description="Tell me what you’re building and I’ll recommend the right engagement."
      />
    </SiteShell>
  );
}
