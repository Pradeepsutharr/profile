import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProjectCard from "./project-card";

function ProjectsComponent() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const { data, error } = await supabase.from("projects").select("*");

      if (error) console.error("projects error", error);

      setProjects(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <section>
      <h1 className="text-3xl text-main font-semibold">Portfolio</h1>
      <div className="bg-primary w-10 h-[5px] rounded-full my-5"></div>

      <div className="filter-btns flex items-center gap-6 mt-5">
        {["all", "web-design", "ui-ux design", "web development"].map(
          (item, index) => (
            <button key={index} className="capitalize text-subtle font-normal">
              {item}
            </button>
          )
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center">
        {projects?.length > 0 &&
          projects.map((item) => (
            <div key={item?.id} className="col-12 md:col-6 lg:col-4">
              <ProjectCard
                image={item?.bg_image}
                title={item?.title}
                category={item?.category}
                slug={item?.slug}
              />
            </div>
          ))}
      </div>
    </section>
  );
}

export default ProjectsComponent;
