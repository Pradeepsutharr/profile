import SEO from "@/common/seo";
import SEOConfig from "@/common/seo.config";
import ContactPage from "@/components/contact";
import React from "react";

function Contact() {
  return (
    <>
      <SEO {...SEOConfig.contact} />
      <ContactPage />
    </>
  );
}

export default Contact;
