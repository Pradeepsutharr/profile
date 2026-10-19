import { CtaBanner } from "@/components/site/cta-banner";
import { ResumeContent } from "@/components/site/resume-content";
import { JsonLd } from "@/components/site/json-ld";
import { SiteShell } from "@/components/site/site-shell";
import { getCollection, getSiteContext } from "@/lib/server/site-data";
import {
  breadcrumbJsonLd,
  metadataFromConfig,
  personJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { profile } = await getSiteContext();
  return metadataFromConfig("resume", { profile });
}

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
      <JsonLd
        data={[
          personJsonLd(profile),
          webPageJsonLd({
            name: `${profile.name} Resume`,
            description: `Experience and skills for ${profile.name}.`,
            path: "/resume",
            type: "ProfilePage",
            profile,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Resume", path: "/resume" },
          ]),
        ]}
      />
      <ResumeContent
        experience={experience}
        education={education}
        skills={skills}
      />
      <CtaBanner
        title="Want this skill set on your product?"
        description="Let’s talk about your roadmap, constraints, and where design-to-code can move the needle."
      />
    </SiteShell>
  );
}
