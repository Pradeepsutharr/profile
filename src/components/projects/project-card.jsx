import Image from "next/image";
import React from "react";
import Link from "next/link";
import { Eye } from "lucide-react";

function ProjectCard({ image, title, category, slug }) {
  return (
    <Link
      href={{
        pathname: "/portfolio/[slug]",
        query: { slug },
      }}
      className="project-card"
    >
      <div className="project-image relative rounded-lg overflow-hidden group">
        <Image
          src={image}
          alt={title}
          width={256}
          height={171}
          priority
          className="object-cover w-full group-hover:scale-110 group-hover:brightness-50 duration-200"
        />

        <div
          className="opacity-0 group-hover:opacity-100 absolute top-[50%] left-[50%] p-3 bg-[#383838] rounded-lg duration-300"
          style={{ translate: "-50% -50%" }}
        >
          <Eye color="#ffdb70" size={20} />
        </div>
      </div>
      <h2 className="text-main text-base font-medium mt-3 capitalize">
        {title}
      </h2>
      <span className="text-subtle font-light capitalize">{category}</span>
    </Link>
  );
}

export default ProjectCard;
