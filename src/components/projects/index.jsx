import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProjectCard from "./project-card";
import ProjectsSkeleton from "./projects-skeleton";

function ProjectsComponent() {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("all");

  const categories = ["all", "web design", "ui-ux design", "web development"];

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("order", { ascending: true, nulls: "last" })
        .order("created_at", { ascending: false });
      if (error) console.error("projects error", error);

      setProjects(data || []);
      setFiltered(data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <ProjectsSkeleton />;

  // Handle category filter
  const handleFilter = (category) => {
    setActive(category);

    if (category === "all") {
      setFiltered(projects);
    } else {
      const filteredList = projects.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
      setFiltered(filteredList);
    }
  };

  return (
    <section>
      <h1 className="text-3xl text-main font-semibold">Portfolio</h1>
      <div className="bg-primary w-10 h-[5px] rounded-full my-5"></div>

      {/* FILTER BUTTONS */}
      <div className="filter-btns flex flex-nowrap items-center gap-2 mt-5 overflow-x-scroll lg:min-h-[48px] hide-scrollbar m-[-.75rem]">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => handleFilter(item)}
            className={`capitalize font-normal px-4 py-1 rounded-md transition-all whitespace-nowrap
              ${active === item ? "text-primary" : "text-subtle"}
            `}
          >
            {item}
          </button>
        ))}
      </div>

      {/* PROJECT CARDS */}
      <div className="flex flex-wrap items-center justify-between mt-6 m-[-.75rem]">
        {loading && <p>Loading...</p>}

        {!loading &&
          filtered?.map((item) => (
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
