import React from "react";
import ProjectCardSkeleton from "./project-card-skeleton";

export default function ProjectsSkeleton({ count = 6 }) {
  return (
    <section className="relative overflow-hidden animate-pulse">
      {/* Header */}
      <div className="relative mb-8">
        <div className="w-48 h-8 bg-elevated rounded-md" />
        <div className="w-12 h-1 bg-primary/20 rounded-full mt-3" />
      </div>

      {/* Filter buttons row placeholder */}
      <div className="filter-btns flex flex-wrap items-center gap-2 mt-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-20 h-8 bg-elevated rounded-full" />
        ))}
      </div>

      {/* Project cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
