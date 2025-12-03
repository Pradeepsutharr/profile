import About from "@/components/about";
import Head from "next/head";
import SEO from "@/common/seo";
import SEOConfig from "@/common/seo.config";

export default function Home() {
  return (
    <>
      <SEO {...SEOConfig.home} />
      <About />
    </>
  );
}
