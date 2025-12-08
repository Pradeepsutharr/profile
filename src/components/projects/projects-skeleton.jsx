import React from "react";
import ProjectCardSkeleton from "./project-card-skeleton";

export default function ProjectsSkeleton({ count = 6 }) {
  // default 6 placeholders — matches typical grid fill for col sizes
  return (
    <section>
      <h1 className="w-56 h-8 bg-[#2b2b2c] rounded-md animate-pulse"></h1>
      <div className="bg-primary w-10 h-[5px] rounded-full my-5"></div>

      {/* Filter buttons row placeholder */}
      <div className="filter-btns flex flex-nowrap items-center gap-2 mt-5 overflow-x-scroll lg:min-h-[48px] hide-scrollbar m-[-.75rem]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="capitalize font-normal px-4 py-1 rounded-md transition-all whitespace-nowrap"
          >
            <div className="w-24 h-8 bg-[#2b2b2c] rounded-md"></div>
          </div>
        ))}
      </div>

      {/* Project cards grid */}
      <div className="flex flex-wrap items-center justify-between mt-6 m-[-.75rem]">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="col-12 md:col-6 lg:col-4 mb-6">
            <ProjectCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}
