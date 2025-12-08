import React from "react";

export default function ProjectCardSkeleton() {
  return (
    <div className="project-card animate-pulse">
      <div className="project-image relative rounded-lg overflow-hidden group">
        {/* Image placeholder — same aspect ratio as 256x171 */}
        <div
          className="w-full"
          style={{ paddingTop: "66.8%" /* 171/256 = 0.668 */ }}
        >
          <div className="absolute inset-0 bg-[#2b2b2c]"></div>
        </div>
      </div>

      {/* Title + category placeholders */}
      <div className="mt-3">
        <div className="w-40 h-5 bg-[#2b2b2c] rounded-md mb-2"></div>
        <div className="w-24 h-4 bg-[#2b2b2c] rounded-md"></div>
      </div>
    </div>
  );
}
