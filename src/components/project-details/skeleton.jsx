function ProjectDetailsSkeleton() {
  return (
    <section className="relative overflow-hidden animate-pulse">
      {/* Heading */}
      <div className="relative mb-8">
        <div className="w-48 h-8 bg-elevated rounded-md" />
        <div className="w-12 h-1 bg-primary/20 rounded-full mt-3" />
      </div>

      {/* Back link */}
      <div className="w-44 h-5 bg-elevated rounded-md mb-6"></div>

      {/* Hero image aspect box */}
      <div className="relative aspect-[16/9] w-full max-h-[50vh] bg-elevated rounded-2xl mb-8"></div>

      {/* Meta info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-surface/20 border border-stroke/40 p-4 rounded-xl"
          >
            <div className="w-12 h-12 bg-elevated rounded-lg flex-shrink-0" />
            <div className="flex-grow space-y-2">
              <div className="w-16 h-3 bg-elevated rounded-md" />
              <div className="w-24 h-4 bg-elevated rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="space-y-3 bg-surface/10 border border-stroke/30 rounded-2xl p-6 md:p-8">
        <div className="w-full h-4 bg-elevated rounded-md"></div>
        <div className="w-full h-4 bg-elevated rounded-md"></div>
        <div className="w-10/12 h-4 bg-elevated rounded-md"></div>
        <div className="w-8/12 h-4 bg-elevated rounded-md"></div>
      </div>

      {/* Tech stack */}
      <div className="my-10">
        <div className="w-32 h-6 bg-elevated rounded-md mb-4"></div>
        <div className="flex gap-2.5 flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-24 h-8 bg-elevated rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Snapshots */}
      <div className="my-8">
        <div className="flex justify-between items-center mb-6">
          <div className="w-32 h-6 bg-elevated rounded-md"></div>
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-elevated rounded-lg"></div>
            <div className="w-10 h-10 bg-elevated rounded-lg"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="aspect-[3/2] bg-elevated rounded-xl"></div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectDetailsSkeleton;
