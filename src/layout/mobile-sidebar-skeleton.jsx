import React from "react";

export default function MobileSidebarSkeleton() {
    return(
        <div className="max-h-[113px] bg-[#1e1e1f] border border-stroke rounded-2xl animate-pulse lg:sticky top-[60px] p-4">
            <div className="flex items-center gap-6">
                <div className="avatar-box max-w-[81px] max-h-[81px] rounded-2xl p-3 flex items-center justify-center">
                    <div className="w-[60px] h-[60px] bg-[#2b2b2c] rounded-xl"></div>
                </div>

               <div className="flex flex-col gap-3">
                   <div className="min-h-7 min-w-40 bg-[#2b2b2c] rounded-md"></div>
                   <div className="min-h-7 min-w-36 max-w-36 bg-[#2b2b2c] rounded-md"></div>
               </div>

            </div>
        </div>
    )
}