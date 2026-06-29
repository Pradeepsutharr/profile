import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProjectCard from "./project-card";
import ProjectsSkeleton from "./projects-skeleton";

function ProjectsComponent({ initialProjects }) {
  const [projects, setProjects] = useState(initialProjects || []);
  const [filtered, setFiltered] = useState(initialProjects || []);
  const [loading, setLoading] = useState(!initialProjects);
  const [active, setActive] = useState("all");

  const categories = ["all", "web design", "ui-ux design", "web development"];

  useEffect(() => {
    if (initialProjects) {
      setProjects(initialProjects);
      setFiltered(initialProjects);
      setLoading(false);
    } else {
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
    }
  }, [initialProjects]);

  if (loading) return <ProjectsSkeleton />;

  // Handle category filter
  const handleFilter = (category) => {
    setActive(category);

    if (category === "all") {
      setFiltered(projects);
    } else {
      const filteredList = projects.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase(),
      );
      setFiltered(filteredList);
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background radial glow */}
      {/* <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" /> */}

      {/* Header */}
      <div className="relative mb-8">
        <h1 className="text-3xl text-main font-bold tracking-tight">Portfolio</h1>
        <div className="relative w-12 h-1 bg-gradient-to-r from-primary to-primary/20 rounded-full mt-3">
          <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-25" />
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="filter-btns flex flex-wrap items-center gap-2 mt-6 mb-8">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => handleFilter(item)}
            className={`capitalize text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-300 whitespace-nowrap tracking-wide
              ${active === item
                ? "bg-primary/10 border-primary/30 text-primary shadow-[0_4px_20px_rgba(255,219,112,0.1)]"
                : "border-stroke/60 bg-surface/20 text-subtle hover:border-stroke hover:text-main hover:bg-input/40"
              }
            `}
          >
            {item}
          </button>
        ))}
      </div>

      {/* PROJECT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading &&
          filtered?.map((item) => (
            <ProjectCard
              key={item?.id}
              image={item?.bg_image}
              title={item?.title}
              category={item?.category}
              slug={item?.slug}
            />
          ))}
      </div>
    </section>
  );
}

export default ProjectsComponent;
