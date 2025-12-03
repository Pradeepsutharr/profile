import SEO from "@/common/seo";
import SEOConfig from "@/common/seo.config";
import React from "react";

function Contact() {
  return (
    <>
      <SEO {...SEOConfig.contact} />
      <div>Contact</div>
    </>
  );
}

export default Contact;
