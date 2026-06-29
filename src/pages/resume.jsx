import ResumePage from "@/components/resume";
import React from "react";
import SEO from "@/common/seo";
import SEOConfig from "@/common/seo.config";
import { fetchActiveUser, supabase } from "@/lib/supabaseClient";

function resume({ activeUser, skills, education, experience }) {
  return (
    <>
      <SEO {...SEOConfig.resume} />
      <ResumePage
        initialSkills={skills}
        initialEducation={education}
        initialExperience={experience}
      />
    </>
  );
}

export async function getStaticProps() {
  const [activeUser, sRes, eRes, exRes] = await Promise.all([
    fetchActiveUser(),
    supabase.from("skills").select("*").order("order", { ascending: true }),
    supabase.from("education").select("*").order("order", { ascending: true }),
    supabase.from("experience").select("*").order("order", { ascending: true }),
  ]);

  return {
    props: {
      activeUser,
      skills: sRes.data || [],
      education: eRes.data || [],
      experience: exRes.data || [],
    },
    revalidate: 60,
  };
}

export default resume;
