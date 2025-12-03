import ResumePage from "@/components/resume";
import React from "react";
import SEO from "@/common/seo";
import SEOConfig from "@/common/seo.config";

function resume() {
  return (
    <>
      <SEO {...SEOConfig.resume} />
      <ResumePage />
    </>
  );
}

export default resume;
