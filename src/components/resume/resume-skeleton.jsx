// ResumeSkeleton.jsx
import React from "react";
import { BookOpen } from "lucide-react";

export default function ResumeSkeleton() {
  return (
    <section className="animate-pulse">
      <div className="flex items-center justify-between">
        <h1 className="w-56 h-8 bg-elevated rounded-md"></h1>
      </div>

      <div className="bg-primary w-10 h-[5px] rounded-full my-5"></div>

      {/* Experience */}
      <div className="mt-6">
        <div className="flex items-start gap-5 ">
          <div className="icon-box p-4 rounded-xl text-primary">
            <BookOpen size={20} />
          </div>
          <div className="flex-1">
            <div className="w-64 h-8 bg-elevated rounded-md mb-4"></div>

            {/* 3 timeline placeholders */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="mt-5">
                <div className="timeline-item relative">
                  <div className="w-48 h-5 bg-elevated rounded-md mb-2"></div>
                  <div className="w-32 h-4 bg-elevated rounded-md mb-1"></div>
                  <div className="w-36 h-4 bg-elevated rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="mt-12">
        <div className="flex items-start gap-5 ">
          <div className="icon-box p-4 rounded-xl text-primary">
            <BookOpen size={20} />
          </div>
          <div className="flex-1">
            <div className="w-56 h-8 bg-elevated rounded-md mb-4"></div>

            {/* 2 education placeholders */}
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="mt-5">
                <div className="timeline-item relative">
                  <div className="w-44 h-5 bg-elevated rounded-md mb-2"></div>
                  <div className="w-36 h-4 bg-elevated rounded-md mb-1"></div>
                  <div className="w-40 h-4 bg-elevated rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-16">
        <div className="relative mb-6">
          <div className="w-64 h-8 bg-elevated rounded-md"></div>
          <div className="w-12 h-1 bg-primary/20 rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface/20 border border-stroke/40 p-6 md:p-8 rounded-2xl">
          {/* 6 skill placeholders */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="w-28 h-5 bg-elevated rounded-md" />
                <div className="w-10 h-5 bg-elevated rounded-md" />
              </div>
              <div className="w-full bg-stroke/60 h-2.5 rounded-full overflow-hidden border border-stroke/10">
                <div
                  className="bg-elevated/85 h-full rounded-full"
                  style={{ width: `${30 + (i % 4) * 20}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
