import React from "react";

export default function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl border border-stroke/50 bg-[#212123]/20 p-4 animate-pulse">
      {/* Aspect ratio image placeholder */}
      <div className="relative aspect-[3/2] w-full rounded-xl overflow-hidden bg-[#2b2b2c]">
        <div className="absolute inset-0 bg-[#2b2b2c]"></div>
      </div>

      {/* Title + category placeholders */}
      <div className="mt-4 px-1">
        <div className="w-16 h-5 bg-[#2b2b2c] rounded-md mb-2"></div>
        <div className="w-36 h-5 bg-[#2b2b2c] rounded-md"></div>
      </div>
    </div>
  );
}
