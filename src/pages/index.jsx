import About from "@/components/about";
import SEO from "@/common/seo";
import SEOConfig from "@/common/seo.config";
import { fetchActiveUser } from "@/lib/supabaseClient";

export default function Home() {
  return (
    <>
      <SEO {...SEOConfig.home} isHome />
      <About />
    </>
  );
}

export async function getStaticProps() {
  const activeUser = await fetchActiveUser();
  return {
    props: {
      activeUser,
    },
    revalidate: 60,
  };
}
