import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SEO from "@/common/seo";

function ProjectDetailsComponent({ projectData }) {
  const router = useRouter();
  const slug = router.query.slug;
  const [loading, setLoading] = useState(true);
  const [projectDetails, setProjectDetails] = useState(projectData || {});

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      <SEO
        ogTitle={projectDetails?.title ?? projectData?.title ?? ""}
        ogUrl={
          projectDetails?.slug
            ? `https://pradeep-suthar.vercel.app/portfolio/${projectDetails.slug}/`
            : projectData?.slug
            ? `https://pradeep-suthar.vercel.app/portfolio/${projectDetails.slug}/`
            : "https://pradeep-suthar.vercel.app/portfolio"
        }
        ogImage={projectDetails?.bg_image ?? projectData?.bg_image ?? ""}
        pageTitle={projectDetails?.title ?? projectData?.title ?? ""}
        pageDescription={
          projectDetails?.meta_description ??
          projectData?.meta_description ??
          "View selected frontend development and product design projects built with React, Next.js, and modern UI/UX principles focused on usability and performance."
        }
        keywords={`${
          projectDetails?.keywords ??
          projectData?.keywords ??
          "Frontend Portfolio, UI UX Portfolio, React Projects, Next.js Portfolio, Product Design Work, Interface Design Portfolio"
        }`}
      />
      <section>
        <h1 className="text-3xl text-main font-semibold capitalize">
          {projectDetails.title}
        </h1>
        <div className="bg-primary w-10 h-[5px] rounded-full my-5"></div>
      </section>
    </>
  );
}

export default ProjectDetailsComponent;
