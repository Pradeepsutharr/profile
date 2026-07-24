import Image from "next/image";
import React from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useRouter } from "next/router";

function ProjectCard({ image, title, category, slug }) {
  const router = useRouter();

  return (
    <Link
      href={{
        pathname: "/portfolio/[slug]",
        query: { slug },
      }}
      onMouseEnter={() => router.prefetch(`/portfolio/${slug}`)}
      className="group relative block"
    >
      {/* Visual background atmospheric wrapper */}
      <div className="h-full rounded-2xl glass-card glass-card-hoverable p-4">
        
        {/* Project Image Box */}
        <div className="relative aspect-[3/2] w-full rounded-xl overflow-hidden bg-elevated border border-stroke/20">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
            className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-[0.4]"
          />

          {/* Glass View Indicator */}
          <div
            className="opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 absolute top-[50%] left-[50%] p-3.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full transition-all duration-300"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <Eye className="text-primary" size={20} />
          </div>
        </div>

        {/* Text descriptions */}
        <div className="mt-4 px-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 border border-primary/20 rounded-md px-2 py-0.5 inline-block mb-2">
            {category}
          </span>
          <h3 className="text-main group-hover:text-primary font-bold text-base transition-colors duration-300 line-clamp-1">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;
