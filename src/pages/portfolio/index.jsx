import SEO from "@/common/seo";
import SEOConfig from "@/common/seo.config";
import ProjectsComponent from "@/components/projects";
import React from "react";

function Portfolio() {
  return (
    <>
      <SEO {...SEOConfig.portfolio} />

      <ProjectsComponent />
    </>
  );
}

export default Portfolio;
