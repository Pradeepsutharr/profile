import React from "react";
import { supabase } from "@/lib/supabaseClient";
import dynamic from "next/dynamic";

const ProjectDetailsComponent = dynamic(
  () => import("../../components/project-details"),
  { ssr: true },
);

function ProjectDetails({ project }) {
  return <ProjectDetailsComponent projectData={project} />;
}

export default ProjectDetails;

export async function getStaticPaths() {
  try {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("slug");

    if (error) {
      console.error("Supabase error fetching slugs for static paths:", error);
      return { paths: [], fallback: "blocking" };
    }

    const paths = projects
      ?.filter((p) => p.slug)
      .map((p) => ({
        params: { slug: p.slug },
      })) || [];

    return {
      paths,
      fallback: "blocking",
    };
  } catch (err) {
    console.error("Unexpected error in getStaticPaths:", err);
    return { paths: [], fallback: "blocking" };
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Supabase error fetching project by slug:", error);
      return { notFound: true, revalidate: 60 };
    }

    if (!data) {
      return { notFound: true, revalidate: 60 };
    }

    return {
      props: {
        project: data,
      },
      revalidate: 60, // Revalidate every 60 seconds (ISR)
    };
  } catch (err) {
    console.error("Unexpected error in getStaticProps:", err);
    return { notFound: true, revalidate: 60 };
  }
}

