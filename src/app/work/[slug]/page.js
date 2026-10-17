import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { WorkDetail } from "@/components/site/work-content";
import { getCollection, getBySlug, getSiteContext } from "@/lib/server/site-data";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }) { const { slug } = await params; const project = await getBySlug("projects", slug); return { title: project ? project.title : "Project" }; }
export default async function WorkDetailPage({ params }) { const { slug } = await params; const [{ profile, settings }, projects, project] = await Promise.all([getSiteContext(), getCollection("projects"), getBySlug("projects", slug)]); if (!project) notFound(); const index = projects.findIndex((item) => item.slug === slug); const nextProject = projects[(index + 1) % projects.length]; return <SiteShell profile={profile} settings={settings}><WorkDetail project={project} nextProject={nextProject?.slug === slug ? null : nextProject} /></SiteShell>; }
