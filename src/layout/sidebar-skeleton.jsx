// SideBarSkeleton.jsx
import React from "react";

export default function SideBarSkeleton() {
  return (
    <div className="px-8 py-10 flex flex-col items-center bg-[#1e1e1f] border border-stroke rounded-3xl animate-pulse lg:sticky top-[60px]">
      {/* Avatar skeleton */}
      <div className="avatar-box max-w-[200px] max-h-[200px] rounded-3xl p-4 flex items-center justify-center">
        <div className="w-[140px] h-[140px] bg-[#2b2b2c] rounded-3xl"></div>
      </div>

      {/* Name */}
      <div className="w-40 h-6 bg-[#2b2b2c] rounded-md my-6"></div>

      {/* Title */}
      <div className="w-32 h-6 bg-[#2b2b2c] rounded-md"></div>

      <div className="bg-[#383838] w-full min-h-[1px] my-8"></div>

      {/* Email */}
      <div className="w-full flex items-center gap-4">
        <div className="w-1/4 max-w-[48px] max-h-[48px] min-w-[48px] min-h-[48px] bg-[#2b2b2c] rounded-lg"></div>
        <div className="w-3/4">
          <div className="w-20 h-4 bg-[#2b2b2c] rounded"></div>
          <div className="w-32 h-5 bg-[#2b2b2c] rounded mt-2"></div>
        </div>
      </div>

      {/* Phone */}
      <div className="w-full flex items-center gap-4 mt-8">
        <div className="w-1/4 max-w-[48px] max-h-[48px] min-w-[48px] min-h-[48px] bg-[#2b2b2c] rounded-lg"></div>
        <div className="w-3/4">
          <div className="w-20 h-4 bg-[#2b2b2c] rounded"></div>
          <div className="w-32 h-5 bg-[#2b2b2c] rounded mt-2"></div>
        </div>
      </div>

      {/* Location */}
      <div className="w-full flex items-center gap-4 mt-8">
        <div className="w-1/4 max-w-[48px] max-h-[48px] min-w-[48px] min-h-[48px] bg-[#2b2b2c] rounded-lg"></div>
        <div className="w-3/4">
          <div className="w-20 h-4 bg-[#2b2b2c] rounded"></div>
          <div className="w-40 h-5 bg-[#2b2b2c] rounded mt-2"></div>
        </div>
      </div>

      {/* Social Icons */}
      <div className="flex flex-wrap items-center justify-between w-full mt-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="max-w-[35px] max-h-[35px] min-w-[35px] min-h-[35px] rounded-md bg-[#2b2b2c]"
          ></div>
        ))}
      </div>
    </div>
  );
}
