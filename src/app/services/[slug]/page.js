import { notFound } from "next/navigation";
import { CtaBanner } from "@/components/site/cta-banner";
import { JsonLd } from "@/components/site/json-ld";
import { ServiceDetail } from "@/components/site/services-content";
import { SiteShell } from "@/components/site/site-shell";
import { getBySlug, getSiteContext } from "@/lib/server/site-data";
import {
  breadcrumbJsonLd,
  metadataFromConfig,
  serviceJsonLd,
} from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const [{ profile }, service] = await Promise.all([
    getSiteContext(),
    getBySlug("services", slug),
  ]);
  if (!service) return metadataFromConfig("services", { profile });
  return metadataFromConfig("serviceDetail", {
    profile,
    name: service.title,
    title: service.seo_title,
    description: service.seo_description || service.description,
    keywords: service.keywords || service.tags,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const [{ profile, settings }, service] = await Promise.all([
    getSiteContext(),
    getBySlug("services", slug),
  ]);
  if (!service) notFound();
  return (
    <SiteShell profile={profile} settings={settings}>
      <JsonLd
        data={[
          serviceJsonLd(service, profile),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
        ]}
      />
      <ServiceDetail service={service} />
      <CtaBanner
        title={`Need ${service.title.toLowerCase()}?`}
        description="Share your goals and timeline - I’ll reply with a clear next step within 12-24 hours."
        label="Book a discovery call"
      />
    </SiteShell>
  );
}