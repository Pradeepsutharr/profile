import Image from "next/image";
import React from "react";
import Link from "next/link";

function ProjectCard({ image, title, category, slug }) {
  return (
    <Link
      href={{
        pathname: "/portfolio/[slug]",
        query: { slug },
      }}
      className="project-card"
    >
      <div className="image rounded-lg overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={256}
          height={171}
          priority
          className="object-cover w-full"
        />
      </div>
      <h2 className="text-main text-base font-medium mt-3 capitalize">
        {title}
      </h2>
      <span className="text-subtle font-light capitalize">{category}</span>
    </Link>
  );
}

export default ProjectCard;
