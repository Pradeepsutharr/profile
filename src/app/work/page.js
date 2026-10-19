import { CtaBanner } from "@/components/site/cta-banner";
import { JsonLd } from "@/components/site/json-ld";
import { SiteShell } from "@/components/site/site-shell";
import { WorkContent } from "@/components/site/work-content";
import { getCollection, getSiteContext } from "@/lib/server/site-data";
import {
  breadcrumbJsonLd,
  collectionPageJsonLd,
  metadataFromConfig,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { profile } = await getSiteContext();
  return metadataFromConfig("work", { profile });
}

export default async function WorkPage() {
  const [{ profile, settings }, projects] = await Promise.all([
    getSiteContext(),
    getCollection("projects"),
  ]);
  return (
    <SiteShell profile={profile} settings={settings}>
      <JsonLd
        data={[
          collectionPageJsonLd({
            name: "Portfolio",
            description: `Projects by ${profile.name}`,
            path: "/work",
            profile,
            items: projects.map((project) => ({
              title: project.title,
              path: `/work/${project.slug}`,
            })),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Portfolio", path: "/work" },
          ]),
        ]}
      />
      <WorkContent projects={projects} />
      <CtaBanner
        title="Want results like these for your product?"
        description="Share your brief and I’ll map a clear design-to-build plan."
      />
    </SiteShell>
  );
}
