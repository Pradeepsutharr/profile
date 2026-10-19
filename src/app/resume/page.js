import { ResumeContent } from "@/components/site/resume-content";
import { SiteShell } from "@/components/site/site-shell";
import { getCollection, getSiteContext } from "@/lib/server/site-data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Resume" };
export default async function ResumePage() {
  const [{ profile, settings }, experience, education, skills] =
    await Promise.all([
      getSiteContext(),
      getCollection("experience"),
      getCollection("education"),
      getCollection("skills"),
    ]);
  return (
    <SiteShell profile={profile} settings={settings}>
      <ResumeContent
        experience={experience}
        education={education}
        skills={skills}
      />
    </SiteShell>
  );
}
