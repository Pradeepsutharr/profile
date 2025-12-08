// ResumeSkeleton.jsx
import React from "react";
import { BookOpen } from "lucide-react";

export default function ResumeSkeleton() {
  return (
    <section className="animate-pulse">
      <div className="flex items-center justify-between">
        <h1 className="w-56 h-8 bg-[#2b2b2c] rounded-md"></h1>
      </div>

      <div className="bg-primary w-10 h-[5px] rounded-full my-5"></div>

      {/* Experience */}
      <div className="mt-6">
        <div className="flex items-start gap-5 ">
          <div className="icon-box p-4 rounded-xl text-primary">
            <BookOpen size={20} />
          </div>
          <div className="flex-1">
            <div className="w-64 h-8 bg-[#2b2b2c] rounded-md mb-4"></div>

            {/* 3 timeline placeholders */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="mt-5">
                <div className="timeline-item relative">
                  <div className="w-48 h-5 bg-[#2b2b2c] rounded-md mb-2"></div>
                  <div className="w-32 h-4 bg-[#2b2b2c] rounded-md mb-1"></div>
                  <div className="w-36 h-4 bg-[#2b2b2c] rounded-md"></div>
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
            <div className="w-56 h-8 bg-[#2b2b2c] rounded-md mb-4"></div>

            {/* 2 education placeholders */}
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="mt-5">
                <div className="timeline-item relative">
                  <div className="w-44 h-5 bg-[#2b2b2c] rounded-md mb-2"></div>
                  <div className="w-36 h-4 bg-[#2b2b2c] rounded-md mb-1"></div>
                  <div className="w-40 h-4 bg-[#2b2b2c] rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-16">
        <div className="flex items-center gap-5 ">
          <div className="w-64 h-8 bg-[#2b2b2c] rounded-md"></div>
        </div>

        <div className="flex flex-wrap justify-between mt-5 gredient-jet p-4 rounded-2xl border border-stroke">
          {/* 6 skill placeholders (two per row on large screens) */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="col-12 lg:col-6 mb-6">
              <div>
                <div className="w-40 h-5 bg-[#2b2b2c] rounded-md mb-2"></div>
                <div className="w-full bg-[#383838] h-[9px] rounded-full">
                  <div
                    className="bg-primary h-[9px] rounded-full"
                    style={{ width: `${20 + (i % 5) * 15}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
