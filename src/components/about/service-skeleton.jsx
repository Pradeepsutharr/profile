import React from "react";

export default function ServicesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse mt-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-stroke/60 bg-[#212123]/20 p-6 flex gap-5 items-start">
          {/* Icon placeholder */}
          <div className="w-12 h-12 bg-[#2b2b2c] rounded-xl flex-shrink-0" />
          
          {/* Content placeholders */}
          <div className="flex-grow space-y-3">
            <div className="w-32 h-5 bg-[#2b2b2c] rounded-md" />
            <div className="space-y-2">
              <div className="w-full h-3.5 bg-[#2b2b2c] rounded-md" />
              <div className="w-5/6 h-3.5 bg-[#2b2b2c] rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
