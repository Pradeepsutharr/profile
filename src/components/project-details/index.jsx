import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

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
    <section>
      <h1 className="text-3xl text-main font-semibold capitalize">
        {projectDetails.title}
      </h1>
      <div className="bg-primary w-10 h-[5px] rounded-full my-5"></div>
    </section>
  );
}

export default ProjectDetailsComponent;
