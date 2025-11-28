import React from "react";
import { supabase } from "@/lib/supabaseClient";
import dynamic from "next/dynamic";

const ProjectDetailsComponent = dynamic(() =>
  import("../../components/project-details")
);

function ProjectDetails({ project }) {
  return <ProjectDetailsComponent projectData={project} />;
}

export default ProjectDetails;

export async function getServerSideProps({ params }) {
  console.log("SSR RUNNING with slug:", params.slug);
  const { slug } = params;
  console.log("getServerSideProps hit for slug:", slug);

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();

    console.log("supabase data:", data);
    console.log("supabase error:", error);

    if (error) {
      console.error("Supabase error fetching project by slug:", error);
      return { notFound: true };
    }

    if (!data) {
      return { notFound: true };
    }

    return {
      props: {
        project: data,
      },
    };
  } catch (err) {
    console.error("Unexpected error in getServerSideProps:", err);
    return { notFound: true };
  }
}
