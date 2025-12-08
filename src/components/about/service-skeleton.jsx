import React from "react";

export default function ServicesSkeleton() {
  return (
    <section>
      <div className="flex flex-wrap items-center justify-between m-[-.75rem] animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="col-12 md:col-6">
            <div className="icon-box service-card flex flex-wrap items-center justify-between rounded-xl px-5 py-4 min-h-[164px]">
              {/* Icon placeholder */}
              <div className="col-12 md:col-3 lg:col-2">
                <div className="w-[50px] h-[50px] bg-[#2b2b2c] rounded-xl"></div>
              </div>

              {/* Title + Description */}
              <div className="col-12 md:col-9 lg:col-10">
                <div className="w-40 h-6 bg-[#2b2b2c] rounded-md"></div>
                <div className="w-full h-4 bg-[#2b2b2c] rounded-md mt-3"></div>
                <div className="w-3/4 h-4 bg-[#2b2b2c] rounded-md mt-2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
