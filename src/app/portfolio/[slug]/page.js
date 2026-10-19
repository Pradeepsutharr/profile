import { notFound } from "next/navigation";
import { CtaBanner } from "@/components/site/cta-banner";
import { JsonLd } from "@/components/site/json-ld";
import { SiteShell } from "@/components/site/site-shell";
import { WorkDetail } from "@/components/site/work-detail";
import { getBySlug, getCollection, getSiteContext } from "@/lib/server/site-data";
import {
  breadcrumbJsonLd,
  metadataFromConfig,
  projectJsonLd,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const [{ profile }, project] = await Promise.all([
    getSiteContext(),
    getBySlug("projects", slug),
  ]);
  if (!project) return metadataFromConfig("work", { profile });
  return metadataFromConfig("workDetail", {
    profile,
    name: project.title,
    title: project.seo_title,
    description: project.seo_description || project.excerpt || project.description,
    keywords: project.keywords || project.tags,
    path: `/portfolio/${project.slug}`,
    image: project.image_url,
  });
}

export default async function WorkDetailPage({ params }) {
  const { slug } = await params;
  const [{ profile, settings }, projects, project] = await Promise.all([
    getSiteContext(),
    getCollection("projects"),
    getBySlug("projects", slug),
  ]);
  if (!project) notFound();
  const index = projects.findIndex((item) => item.slug === slug);
  const nextProject = projects[(index + 1) % projects.length];
  return (
    <SiteShell profile={profile} settings={settings}>
      <JsonLd
        data={[
          projectJsonLd(project, profile),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Portfolio", path: "/portfolio" },
            { name: project.title, path: `/portfolio/${project.slug}` },
          ]),
        ]}
      />
      <WorkDetail
        project={project}
        nextProject={nextProject?.slug === slug ? null : nextProject}
      />
      <CtaBanner
        title="Need a similar outcome?"
        description="Let’s talk about your product goals, timeline, and the constraints that matter."
        label="Start a project"
      />
    </SiteShell>
  );
}
