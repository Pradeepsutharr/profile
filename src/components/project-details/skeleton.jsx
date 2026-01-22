function ProjectDetailsSkeleton() {
  return (
    <section>
      {/* Heading */}
      <div className="skeleton w-32 h-8 mb-4"></div>
      <div className="skeleton w-10 h-[5px] rounded-full mb-6"></div>

      {/* Back link */}
      <div className="skeleton w-44 h-4 mb-6"></div>

      {/* Hero image */}
      <div className="relative mx-[-1.5rem] h-[55vh] skeleton rounded-none mb-8"></div>

      {/* Meta info */}
      <div className="flex flex-wrap gap-y-7 my-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-full md:w-2/4 lg:w-1/3 flex items-start gap-3"
          >
            <div className="icon-box min-w-[48px] min-h-[48px] skeleton"></div>

            <div className="flex-1 space-y-2">
              <div className="skeleton w-20 h-4"></div>
              <div className="skeleton w-32 h-5"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="space-y-3">
        <div className="skeleton w-full h-4"></div>
        <div className="skeleton w-full h-4"></div>
        <div className="skeleton w-10/12 h-4"></div>
        <div className="skeleton w-8/12 h-4"></div>
      </div>

      {/* Tech stack */}
      <div className="my-10">
        <div className="skeleton w-32 h-6 mb-4"></div>

        <div className="flex gap-3 flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton w-24 h-10 rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* Snapshots */}
      <div className="my-8">
        <div className="flex justify-between items-center mb-6">
          <div className="skeleton w-32 h-6"></div>

          <div className="flex gap-4">
            <div className="icon-box p-2 skeleton w-10 h-10"></div>
            <div className="icon-box p-2 skeleton w-10 h-10"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="skeleton h-[260px] rounded-md"></div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex gap-3 justify-start mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton w-10 h-2 rounded-full"></div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectDetailsSkeleton;
