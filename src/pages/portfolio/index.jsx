import SEO from "@/common/seo";
import SEOConfig from "@/common/seo.config";
import ProjectsComponent from "@/components/projects";
import React from "react";
import { fetchActiveUser, supabase } from "@/lib/supabaseClient";

function Portfolio({ activeUser, projects }) {
  return (
    <>
      <SEO {...SEOConfig.portfolio} />
      <ProjectsComponent initialProjects={projects} />
    </>
  );
}

export async function getStaticProps() {
  const [activeUser, pRes] = await Promise.all([
    fetchActiveUser(),
    supabase
      .from("projects")
      .select("*")
      .order("order", { ascending: true, nulls: "last" })
      .order("created_at", { ascending: false }),
  ]);

  return {
    props: {
      activeUser,
      projects: pRes.data || [],
    },
    revalidate: 60,
  };
}

export default Portfolio;
